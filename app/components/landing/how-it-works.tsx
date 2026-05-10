"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  CreditCard,
  FileBarChart,
  ListChecks,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

import { Button } from "@/components/ui/button";

const steps = [
  {
    index: "01",
    icon: CreditCard,
    title: "Beli Credit",
    body: "Pilih paket sesuai jumlah responden — atau langsung pakai 30 credit gratis untuk workspace baru.",
    bullets: ["Pembayaran via Xendit", "Auto top-up & invoice e-Faktur", "Refund dalam 7 hari"],
  },
  {
    index: "02",
    icon: ListChecks,
    title: "Buat Batch Survey",
    body: "Susun batch dengan template OAM bawaan, segmentasi divisi, dan periode aktif yang fleksibel.",
    bullets: ["Template OAM 27 failure point", "Segmentasi divisi & lokasi", "Reminder otomatis"],
  },
  {
    index: "03",
    icon: Send,
    title: "Kirim Survei ke Responden",
    body: "Distribusi via magic link, email branded, atau WhatsApp. Anonim & ramah mobile.",
    bullets: ["Magic link tanpa login", "Mobile-first survey UI", "Anonimitas terjaga (min. N=5)"],
  },
  {
    index: "04",
    icon: FileBarChart,
    title: "Lihat Report Eksekutif",
    body: "Hasil real-time dengan benchmark industri, drill-down per driver, dan rekomendasi action plan.",
    bullets: ["Dashboard interaktif", "Export PDF / PPTX / XLSX", "Action plan tracker"],
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const lineProgress = useTransform(scrollYProgress, [0.05, 0.85], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative border-t border-border bg-background px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              How it works
            </p>
            <h2 className="mt-5 max-w-xl text-balance text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl">
              Dari beli credit ke executive report dalam 4 langkah.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Tidak perlu konsultan, tidak perlu spreadsheet manual. Workspace
            ANSAKA mengotomasi end-to-end siklus diagnostik organisasi — dari
            distribusi link sampai action plan berbasis bukti.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Vertical / horizontal progress line */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-6 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-1/2 lg:left-0 lg:top-[3.5rem] lg:right-0 lg:bottom-auto lg:h-px lg:w-full lg:translate-x-0"
          />
          <motion.div
            aria-hidden
            style={{ scaleY: lineProgress }}
            className="pointer-events-none absolute left-6 top-0 bottom-0 w-px origin-top bg-gradient-to-b from-foreground via-foreground/60 to-transparent md:left-1/2 md:-translate-x-1/2 lg:hidden"
          />
          <motion.div
            aria-hidden
            style={{ scaleX: lineProgress }}
            className="pointer-events-none absolute left-0 top-[3.5rem] right-0 hidden h-px origin-left bg-gradient-to-r from-foreground via-foreground/60 to-transparent lg:block"
          />

          <ol className="grid gap-8 lg:grid-cols-4">
            {steps.map((step, idx) => (
              <motion.li
                key={step.index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: idx * 0.08, ease: "easeOut" }}
                className="relative pl-16 lg:pl-0 lg:pt-24"
              >
                {/* dot */}
                <div className="absolute left-0 top-0 grid size-12 place-items-center rounded-full border border-border bg-card text-foreground shadow-ink-soft lg:left-0 lg:top-0">
                  <step.icon className="size-5" aria-hidden />
                </div>

                <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-ink-soft transition-colors hover:border-foreground/30">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs tracking-[0.22em] text-muted-foreground">
                      STEP / {step.index}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {idx === 3 ? "Output" : "Input"}
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-card-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {step.body}
                  </p>
                  <ul className="mt-5 space-y-2 text-sm text-card-foreground/85">
                    {step.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground/60" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <Link href="/signup">
              Mulai gratis · 30 credit
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#sample-report">Lihat sample report</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
