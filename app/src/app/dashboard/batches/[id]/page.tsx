"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  Play,
  RefreshCw,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase-client";

type Batch = {
  id: string;
  name: string | null;
  status: "draft" | "active" | "closed";
  credits_allocated: number;
  credits_used: number;
  created_at: string;
  closed_at: string | null;
  unique_link_token: string;
  organization_id: string;
};

type BatchResult = {
  respondent_count: number;
  overall_score: number | null;
  maturity_level: string | null;
  computed_at: string;
} | null;

export default function BatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [batch, setBatch] = useState<Batch | null>(null);
  const [result, setResult] = useState<BatchResult>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function loadBatch() {
    const { data: b, error: batchError } = await supabase
      .from("survey_batches")
      .select("id, name, status, credits_allocated, credits_used, created_at, closed_at, unique_link_token, organization_id")
      .eq("id", id)
      .single();

    if (batchError) {
      throw new Error(batchError.message || "Gagal memuat batch.");
    }

    if (!b) { router.replace("/dashboard/batches"); return; }
    setBatch(b as Batch);

    const { data: r, error: resultError } = await supabase
      .from("batch_results")
      .select("respondent_count, overall_score, maturity_level, computed_at")
      .eq("batch_id", id)
      .maybeSingle();

    if (resultError) {
      throw new Error(resultError.message || "Gagal memuat hasil batch.");
    }

    setResult(r as BatchResult);
  }

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }
      await loadBatch();
      setLoading(false);
    })();
  }, [id]);  // eslint-disable-line react-hooks/exhaustive-deps

  async function handleActivate() {
    setActionLoading(true);
    setError(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const response = await fetch(`/api/batches/${id}/activate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Gagal mengaktifkan batch.");
      }

      await loadBatch();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal mengaktifkan batch.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleClose() {
    if (!confirm("Tutup batch ini? Survey link tidak akan bisa diakses lagi.")) return;
    setActionLoading(true);
    setError(null);
    try {
      const { error: closeError } = await supabase.rpc("close_batch", { p_batch_id: id });
      if (closeError) {
        throw new Error(closeError.message || "Gagal menutup batch.");
      }
      await loadBatch();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menutup batch.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleComputeResults() {
    setActionLoading(true);
    setError(null);
    try {
      const { error: computeError } = await supabase.rpc("compute_batch_results", { p_batch_id: id });
      if (computeError) {
        throw new Error(computeError.message || "Gagal menghitung hasil.");
      }
      await loadBatch();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menghitung hasil. Pastikan ada respons yang sudah lengkap.");
    } finally {
      setActionLoading(false);
    }
  }

  function copyLink() {
    if (!batch) return;
    navigator.clipboard.writeText(`${window.location.origin}/survey/${batch.unique_link_token}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function statusBadge(status: string) {
    if (status === "active")  return <Badge variant="success" className="text-sm px-3 py-1">Aktif</Badge>;
    if (status === "closed")  return <Badge variant="muted" className="text-sm px-3 py-1">Selesai</Badge>;
    return <Badge variant="outline" className="text-sm px-3 py-1">Draft</Badge>;
  }

  if (loading || !batch) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const surveyUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/survey/${batch.unique_link_token}`;
  const responseRate = batch.credits_allocated > 0
    ? Math.round((batch.credits_used / batch.credits_allocated) * 100)
    : 0;

  return (
    <div className="px-8 py-8">
      <Button asChild variant="ghost" className="mb-6 -ml-3">
        <Link href="/dashboard/batches">
          <ArrowLeft className="size-4" />
          Kembali
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Batch Survey</p>
            {statusBadge(batch.status)}
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            {batch.name ?? "Batch tanpa nama"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Dibuat {new Date(batch.created_at).toLocaleDateString("id-ID", {
              day: "numeric", month: "long", year: "numeric",
            })}
            {batch.closed_at && ` · Ditutup ${new Date(batch.closed_at).toLocaleDateString("id-ID", {
              day: "numeric", month: "long", year: "numeric",
            })}`}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {batch.status === "draft" && (
            <Button onClick={handleActivate} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
              Aktifkan Batch
            </Button>
          )}
          {batch.status === "active" && (
            <>
              <Button variant="outline" onClick={copyLink}>
                {copied ? <CheckCircle2 className="size-4 text-green-600" /> : <Copy className="size-4" />}
                {copied ? "Tersalin!" : "Salin Link Survey"}
              </Button>
              <Button variant="outline" onClick={handleClose} disabled={actionLoading}>
                {actionLoading ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
                Tutup Batch
              </Button>
            </>
          )}
          {batch.status === "closed" && (
            <>
              <Button variant="outline" onClick={handleComputeResults} disabled={actionLoading}>
                {actionLoading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                Hitung Hasil
              </Button>
              {result && (
                <Button asChild>
                  <Link href={`/dashboard/batches/${batch.id}/results`}>
                    <BarChart3 className="size-4" />
                    Lihat Laporan OAM
                  </Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Kredit Dialokasikan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{batch.credits_allocated}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Respons Masuk</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{batch.credits_used}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Tingkat Partisipasi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{responseRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Sisa Slot</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{Math.max(0, batch.credits_allocated - batch.credits_used)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Survey link */}
      {batch.status === "active" && (
        <div className="mt-6 rounded-[1.5rem] border border-border bg-card p-6">
          <h3 className="font-medium">Link Survey</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Bagikan link ini ke responden. Link hanya aktif selama status batch Aktif.
          </p>
          <div className="mt-4 flex items-center gap-3 rounded-[1rem] border border-border bg-background px-4 py-3">
            <span className="flex-1 truncate font-mono text-sm text-foreground">{surveyUrl}</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={copyLink} title="Salin">
                {copied ? <CheckCircle2 className="size-4 text-green-600" /> : <Copy className="size-4" />}
              </Button>
              <Button variant="ghost" size="icon" asChild title="Buka di tab baru">
                <Link href={surveyUrl} target="_blank">
                  <ExternalLink className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Results preview */}
      {result && (
        <div className="mt-6 rounded-[1.5rem] border border-green-500/30 bg-green-500/5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-medium text-green-700 dark:text-green-400">Hasil Tersedia</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Dihitung dari {result.respondent_count} responden ·{" "}
                {new Date(result.computed_at).toLocaleDateString("id-ID", {
                  day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{result.overall_score?.toFixed(2) ?? "-"}</p>
              <p className="text-sm text-muted-foreground">{result.maturity_level ?? ""}</p>
            </div>
          </div>
          <Button asChild className="mt-4">
            <Link href={`/dashboard/batches/${batch.id}/results`}>
              <BarChart3 className="size-4" />
              Lihat Laporan OAM Lengkap
            </Link>
          </Button>
        </div>
      )}

      {/* Guidance for draft */}
      {batch.status === "draft" && (
        <div className="mt-6 rounded-[1.5rem] border border-border bg-card p-6">
          <h3 className="font-medium">Langkah Selanjutnya</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Batch masih dalam status Draft. Klik <strong>Aktifkan Batch</strong> untuk mulai menerima respons.
            Saat diaktifkan, {batch.credits_allocated} kredit akan dikurangi dari saldo Anda.
          </p>
        </div>
      )}
    </div>
  );
}
