"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase-client";

type Division = { id: string; name: string };

export default function NewBatchPage() {
  const router = useRouter();
  const [orgId, setOrgId] = useState<string | null>(null);
  const [creditBalance, setCreditBalance] = useState(0);
  const [batchName, setBatchName] = useState("");
  const [credits, setCredits] = useState(30);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [newDivision, setNewDivision] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingInit, setLoadingInit] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }

      const { data: profile } = await supabase
        .from("users")
        .select("organization_id, credit_balance")
        .eq("id", session.user.id)
        .single();

      if (!profile?.organization_id) { router.replace("/dashboard"); return; }
      setOrgId(profile.organization_id);
      setCreditBalance(profile.credit_balance ?? 0);

      const { data: divs } = await supabase
        .from("divisions")
        .select("id, name")
        .eq("organization_id", profile.organization_id)
        .order("name");
      setDivisions((divs ?? []) as Division[]);
      setLoadingInit(false);
    })();
  }, [router]);

  async function addDivision() {
    if (!newDivision.trim() || !orgId) return;
    const { data, error: e } = await supabase
      .from("divisions")
      .insert({ organization_id: orgId, name: newDivision.trim() })
      .select()
      .single();
    if (e) { setError(e.message); return; }
    setDivisions((prev) => [...prev, data as Division].sort((a, b) => a.name.localeCompare(b.name)));
    setNewDivision("");
  }

  async function removeDivision(id: string) {
    await supabase.from("divisions").delete().eq("id", id);
    setDivisions((prev) => prev.filter((d) => d.id !== id));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (credits < 1) { setError("Kredit minimal 1."); return; }
    if (!orgId) return;

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sesi habis. Login kembali.");

      const { data: batch, error: batchErr } = await supabase
        .from("survey_batches")
        .insert({
          organization_id: orgId,
          name: batchName.trim() || null,
          credits_allocated: credits,
          created_by: session.user.id,
          status: "draft",
        })
        .select()
        .single();

      if (batchErr) throw batchErr;

      router.push(`/dashboard/batches/${batch.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  if (loadingInit) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      <Button asChild variant="ghost" className="mb-6 -ml-3">
        <Link href="/dashboard/batches">
          <ArrowLeft className="size-4" />
          Kembali ke Batches
        </Link>
      </Button>

      <p className="text-xs uppercase tracking-widest text-muted-foreground">Buat Batch Baru</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">Konfigurasi Survey Batch</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Batch name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nama Batch</Label>
            <Input
              id="name"
              placeholder="Contoh: Assessment Q1 2025 — Divisi Operations"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Nama opsional untuk memudahkan identifikasi batch.
            </p>
          </div>

          {/* Credits */}
          <div className="space-y-2">
            <Label htmlFor="credits">Alokasi Kredit (= jumlah responden)</Label>
            <div className="flex items-center gap-3">
              <Input
                id="credits"
                type="number"
                min={1}
                max={creditBalance}
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="max-w-[160px]"
              />
              <span className="text-sm text-muted-foreground">
                dari {creditBalance} kredit tersisa
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Setiap responden yang menyelesaikan survey akan mengkonsumsi 1 kredit.
              Kredit dikurangi saat batch diaktifkan.
            </p>
          </div>

          {/* Divisions */}
          <div className="space-y-3">
            <Label>Divisi / Unit Kerja</Label>
            <p className="text-xs text-muted-foreground">
              Tambah divisi agar responden bisa menandai unit kerjanya (opsional, untuk filter analitik).
            </p>

            <div className="flex gap-2">
              <Input
                placeholder="Nama divisi baru..."
                value={newDivision}
                onChange={(e) => setNewDivision(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDivision())}
              />
              <Button type="button" variant="outline" onClick={addDivision} disabled={!newDivision.trim()}>
                <Plus className="size-4" />
                Tambah
              </Button>
            </div>

            {divisions.length > 0 && (
              <div className="space-y-2">
                {divisions.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between rounded-[0.875rem] border border-border bg-card px-4 py-2.5"
                  >
                    <span className="text-sm">{d.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDivision(d.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {creditBalance < credits && (
            <Alert variant="warning">
              <AlertDescription>
                Saldo kredit tidak cukup. Anda memiliki {creditBalance} kredit, dibutuhkan {credits}.{" "}
                <Link href="/dashboard/credits" className="font-medium underline">
                  Tambah kredit →
                </Link>
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={loading || creditBalance < credits} className="h-12 px-8">
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Membuat batch...
              </>
            ) : (
              "Buat Batch (Draft)"
            )}
          </Button>
        </form>

        {/* Info sidebar */}
        <div className="space-y-4">
          <div className="rounded-[1.5rem] border border-border bg-card p-6">
            <h3 className="font-medium">Alur Batch Survey</h3>
            <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
              {[
                { n: 1, t: "Buat batch (status: Draft)" },
                { n: 2, t: "Aktifkan → kredit dikurangi dari saldo" },
                { n: 3, t: "Bagikan link survey ke responden" },
                { n: 4, t: "Kumpulkan respons (min. 10 untuk hasil akurat)" },
                { n: 5, t: "Tutup batch → hitung hasil OAM" },
                { n: 6, t: "Lihat laporan diagnostik lengkap" },
              ].map(({ n, t }) => (
                <li key={n} className="flex gap-3">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-muted font-mono text-xs">
                    {n}
                  </span>
                  {t}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-card p-6">
            <h3 className="font-medium">Paket Kredit Tersedia</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Saldo Anda saat ini: <strong className="text-foreground">{creditBalance} kredit</strong>
            </p>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link href="/dashboard/credits">Lihat paket kredit</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
