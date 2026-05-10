"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase-client";
import {
  DRIVERS,
  FAILURE_POINTS,
  GAPS,
  LAYERS,
  STATUS_THRESHOLDS,
} from "@/lib/oam-constants";
import { getStatus } from "@/lib/scoring";

type BatchResult = {
  batch_id: string;
  driver_scores: Record<string, number>;
  fp_scores: Record<string, number>;
  layer_scores: Record<string, number>;
  gap_scores: Record<string, number>;
  overall_score: number;
  maturity_level: string;
  respondent_count: number;
  computed_at: string;
};

type BatchMeta = {
  id: string;
  name: string | null;
  status: string;
  created_at: string;
};

function ScorePill({ score }: { score: number }) {
  const status = getStatus(score);
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
      <span
        className="mr-2 size-2 rounded-full"
        style={{ backgroundColor: status.color }}
      />
      {status.label}
    </span>
  );
}

function ScoreRow({
  code,
  label,
  score,
}: {
  code: string;
  label: string;
  score: number;
}) {
  const status = getStatus(score);
  const percentage = Math.max(0, Math.min(100, ((score - 1) / 3) * 100));

  return (
    <div className="grid grid-cols-[52px_1fr_86px_92px] items-center gap-4 border-b border-slate-200 py-3 last:border-b-0">
      <span className="font-mono text-xs font-semibold text-slate-500">{code}</span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <div className="mt-2 h-2 rounded-full bg-slate-100">
          <div
            className="h-full rounded-full"
            style={{ width: `${percentage}%`, backgroundColor: status.color }}
          />
        </div>
      </div>
      <span className="text-right text-sm font-bold tabular-nums text-slate-950">
        {score.toFixed(2)}
      </span>
      <ScorePill score={score} />
    </div>
  );
}

