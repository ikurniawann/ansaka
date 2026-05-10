"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Download,
  Eye,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const driverScores = [
  { id: "D1",  name: "Vision Clarity",            score: 78, delta: +6 },
  { id: "D2",  name: "Strategy Alignment",        score: 71, delta: +3 },
  { id: "D3",  name: "Leadership Consistency",    score: 64, delta: -4 },
  { id: "D4",  name: "Role Clarity",              score: 59, delta: -2 },
  { id: "D5",  name: "Decision Effectiveness",    score: 52, delta: -7 },
  { id: "D6",  name: "KPI Ownership",             score: 67, delta: +1 },
  { id: "D7",  name: "Performance Accountability", score: 73, delta: +5 },
  { id: "D8",  name: "Communication Flow",        score: 69, delta: +2 },
  { id: "D9",  name: "Cross-Team Collaboration",  score: 55, delta: -3 },
  { id: "D10", name: "Capability Readiness",      score: 70, delta: +4 },
  { id: "D11", name: "Ownership & Initiative",    score: 76, delta: +6 },
  { id: "D12", name: "Continuous Learning",       score: 68, delta: +2 },
];

const layerSummary = [
  { name: "Strategic Foundation",   score: 78 },
  { name: "Leadership System",      score: 64 },
  { name: "Management Cascade",     score: 62 },
  { name: "Team Execution",         score: 66 },
  { name: "Individual Development", score: 71 },
];

function ScoreColor(score: number) {
  if (score >= 75) return "bg-emerald-500/80";
  if (score >= 60) return "bg-amber-500/80";
  return "bg-rose-500/80";
}

export function SampleReport() {
  return (
    <section
      id="sample-report"
      className="relative border-t border-border bg-background px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Sample report
            </p>
            <h2 className="mt-5 max-w-xl text-balance text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl">
              Lihat seperti apa report yang akan diterima eksekutif Anda.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Preview di bawah ini berdasarkan dataset terlatih dari 14 perusahaan
            menengah-besar Indonesia. Anda dapat mengunduh versi PDF lengkap
            tanpa perlu login — tidak ada lead form, tidak ada email gate.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          {/* Main report mock */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-ink-soft"
          >
            <div className="flex items-center justify-between border-b border-border bg-muted/40 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">
                  A
                </span>
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Diagnostic report · Q2 2026
                  </div>
                  <div className="text-sm font-semibold tracking-tight text-foreground">
                    PT Sample Industri Tbk · 1.240 responden
                  </div>
                </div>
              </div>
              <div className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground sm:flex">
                <span className="size-2 rounded-full bg-emerald-500" />
                Live data
              </div>
            </div>

            <div className="grid gap-6 p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-3">
                <KpiCard label="Overall OAM Score" value="68" delta="+4 vs Q1" trend="up" />
                <KpiCard label="Critical Gaps" value="3" delta="-1 vs Q1" trend="up" sublabel="Decision · Cross-team · Role" />
                <KpiCard label="Response Rate" value="86%" delta="+12pp" trend="up" />
              </div>

              {/* Driver bars */}
              <div className="rounded-[1.5rem] border border-border bg-background/60 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold tracking-[0.18em] text-foreground/80 uppercase">
                    Driver Score (0–100)
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    12 driver
                  </span>
                </div>
                <div className="mt-4 grid gap-2.5">
                  {driverScores.map((d, idx) => (
                    <div
                      key={d.id}
                      className="grid grid-cols-[44px_1fr_60px_44px] items-center gap-3 text-xs"
                    >
                      <span className="font-mono text-foreground/55">{d.id}</span>
                      <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${d.score}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, delay: 0.1 + idx * 0.04 }}
                          className={cn("absolute inset-y-0 left-0 rounded-full", ScoreColor(d.score))}
                        />
                      </div>
                      <span className="text-right font-medium text-foreground">{d.score}</span>
                      <span
                        className={cn(
                          "flex items-center gap-1 justify-end text-[11px] font-medium",
                          d.delta > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
                        )}
                      >
                        {d.delta > 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                        {d.delta > 0 ? "+" : ""}
                        {d.delta}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Side panels */}
          <div className="grid gap-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-[2rem] border border-border bg-card p-6 shadow-ink-soft"
            >
              <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Layer summary
              </div>
              <div className="mt-4 space-y-3">
                {layerSummary.map((l, idx) => (
                  <div key={l.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{l.name}</span>
                      <span className="font-mono text-foreground/70">{l.score}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${l.score}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.2 + idx * 0.08 }}
                        className={cn("h-full rounded-full", ScoreColor(l.score))}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-[2rem] border border-border bg-foreground p-6 text-background shadow-ink-soft"
            >
              <div className="text-xs uppercase tracking-[0.22em] text-background/55">
                Top 3 Action Plan
              </div>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="font-medium">Reset decision rights di management cascade</div>
                  <div className="mt-1 text-xs text-background/60">Owner: COO · Q3 sprint</div>
                </li>
                <li className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="font-medium">Workshop role clarity untuk middle managers</div>
                  <div className="mt-1 text-xs text-background/60">Owner: CHRO · 6 minggu</div>
                </li>
                <li className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="font-medium">Cross-team operating rhythm review</div>
                  <div className="mt-1 text-xs text-background/60">Owner: VP Ops · monthly</div>
                </li>
              </ul>
            </motion.div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button asChild size="lg">
                <a href="/sample/ansaka-sample-report.pdf" target="_blank" rel="noreferrer">
                  <Download className="size-4" />
                  Download PDF
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/sample-report">
                  <Eye className="size-4" />
                  Buka interaktif
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-[1.75rem] border border-border bg-muted/40 p-5">
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Mau jalankan diagnostik beneran di organisasi Anda? Daftar workspace
            sekarang — kami berikan{" "}
            <span className="font-semibold text-foreground">
              30 credit gratis untuk 30 link survey pertama
            </span>
            .
          </p>
          <Button asChild>
            <Link href="/signup">
              Klaim 30 credit gratis
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function KpiCard({
  label,
  value,
  delta,
  trend,
  sublabel,
}: {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  sublabel?: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-background/60 p-5">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </div>
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            trend === "up"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-600 dark:text-rose-400",
          )}
        >
          {trend === "up" ? <ArrowUpRight className="size-3" /> : <ArrowRight className="size-3" />}
          {delta}
        </div>
      </div>
      <div className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-foreground">
        {value}
      </div>
      {sublabel ? (
        <div className="mt-2 text-xs text-muted-foreground">{sublabel}</div>
      ) : null}
    </div>
  );
}
