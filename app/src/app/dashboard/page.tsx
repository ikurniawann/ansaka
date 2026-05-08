"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, CreditCard, Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orgName, setOrgName] = useState<string | null>(null);
  const [recentBatches, setRecentBatches] = useState<BatchRow[]>([]);
  const [totalResponses, setTotalResponses] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }

      const p = await ensureUserProfile(session.user);
      if (!p) { router.replace("/login"); return; }
      setProfile(p);

      if (!p.organization_id) { setLoading(false); return; }

      const [orgRes, batchRes] = await Promise.all([
        supabase.from("organizations").select("name").eq("id", p.organization_id).single(),
        supabase
          .from("survey_batches")
          .select("id, name, status, credits_allocated, credits_used, created_at, unique_link_token")
          .eq("organization_id", p.organization_id)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      setOrgName(orgRes.data?.name ?? null);
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

  function statusBadge(status: string) {
    if (status === "active")  return <Badge variant="success">Aktif</Badge>;
    if (status === "closed")  return <Badge variant="muted">Selesai</Badge>;
    return <Badge variant="outline">Draft</Badge>;
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
          {orgName && <p className="mt-0.5 text-sm text-muted-foreground">{orgName}</p>}
        </div>
        <Button asChild>
          <Link href="/dashboard/batches/new">
            <Plus className="size-4" />
            Batch Baru
          </Link>
        </Button>
      </div>

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