export default function ReportPrintPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [batch, setBatch] = useState<BatchMeta | null>(null);
  const [result, setResult] = useState<BatchResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
        return;
      }

      const [batchRes, resultRes] = await Promise.all([
        supabase
          .from("survey_batches")
          .select("id, name, status, created_at")
          .eq("id", id)
          .single(),
        supabase
          .from("batch_results")
          .select("*")
          .eq("batch_id", id)
          .maybeSingle(),
      ]);

      if (batchRes.data) setBatch(batchRes.data as BatchMeta);
      if (resultRes.data) setResult(resultRes.data as BatchResult);
      setLoading(false);
    })();
  }, [id, router]);

  const criticalDrivers = useMemo(() => {
    if (!result) return [];
    return [...DRIVERS]
      .map((driver) => ({
        ...driver,
        score: result.driver_scores[driver.id] ?? 0,
      }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);
  }, [result]);

  const rankedFailurePoints = useMemo(() => {
    if (!result) return [];
    return Object.entries(result.fp_scores)
      .map(([fp, score]) => ({
        fp,
        name: FAILURE_POINTS[fp] ?? fp,
        score,
      }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 12);
  }, [result]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-950">
        <Loader2 className="size-8 animate-spin text-slate-500" />
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-950">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Report belum tersedia</h1>
          <p className="mt-2 text-sm text-slate-600">
            Batch ini belum memiliki hasil agregat untuk dicetak.
          </p>
          <Button asChild className="mt-6">
            <Link href={`/dashboard/batches/${id}/results`}>Kembali ke hasil</Link>
          </Button>
        </div>
      </main>
    );
  }

  const overallStatus = getStatus(result.overall_score);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-950 print:bg-white print:p-0">
      <div className="mx-auto mb-4 flex max-w-[960px] items-center justify-between gap-3 print:hidden">
        <Button asChild variant="outline">
          <Link href={`/dashboard/batches/${id}/results`}>
            <ArrowLeft className="size-4" />
            Kembali
          </Link>
        </Button>
        <Button onClick={() => window.print()}>
          <Download className="size-4" />
          Print / Save PDF
        </Button>
      </div>

      <article className="mx-auto max-w-[960px] overflow-hidden rounded-[1.5rem] bg-white shadow-sm print:max-w-none print:rounded-none print:shadow-none">
        <section className="bg-slate-950 px-10 py-10 text-white print:px-0 print:py-0">
          <div className="flex items-start justify-between gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-200">
                ANSAKA OAM Insight
              </p>
              <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-normal">
                Organizational Assessment Report
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
                Laporan ringkas untuk membaca alignment, execution drag, dan
                area prioritas intervensi organisasi.
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 p-5 text-right">
              <p className="text-xs uppercase tracking-widest text-slate-400">Overall Score</p>
              <p className="mt-2 text-5xl font-bold tabular-nums">{result.overall_score.toFixed(2)}</p>
              <p className="mt-1 text-xs text-slate-400">dari 4.00</p>
            </div>
          </div>

          <div className="mt-9 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Batch</p>
              <p className="mt-1 text-sm font-semibold">{batch?.name ?? "Batch Survey"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Respondents</p>
              <p className="mt-1 text-sm font-semibold">{result.respondent_count} responden</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Computed</p>
              <p className="mt-1 text-sm font-semibold">
                {new Date(result.computed_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 px-10 py-8 print:px-0 print:py-8 md:grid-cols-[240px_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-xs uppercase tracking-widest text-slate-500">Maturity</p>
            <p className="mt-3 text-2xl font-semibold text-slate-950">{overallStatus.label}</p>
            <div className="mt-4 h-2 rounded-full bg-slate-200">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.max(0, Math.min(100, ((result.overall_score - 1) / 3) * 100))}%`,
                  backgroundColor: overallStatus.color,
                }}
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Executive Summary</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Skor OAM keseluruhan organisasi adalah{" "}
              <strong className="text-slate-950">{result.overall_score.toFixed(2)}</strong>{" "}
              dari skala 1-4. Hasil ini menunjukkan level{" "}
              <strong className="text-slate-950">{overallStatus.label}</strong>. Fokus awal disarankan
              pada driver dengan skor terendah karena area tersebut paling berpotensi
              menghambat alignment dan ritme eksekusi.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {STATUS_THRESHOLDS.map((threshold) => (
                <span key={threshold.key} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
                  <span className="size-2 rounded-full" style={{ backgroundColor: threshold.color }} />
                  {threshold.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="px-10 pb-8 print:px-0">
          <h2 className="text-xl font-semibold">Top Priority Drivers</h2>
          <div className="mt-4 rounded-2xl border border-slate-200 px-5">
            {criticalDrivers.map((driver) => (
              <ScoreRow
                key={driver.id}
                code={driver.id}
                label={driver.name}
                score={driver.score}
              />
            ))}
          </div>
        </section>

        <section className="px-10 pb-8 print:px-0">
          <h2 className="text-xl font-semibold">Layer View</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {LAYERS.map((layer) => {
              const score = result.layer_scores[layer.id];
              if (score === undefined) return null;
              return (
                <div key={layer.id} className="rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{layer.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{layer.drivers.join(", ")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold tabular-nums">{score.toFixed(2)}</p>
                      <ScorePill score={score} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-10 pb-8 print:px-0">
          <h2 className="text-xl font-semibold">Execution Gaps</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {GAPS.map((gap) => {
              const score = result.gap_scores[gap.id];
              if (score === undefined) return null;
              return (
                <div key={gap.id} className="rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">{gap.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{gap.fps.length} failure points</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold tabular-nums">{score.toFixed(2)}</p>
                      <ScorePill score={score} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-10 pb-10 print:px-0">
          <h2 className="text-xl font-semibold">Priority Heatmap</h2>
          <p className="mt-2 text-sm text-slate-600">
            Dua belas failure point paling kritis berdasarkan skor terendah.
          </p>
          <div className="mt-4 rounded-2xl border border-slate-200 px-5">
            {rankedFailurePoints.map((item, index) => (
              <ScoreRow
                key={item.fp}
                code={`${index + 1}. ${item.fp}`}
                label={item.name}
                score={item.score}
              />
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
