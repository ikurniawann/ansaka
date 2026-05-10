"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BarChart3, Building2, CheckCircle2, CreditCard, Plus, Users } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ensureUserProfile } from "@/lib/profiles";
import { supabase, type UserProfile } from "@/lib/supabase-client";

type BatchRow = {
  id: string;
  name: string | null;
  status: string;
  credits_allocated: number;
  credits_used: number;
  created_at: string;
  unique_link_token: string;
};

type OrganizationProfile = {
  name: string | null;
  industry: string | null;
  size_range: string | null;
  country: string | null;
};

type DivisionRow = {
  id: string;
  name: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [organization, setOrganization] = useState<OrganizationProfile | null>(null);
  const [divisions, setDivisions] = useState<DivisionRow[]>([]);
  const [recentBatches, setRecentBatches] = useState<BatchRow[]>([]);
  const [totalResponses, setTotalResponses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savingOnboarding, setSavingOnboarding] = useState(false);
  const [onboardingMessage, setOnboardingMessage] = useState<string | null>(null);
  const [onboardingForm, setOnboardingForm] = useState({
    name: "",
    industry: "",
    size_range: "",
    country: "Indonesia",
  });
  const [divisionName, setDivisionName] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }

      const p = await ensureUserProfile(session.user);
      if (!p) { router.replace("/login"); return; }
      setProfile(p);

      if (!p.organization_id) { setLoading(false); return; }

      const [orgRes, divisionRes, batchRes] = await Promise.all([
        supabase
          .from("organizations")
          .select("name, industry, size_range, country")
          .eq("id", p.organization_id)
          .single(),
        supabase
          .from("divisions")
          .select("id, name")
          .eq("organization_id", p.organization_id)
          .order("name"),
        supabase
          .from("survey_batches")
          .select("id, name, status, credits_allocated, credits_used, created_at, unique_link_token")
          .eq("organization_id", p.organization_id)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      const org = (orgRes.data ?? null) as OrganizationProfile | null;
      setOrganization(org);
      setOnboardingForm({
        name: org?.name ?? "",
        industry: org?.industry ?? "",
        size_range: org?.size_range ?? "",
        country: org?.country ?? "Indonesia",
      });
      setDivisions((divisionRes.data ?? []) as DivisionRow[]);
      setRecentBatches((batchRes.data ?? []) as BatchRow[]);

      // Count total responses from batch_results
      if (batchRes.data && batchRes.data.length > 0) {
        const { data: results } = await supabase
          .from("batch_results")
          .select("respondent_count")
          .in("batch_id", batchRes.data.map((b: BatchRow) => b.id));
        setTotalResponses(
          (results ?? []).reduce((sum: number, r: { respondent_count: number }) => sum + (r.respondent_count ?? 0), 0),
        );
      }

      setLoading(false);
    })();
  }, [router]);

  const activeBatches = recentBatches.filter((b) => b.status === "active").length;
  const organizationProfileComplete = Boolean(
    onboardingForm.name.trim() &&
    onboardingForm.industry &&
    onboardingForm.size_range &&
    onboardingForm.country.trim(),
  );
  const hasDivision = divisions.length > 0;
  const hasBatch = recentBatches.length > 0;
  const shouldShowOnboarding =
    profile?.role === "corporate_admin" &&
    Boolean(profile.organization_id) &&
    (!organizationProfileComplete || !hasDivision || !hasBatch);

  function statusBadge(status: string) {
    if (status === "active")  return <Badge variant="success">Aktif</Badge>;
    if (status === "closed")  return <Badge variant="muted">Selesai</Badge>;
    return <Badge variant="outline">Draft</Badge>;
  }

  async function handleSaveOnboarding(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile?.organization_id) return;

    setSavingOnboarding(true);
    setOnboardingMessage(null);

    try {
      const { error: orgError } = await supabase
        .from("organizations")
        .update({
          name: onboardingForm.name.trim(),
          industry: onboardingForm.industry,
          size_range: onboardingForm.size_range,
          country: onboardingForm.country.trim(),
        })
        .eq("id", profile.organization_id);

      if (orgError) throw orgError;

      const trimmedDivision = divisionName.trim();
      if (trimmedDivision) {
        const { data, error: divisionError } = await supabase
          .from("divisions")
          .insert({
            organization_id: profile.organization_id,
            name: trimmedDivision,
          })
          .select("id, name")
          .single();

        if (divisionError && divisionError.code !== "23505") throw divisionError;
        if (data) setDivisions((current) => [...current, data as DivisionRow]);
        setDivisionName("");
      }

      setOrganization({
        name: onboardingForm.name.trim(),
        industry: onboardingForm.industry,
        size_range: onboardingForm.size_range,
        country: onboardingForm.country.trim(),
      });
      setOnboardingMessage("Workspace tersimpan. Lanjutkan dengan membuat batch assessment pertama.");
    } catch (err) {
      setOnboardingMessage(err instanceof Error ? err.message : "Gagal menyimpan onboarding.");
    } finally {
      setSavingOnboarding(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Dashboard</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Selamat datang{profile?.full_name ? `, ${profile.full_name}` : ""}
          </h1>
          {organization?.name && <p className="mt-0.5 text-sm text-muted-foreground">{organization.name}</p>}
        </div>
        <Button asChild>
          <Link href="/dashboard/batches/new">
            <Plus className="size-4" />
            Batch Baru
          </Link>
        </Button>
      </div>

      {shouldShowOnboarding ? (
        <Card className="mt-8 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="border-b border-border bg-primary p-6 text-primary-foreground lg:border-b-0 lg:border-r">
                <div className="grid size-11 place-items-center rounded-full bg-primary-foreground text-primary">
                  <Building2 className="size-5" />
                </div>
                <p className="mt-6 text-xs uppercase tracking-widest opacity-70">Onboarding Workspace</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Lengkapi setup corporate admin
                </h2>
                <p className="mt-3 text-sm leading-6 opacity-75">
                  Tiga langkah ini membuat workspace siap dipakai untuk assessment: profil organisasi,
                  struktur divisi, lalu batch pertama.
                </p>

                <div className="mt-6 space-y-3">
                  {[
                    { done: organizationProfileComplete, label: "Profil organisasi" },
                    { done: hasDivision, label: "Minimal 1 divisi atau tim" },
                    { done: hasBatch, label: "Batch assessment pertama" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 text-sm">
                      <span className="grid size-6 place-items-center rounded-full bg-primary-foreground/15">
                        {item.done ? <CheckCircle2 className="size-4" /> : <span className="size-2 rounded-full bg-current opacity-45" />}
                      </span>
                      <span className={item.done ? "opacity-95" : "opacity-65"}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSaveOnboarding} className="space-y-5 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">Nama organisasi</Label>
                    <Input
                      id="org-name"
                      value={onboardingForm.name}
                      onChange={(event) => setOnboardingForm((current) => ({ ...current, name: event.target.value }))}
                      placeholder="PT Ansaka"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-country">Negara</Label>
                    <Input
                      id="org-country"
                      value={onboardingForm.country}
                      onChange={(event) => setOnboardingForm((current) => ({ ...current, country: event.target.value }))}
                      placeholder="Indonesia"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Industri</Label>
                    <Select
                      value={onboardingForm.industry}
                      onValueChange={(value) => setOnboardingForm((current) => ({ ...current, industry: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih industri" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="financial_services">Financial Services</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="professional_services">Professional Services</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Ukuran organisasi</Label>
                    <Select
                      value={onboardingForm.size_range}
                      onValueChange={(value) => setOnboardingForm((current) => ({ ...current, size_range: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih ukuran" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-50">1-50 karyawan</SelectItem>
                        <SelectItem value="51-200">51-200 karyawan</SelectItem>
                        <SelectItem value="201-1000">201-1000 karyawan</SelectItem>
                        <SelectItem value="1000+">1000+ karyawan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-[1.25rem] border border-border bg-muted/40 p-4">
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <div className="space-y-2">
                      <Label htmlFor="division-name">Divisi pertama</Label>
                      <Input
                        id="division-name"
                        value={divisionName}
                        onChange={(event) => setDivisionName(event.target.value)}
                        placeholder={hasDivision ? `${divisions.length} divisi sudah tersedia` : "Contoh: Management"}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button type="submit" disabled={savingOnboarding}>
                        {savingOnboarding ? "Menyimpan..." : "Simpan setup"}
                      </Button>
                    </div>
                  </div>
                  {onboardingMessage ? (
                    <p className="mt-3 text-xs text-muted-foreground">{onboardingMessage}</p>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
                  <p className="text-sm text-muted-foreground">
                    Setelah profil dan divisi siap, buat batch untuk mengirim link assessment.
                  </p>
                  <Button asChild variant={hasBatch ? "outline" : "default"}>
                    <Link href="/dashboard/batches/new">
                      Buat Batch
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <BarChart3 className="size-4" />
              Total Batch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{recentBatches.length}</p>
            <p className="text-xs text-muted-foreground">{activeBatches} sedang aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Users className="size-4" />
              Total Responden
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalResponses}</p>
            <p className="text-xs text-muted-foreground">dari semua batch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CreditCard className="size-4" />
              Saldo Kredit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{profile?.credit_balance ?? 0}</p>
            <p className="text-xs text-muted-foreground">
              <Link href="/dashboard/credits" className="underline underline-offset-2">
                Lihat paket →
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent batches */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Batch Terbaru</h2>
          <Button asChild variant="ghost">
            <Link href="/dashboard/batches">Lihat semua</Link>
          </Button>
        </div>

        {recentBatches.length === 0 ? (
          <div className="mt-4 rounded-[1.5rem] border border-dashed border-border p-12 text-center">
            <BarChart3 className="mx-auto size-10 text-muted-foreground/40" />
            <p className="mt-4 text-sm font-medium">Belum ada batch survey</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Buat batch pertama untuk mulai mengumpulkan data OAM.
            </p>
            <Button asChild className="mt-6">
              <Link href="/dashboard/batches/new">
                <Plus className="size-4" />
                Buat Batch Pertama
              </Link>
            </Button>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-border rounded-[1.5rem] border border-border bg-card">
            {recentBatches.map((batch) => (
              <Link
                key={batch.id}
                href={`/dashboard/batches/${batch.id}`}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-muted/50 first:rounded-t-[1.5rem] last:rounded-b-[1.5rem]"
              >
                <div>
                  <p className="text-sm font-medium">{batch.name ?? "Batch tanpa nama"}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(batch.created_at).toLocaleDateString("id-ID", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                    {" · "}
                    {batch.credits_used} / {batch.credits_allocated} kredit terpakai
                  </p>
                </div>
                {statusBadge(batch.status)}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
