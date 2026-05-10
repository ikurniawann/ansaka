"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase-client";
import {
  DRIVERS, LAYERS, GAPS, FAILURE_POINTS, STATUS_THRESHOLDS,
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
  organization_id: string;
  created_at: string;
};

function ScoreBar({
  score,
  max = 4,
  label,
  sub,
}: {
  score: number;
  max?: number;
  label: string;
  sub?: string;
}) {
  const st = getStatus(score);
  const pct = ((score - 1) / (max - 1)) * 100;

  return (
    <div className="flex items-center gap-4">
      <div className="w-36 min-w-0 flex-shrink-0">
        <p className="truncate text-sm font-medium">{label}</p>
        {sub && <p className="truncate text-xs text-muted-foreground">{sub}</p>}
      </div>
      <div className="flex-1">
        <Progress
          value={pct}
          indicatorClassName="transition-all"
          style={{ ["--indicator-color" as string]: st.color }}
          className="h-2.5"
        />
      </div>
      <div className="w-20 text-right">
        <span className="text-sm font-bold tabular-nums">{score.toFixed(2)}</span>
        <span className="ml-1.5 text-xs text-muted-foreground">/ 4</span>
      </div>
      <Badge
        className={`w-16 justify-center text-xs ${st.bg} ${st.text} border-transparent`}
      >
        {st.label}
      </Badge>
    </div>
  );
}

