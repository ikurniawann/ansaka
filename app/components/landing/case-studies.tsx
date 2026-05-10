"use client";

import { motion } from "framer-motion";
import { ArrowRight, Quote, TrendingUp } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type CaseStudy = {
  industry: string;
  companySize: string;
  title: string;
  challenge: string;
  intervention: string;
  before: { label: string; value: string }[];
  after: { label: string; value: string }[];
  quote: string;
  attribution: string;
  duration: string;
};

const cases: CaseStudy[] = [
  {
    industry: "Manufaktur FMCG",
    companySize: "2.400 karyawan",
    title: "Mengurai decision bottleneck di 11 plant.",
    challenge:
      "Decision rights tidak jelas antara HQ dan plant. Eskalasi rata-rata butuh 14 hari, KPI lag 2 kuartal.",
    intervention:
      "Diagnostik penuh OAM + workshop redesign decision matrix berbasis 3 driver bermasalah (D4, D5, D6).",
    before: [
      { label: "Waktu eskalasi", value: "14 hari" },
      { label: "OAM Score", value: "54" },
      { label: "Decision FP", value: "FP9 · FP10" },
    ],
    after: [
      { label: "Waktu eskalasi", value: "3 hari" },
      { label: "OAM Score", value: "71" },
      { label: "Throughput", value: "+38%" },
    ],
    quote:
      "Kami akhirnya tahu tepat di layer mana sistem kami pecah. Tidak perlu lagi berdebat berdasarkan asumsi.",
    attribution: "VP Operations · Group Manufacturing",
    duration: "Q1 2025 → Q3 2025",
  },
  {
    industry: "Banking & Finance",
    companySize: "5.800 karyawan",
    title: "Reset cascade strategi 2025 dalam 6 minggu.",
    challenge:
      "Strategi grup tidak pernah turun ke commercial branch. Engagement tinggi, eksekusi rendah.",
    intervention:
      "OAM diagnostik per region + intensive cascade workshop dengan executive committee.",
    before: [
      { label: "Cascade clarity", value: "41" },
      { label: "OAM Score", value: "58" },
      { label: "Engagement", value: "82" },
    ],
    after: [
      { label: "Cascade clarity", value: "76" },
      { label: "OAM Score", value: "74" },
      { label: "Goal alignment", value: "+45%" },
    ],
    quote:
      "Engagement tinggi tapi eksekusi rendah ternyata bukan paradoks — itu gejala. ANSAKA menunjukkan akarnya.",
    attribution: "Head of Strategy · National Bank",
    duration: "Q4 2024 → Q1 2025",
  },
  {
    industry: "Tech / SaaS Indonesia",
    companySize: "320 karyawan",
    title: "Scaling tanpa kehilangan culture energy.",
    challenge:
      "Pasca Series B, ownership turun, cross-team friction naik, top performer mulai resign.",
    intervention:
      "Pulse OAM tiap kuartal + targeted intervention pada driver kapabilitas dan kolaborasi.",
    before: [
      { label: "Culture energy", value: "61" },
      { label: "OAM Score", value: "63" },
      { label: "Voluntary attrition", value: "18%" },
    ],
    after: [
      { label: "Culture energy", value: "82" },
      { label: "OAM Score", value: "79" },
      { label: "Voluntary attrition", value: "7%" },
    ],
    quote:
      "Kami pakai ANSAKA sebagai operating instrument — bukan sekadar laporan tahunan. Tiap kuartal kami evolve.",
    attribution: "CEO · Series B SaaS",
    duration: "2024 — ongoing",
  },
];

export function CaseStudies() {
  return (
    <section
      id="cases"
      className="relative border-t border-border bg-background px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Case studies
            </p>
            <h2 className="mt-5 max-w-xl text-balance text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl">
              Angka before / after dari workspace nyata.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Nama perusahaan kami anonimkan sesuai NDA. Detail metrik dan
            metodologi intervensi dipaparkan lengkap pada studi kasus PDF — bisa
            diminta langsung lewat tombol di bawah.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {cases.map((c, idx) => (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: idx * 0.08 }}
              className="flex flex-col rounded-[2rem] border border-border bg-card p-6 shadow-ink-soft"
            >
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <span>{c.industry}</span>
                <span>{c.companySize}</span>
              </div>

              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-card-foreground">
                {c.title}
              </h3>

              <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Tantangan: </span>
                  {c.challenge}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Intervensi: </span>
                  {c.intervention}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <BeforeAfterColumn label="Before" items={c.before} tone="muted" />
                <BeforeAfterColumn label="After" items={c.after} tone="solid" />
              </div>

              <blockquote className="mt-6 rounded-2xl border border-border bg-muted/40 p-4 text-sm leading-6 text-foreground">
                <Quote className="size-4 text-foreground/40" aria-hidden />
                <p className="mt-2 italic">“{c.quote}”</p>
                <footer className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {c.attribution} · {c.duration}
                </footer>
              </blockquote>

              <div className="mt-auto pt-6">
                <Link
                  href="/#book-demo"
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:underline"
                >
                  Minta studi kasus PDF
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-[1.75rem] border border-border bg-card p-5">
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <TrendingUp className="mt-0.5 size-5 shrink-0 text-foreground" aria-hidden />
            <p className="max-w-2xl">
              Rata-rata kenaikan OAM Score 13–17 poin dalam 6 bulan untuk klien
              yang menjalankan 2 cycle diagnostik + intervensi terarah.
            </p>
          </div>
          <Button asChild>
            <Link href="/#book-demo">
              Diskusikan untuk perusahaan saya
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function BeforeAfterColumn({
  label,
  items,
  tone,
}: {
  label: string;
  items: { label: string; value: string }[];
  tone: "muted" | "solid";
}) {
  return (
    <div
      className={
        tone === "solid"
          ? "rounded-2xl border border-foreground/15 bg-foreground p-4 text-background"
          : "rounded-2xl border border-border bg-muted/30 p-4 text-foreground"
      }
    >
      <div
        className={`text-[10px] uppercase tracking-[0.22em] ${
          tone === "solid" ? "text-background/60" : "text-muted-foreground"
        }`}
      >
        {label}
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((i) => (
          <li key={i.label} className="flex items-center justify-between text-xs">
            <span
              className={
                tone === "solid" ? "text-background/70" : "text-muted-foreground"
              }
            >
              {i.label}
            </span>
            <span className="font-mono font-semibold tabular-nums">{i.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
