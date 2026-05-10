"use client";

import { ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type CaseStudy = {
  industry: string;
  title: string;
  metrics: { label: string; before: string; after: string; improvement: string }[];
  quote: string;
  attribution: string;
};

const cases: CaseStudy[] = [
  {
    industry: "Manufaktur FMCG",
    title: "Decision bottleneck di 11 plant",
    metrics: [
      { label: "Eskalasi", before: "14 hari", after: "3 hari", improvement: "-79%" },
      { label: "OAM Score", before: "54", after: "71", improvement: "+31%" },
      { label: "Throughput", before: "-", after: "+38%", improvement: "+38%" },
    ],
    quote:
      "Kami akhirnya tahu tepat di layer mana sistem kami pecah.",
    attribution: "VP Operations",
  },
  {
    industry: "Banking & Finance",
    title: "Reset cascade strategi dalam 6 minggu",
    metrics: [
      { label: "Cascade clarity", before: "41", after: "76", improvement: "+85%" },
      { label: "OAM Score", before: "58", after: "74", improvement: "+28%" },
      { label: "Goal alignment", before: "-", after: "+45%", improvement: "+45%" },
    ],
    quote:
      "Engagement tinggi tapi eksekusi rendah — ANSAKA menunjukkan akarnya.",
    attribution: "Head of Strategy",
  },
  {
    industry: "Tech / SaaS",
    title: "Scaling tanpa kehilangan culture",
    metrics: [
      { label: "Culture energy", before: "61", after: "82", improvement: "+34%" },
      { label: "OAM Score", before: "63", after: "79", improvement: "+25%" },
      { label: "Attrition", before: "18%", after: "7%", improvement: "-61%" },
    ],
    quote:
      "ANSAKA jadi operating instrument — bukan sekadar laporan tahunan.",
    attribution: "CEO, Series B SaaS",
  },
];

export function CaseStudies() {
  return (
    <section
      id="cases"
      className="relative border-t border-border bg-muted/30 px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Case studies
          </p>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
            Hasil Nyata di Lapangan
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Lihat bagaimana perusahaan-perusahaan ini bertransformasi dengan ANSAKA
          </p>
        </div>

        <div className="mt-16 space-y-8">
          {cases.map((c) => (
            <div
              key={c.title}
              className="rounded-[1.5rem] border border-border bg-card p-6 shadow-sm sm:p-8"
            >
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">
                    {c.industry}
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-foreground">
                    {c.title}
                  </h3>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {c.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-xl border border-border p-4 text-center"
                  >
                    <p className="text-sm text-muted-foreground">{m.label}</p>
                    <div className="mt-2 flex items-baseline justify-center gap-2">
                      <span className="text-lg font-medium text-muted-foreground line-through">
                        {m.before}
                      </span>
                      <ArrowRight className="size-3 text-muted-foreground" />
                      <span className="text-lg font-bold text-green-600">
                        {m.after}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-semibold text-green-600">
                      {m.improvement}
                    </p>
                  </div>
                ))}
              </div>

              <blockquote className="mt-6 rounded-xl bg-muted/50 p-4">
                <p className="text-sm italic leading-6 text-foreground">
                  "{c.quote}"
                </p>
                <footer className="mt-2 text-xs font-medium text-muted-foreground">
                  — {c.attribution}
                </footer>
              </blockquote>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-[1.75rem] border border-border bg-card p-6 sm:flex-row">
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <TrendingUp className="mt-0.5 size-5 shrink-0 text-green-600" />
            <p className="max-w-2xl">
              Rata-rata kenaikan OAM Score <strong className="text-foreground">13–17 poin dalam 6 bulan</strong> untuk klien yang menjalankan 2 cycle diagnostik.
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