function ScoreCard({ score, label, sub }: { score: number; label: string; sub?: string }) {
  const st = getStatus(score);
  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        <p className="mt-2 text-3xl font-bold tabular-nums">{score.toFixed(2)}</p>
        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${st.bg} ${st.text}`}>
          {st.label}
        </span>
      </CardContent>
    </Card>
  );
}

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [result, setResult] = useState<BatchResult | null>(null);
  const [batch, setBatch] = useState<BatchMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [computing, setComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const [batchRes, resultRes] = await Promise.all([
      supabase.from("survey_batches")
        .select("id, name, status, organization_id, created_at")
        .eq("id", id).single(),
      supabase.from("batch_results")
        .select("*")
        .eq("batch_id", id).maybeSingle(),
    ]);
    if (batchRes.data) setBatch(batchRes.data as BatchMeta);
    if (resultRes.data) setResult(resultRes.data as BatchResult);
  }

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }
      await load();
      setLoading(false);
    })();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleCompute() {
    setComputing(true);
    setError(null);
    try {
      const { error: e } = await supabase.rpc("compute_batch_results", { p_batch_id: id });
      if (e) throw e;
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menghitung hasil.");
    } finally {
      setComputing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="px-8 py-8">
        <Button asChild variant="ghost" className="mb-6 -ml-3">
          <Link href={`/dashboard/batches/${id}`}><ArrowLeft className="size-4" /> Kembali</Link>
        </Button>
        <h1 className="text-2xl font-semibold">Hasil Belum Tersedia</h1>
        <p className="mt-2 text-muted-foreground">
          Batch harus ditutup dan minimal 1 respons lengkap tersedia untuk menghitung hasil.
        </p>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button onClick={handleCompute} disabled={computing} className="mt-6">
          {computing ? <><RefreshCw className="size-4 animate-spin" /> Menghitung...</> : "Hitung Hasil Sekarang"}
        </Button>
      </div>
    );
  }

  const overallStatus = getStatus(result.overall_score);
  const topDrivers = [...DRIVERS]
    .map((d) => ({ ...d, score: result.driver_scores[d.id] ?? 0 }))
    .sort((a, b) => a.score - b.score);
  const criticalDrivers = topDrivers.filter((d) => d.score < 2.8).slice(0, 5);

  // Top 10 critical FPs
  const fpRanked = Object.entries(result.fp_scores)
    .map(([fp, score]) => ({ fp, name: FAILURE_POINTS[fp] ?? fp, score }))
    .sort((a, b) => a.score - b.score);

  return (
    <div className="px-8 py-8 print-report">
      {/* Back + header */}
      <Button asChild variant="ghost" className="mb-6 -ml-3 print-hidden">
        <Link href={`/dashboard/batches/${id}`}><ArrowLeft className="size-4" /> Kembali ke Batch</Link>
      </Button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Laporan OAM Insight</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            {batch?.name ?? "Batch Survey"}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {result.respondent_count} responden ·{" "}
            Dihitung {new Date(result.computed_at).toLocaleDateString("id-ID", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 print-hidden">
          <Button asChild variant="outline" size="default">
            <Link href={`/reports/${id}/print`} target="_blank">
              <Download className="size-4" />
              Export PDF
            </Link>
          </Button>
          <Button variant="outline" size="default" onClick={handleCompute} disabled={computing}>
            {computing ? <RefreshCw className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            Perbarui
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Executive Summary */}
      <div className="mt-8 rounded-[2rem] border border-border bg-card p-8">
        <div className="grid gap-8 lg:grid-cols-[auto_1fr]">
          {/* Big score */}
          <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-border bg-background px-10 py-8 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Overall OAM Score</p>
            <p className="mt-3 text-7xl font-bold tabular-nums tracking-tight">
              {result.overall_score.toFixed(2)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">dari 4.00</p>
            <span className={`mt-4 rounded-full px-4 py-1.5 text-sm font-semibold ${overallStatus.bg} ${overallStatus.text}`}>
              {overallStatus.label}
            </span>
          </div>

          {/* Priority issues */}
          <div>
            <h2 className="font-semibold">Executive Summary</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Skor OAM keseluruhan organisasi adalah{" "}
              <strong className="text-foreground">{result.overall_score.toFixed(2)}</strong> dari skala
              1–4, menunjukkan level <strong className="text-foreground">{overallStatus.label}</strong>.
            </p>
            {criticalDrivers.length > 0 && (
              <>
                <p className="mt-4 text-sm font-medium">Area prioritas untuk dibenahi:</p>
                <div className="mt-2 space-y-2">
                  {criticalDrivers.map((d) => (
                    <div key={d.id} className="flex items-center justify-between rounded-[1rem] border border-border bg-background px-4 py-2.5">
                      <div>
                        <span className="font-mono text-xs text-muted-foreground">{d.id} </span>
                        <span className="text-sm font-medium">{d.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{d.score.toFixed(2)}</span>
                        <Badge className={`${getStatus(d.score).bg} ${getStatus(d.score).text} border-transparent text-xs`}>
                          {getStatus(d.score).label}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Threshold legend */}
      <div className="mt-4 flex flex-wrap gap-3">
        {STATUS_THRESHOLDS.map((t) => (
          <div key={t.key} className="flex items-center gap-2">
            <span className={`inline-block h-2.5 w-2.5 rounded-full`} style={{ background: t.color }} />
            <span className="text-xs text-muted-foreground">
              {t.label} ({t.min.toFixed(1)}–{t.max < 4.01 ? t.max.toFixed(1) : "4.0"})
            </span>
          </div>
        ))}
      </div>

      {/* Tabs: 5 sections */}
      <Tabs defaultValue="layers" className="mt-10">
        <TabsList className="h-auto flex-wrap gap-1 p-1.5 print-hidden">
          <TabsTrigger value="layers">Layer View</TabsTrigger>
          <TabsTrigger value="drivers">12 Drivers</TabsTrigger>
          <TabsTrigger value="gaps">Execution Gaps</TabsTrigger>
          <TabsTrigger value="heatmap">Priority Heatmap</TabsTrigger>
        </TabsList>

        {/* LAYER VIEW */}
        <TabsContent value="layers">
          <div className="space-y-8">
            <h2 className="text-lg font-semibold">Layer View — WHERE the problem lives</h2>
            {LAYERS.map((layer) => {
              const layerScore = result.layer_scores[layer.id];
              if (layerScore === undefined) return null;
              const st = getStatus(layerScore);
              return (
                <div key={layer.id} className="rounded-[1.5rem] border border-border bg-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{layer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {layer.drivers.join(", ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{layerScore.toFixed(2)}</p>
                      <Badge className={`${st.bg} ${st.text} border-transparent text-xs`}>{st.label}</Badge>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    {layer.drivers.map((dId) => {
                      const dScore = result.driver_scores[dId];
                      if (dScore === undefined) return null;
                      const driver = DRIVERS.find((d) => d.id === dId);
                      return (
                        <ScoreBar
                          key={dId}
                          label={dId}
                          sub={driver?.name}
                          score={dScore}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* 12 DRIVERS */}
        <TabsContent value="drivers">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">12 Execution Drivers — HOW it manifests</h2>
            <div className="rounded-[1.5rem] border border-border bg-card divide-y divide-border">
              {DRIVERS.map((driver) => {
                const score = result.driver_scores[driver.id];
                if (score === undefined) return null;
                const st = getStatus(score);
                return (
                  <div key={driver.id} className="px-6 py-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 shrink-0">
                        <p className="font-mono text-xs font-bold text-muted-foreground">{driver.id}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{driver.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{driver.layer.replace(/_/g, " ")}</p>
                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex-1">
                            <Progress
                              value={((score - 1) / 3) * 100}
                              className="h-2"
                              indicatorClassName={score >= 3.5 ? "bg-green-500" : score >= 2.8 ? "bg-yellow-500" : score >= 2.0 ? "bg-orange-500" : "bg-red-500"}
                            />
                          </div>
                          <span className="w-10 text-right text-sm font-bold tabular-nums">{score.toFixed(2)}</span>
                        </div>
                      </div>
                      <Badge className={`${st.bg} ${st.text} border-transparent shrink-0`}>{st.label}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* EXECUTION GAPS */}
        <TabsContent value="gaps">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Execution Gaps — Root cause hypothesis</h2>
            <p className="text-sm text-muted-foreground">
              Gap hypothesis dihasilkan dari mapping Failure Point → domain. Ini adalah titik awal untuk
              investigasi lebih lanjut melalui interview atau FGD.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {GAPS.map((gap) => {
                const score = result.gap_scores[gap.id];
                if (score === undefined) return null;
                return <ScoreCard key={gap.id} score={score} label={gap.name} sub={`${gap.fps.length} Failure Points`} />;
              })}
            </div>

            {/* Gap detail breakdown */}
            <div className="space-y-6 mt-6">
              {GAPS.map((gap) => {
                const gapScore = result.gap_scores[gap.id];
                if (gapScore === undefined) return null;
                return (
                  <div key={gap.id} className="rounded-[1.5rem] border border-border bg-card p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{gap.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{gapScore.toFixed(2)}</span>
                        <Badge className={`${getStatus(gapScore).bg} ${getStatus(gapScore).text} border-transparent text-xs`}>
                          {getStatus(gapScore).label}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      {gap.fps.map((fp) => {
                        const fpScore = result.fp_scores[fp];
                        if (fpScore === undefined) return null;
                        return (
                          <ScoreBar key={fp} label={fp} sub={FAILURE_POINTS[fp]} score={fpScore} />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* PRIORITY HEATMAP */}
        <TabsContent value="heatmap">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Priority Heatmap — 27 Failure Points</h2>
            <p className="text-sm text-muted-foreground">
              Diurutkan dari skor terendah (paling kritis) ke tertinggi. Fokus intervensi pada FP di zona
              Critical dan Weak.
            </p>

            <div className="rounded-[1.5rem] border border-border bg-card divide-y divide-border">
              {fpRanked.map(({ fp, name, score }, idx) => {
                const st = getStatus(score);
                return (
                  <div key={fp} className="flex items-center gap-4 px-6 py-3">
                    <span className="w-6 text-right font-mono text-xs text-muted-foreground">{idx + 1}</span>
                    <span className="w-10 font-mono text-xs font-bold text-muted-foreground">{fp}</span>
                    <span className="flex-1 text-sm font-medium">{name}</span>
                    <div className="w-32">
                      <Progress
                        value={((score - 1) / 3) * 100}
                        className="h-2"
                        indicatorClassName={score >= 3.5 ? "bg-green-500" : score >= 2.8 ? "bg-yellow-500" : score >= 2.0 ? "bg-orange-500" : "bg-red-500"}
                      />
                    </div>
                    <span className="w-10 text-right text-sm font-bold tabular-nums">{score.toFixed(2)}</span>
                    <Badge className={`w-16 justify-center ${st.bg} ${st.text} border-transparent text-xs`}>
                      {st.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
