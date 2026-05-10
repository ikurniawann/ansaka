"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, CalendarDays, ExternalLink, FileText, RefreshCw, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase-client";

type ClosedBatch = {
  id: string;
  name: string | null;
  status: "closed";
  credits_allocated: number;
  credits_used: number;
  created_at: string;
  closed_at: string | null;
  batch_results: {
    respondent_count: number;
    overall_score: number | null;
    maturity_level: string | null;
    computed_at: string | null;
  } | null;
};

type ClosedBatchQueryRow = Omit<ClosedBatch, "batch_results"> & {
  batch_results:
    | ClosedBatch["batch_results"]
    | NonNullable<ClosedBatch["batch_results"]>[]
    | null;
};

function formatDate(date: string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ReportsPage() {
  const router = useRouter();
  const [batches, setBatches] = useState<ClosedBatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("organization_id")
        .eq("id", session.user.id)
        .single();

      if (!profile?.organization_id) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("survey_batches")
        .select(`
          id,
          name,
          status,
          credits_allocated,
          credits_used,
          created_at,
          closed_at,
          batch_results (
            respondent_count,
            overall_score,
            maturity_level,
            computed_at
          )
        `)
        .eq("organization_id", profile.organization_id)
        .eq("status", "closed")
        .order("closed_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });

      const normalized = ((data ?? []) as ClosedBatchQueryRow[]).map((batch) => ({
        ...batch,
        batch_results: Array.isArray(batch.batch_results)
          ? (batch.batch_results[0] ?? null)
          : batch.batch_results,
      }));

      setBatches(normalized);
      setLoading(false);
    })();
  }, [router]);

  const summary = useMemo(() => {
    return {
      totalReports: batches.length,
      computedReports: batches.filter((batch) => batch.batch_results).length,
      totalRespondents: batches.reduce(
        (sum, batch) => sum + (batch.batch_results?.respondent_count ?? 0),
        0,
      ),
    };
  }, [batches]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Report
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Batch Selesai
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Kumpulan batch survey yang sudah ditutup. Klik batch untuk melihat hasil OAM Insight.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/batches">
            <BarChart3 className="size-4" />
            Semua Batch
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground">
              <FileText className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Batch selesai</p>
              <p className="text-2xl font-bold">{summary.totalReports}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground">
              <RefreshCw className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Hasil tersedia</p>
              <p className="text-2xl font-bold">{summary.computedReports}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground">
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total responden</p>
              <p className="text-2xl font-bold">{summary.totalRespondents}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        {batches.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-border p-16 text-center">
            <FileText className="mx-auto size-12 text-muted-foreground/40" />
            <p className="mt-4 text-sm font-medium">Belum ada report</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Report akan muncul setelah batch survey ditutup.
            </p>
            <Button asChild className="mt-6">
              <Link href="/dashboard/batches">Lihat Batch Survey</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[1.5rem] border border-border bg-card">
            <div className="grid grid-cols-[1fr_140px_140px_130px_130px] border-b border-border px-6 py-3 text-xs font-medium text-muted-foreground">
              <span>Nama Batch</span>
              <span>Ditutup</span>
              <span>Responden</span>
              <span>Overall</span>
              <span>Aksi</span>
            </div>

            {batches.map((batch, index) => {
              const result = batch.batch_results;
              return (
                <Link
                  key={batch.id}
                  href={`/dashboard/batches/${batch.id}/results`}
                  className={[
                    "grid grid-cols-[1fr_140px_140px_130px_130px] items-center px-6 py-4 transition-colors hover:bg-muted/35",
                    index < batches.length - 1 ? "border-b border-border/60" : "",
                  ].join(" ")}
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {batch.name ?? "Batch tanpa nama"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Dibuat {formatDate(batch.created_at)} · {batch.credits_used}/{batch.credits_allocated} kredit terpakai
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="size-3.5" />
                    {formatDate(batch.closed_at)}
                  </div>

                  <div className="text-sm">
                    {result ? (
                      <span className="font-medium">{result.respondent_count}</span>
                    ) : (
                      <span className="text-muted-foreground">Belum dihitung</span>
                    )}
                  </div>

                  <div>
                    {result?.overall_score ? (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold tabular-nums">
                          {Number(result.overall_score).toFixed(2)}
                        </span>
                        {result.maturity_level ? (
                          <Badge variant="secondary" className="text-xs">
                            {result.maturity_level}
                          </Badge>
                        ) : null}
                      </div>
                    ) : (
                      <Badge variant="warning" className="text-xs">
                        Perlu hitung
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium">
                    Lihat Hasil
                    <ExternalLink className="size-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
