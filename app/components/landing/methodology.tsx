"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Compass, Download, Layers, Target } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const layers = [
  {
    id: "L1",
    name: "Strategic Foundation",
    drivers: 1,
    description: "Vision & direction clarity sebagai akar arah perusahaan.",
  },
  {
    id: "L2",
    name: "Leadership System",
    drivers: 1,
    description: "Konsistensi dan keselarasan jajaran pimpinan eksekutif.",
  },
  {
    id: "L3",
    name: "Management Cascade",
    drivers: 4,
    description: "Bagaimana strategi diterjemahkan menjadi prioritas, KPI, dan keputusan.",
  },
  {
    id: "L4",
    name: "Team Execution",
    drivers: 3,
    description: "Eksekusi sehari-hari, akuntabilitas, dan kolaborasi lintas tim.",
  },
  {
    id: "L5",
    name: "Individual Development",
    drivers: 3,
    description: "Kapabilitas, inisiatif, dan budaya pembelajaran individu.",
  },
];

const pillars = [
  {
    icon: Layers,
    title: "5 Layer Diagnostik",
    body: "Strategi → Leadership → Cascade → Eksekusi → Individu. Setiap layer dipetakan ke driver dan failure point spesifik.",
  },
  {
    icon: Compass,
    title: "12 Driver Inti",
    body: "Setiap driver punya bobot dan benchmark industri sehingga skor dapat dibandingkan vs peers.",
  },
  {
    icon: Target,
    title: "27 Failure Point",
    body: "Diagnosis presisi sampai ke titik kegagalan — bukan sekadar engagement score yang generik.",
  },
];

export function Methodology() {
  return (
    <section
      id="method"
      className="relative border-t border-border bg-foreground px-4 py-24 text-background sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="absolute inset-0 -z-0 opacity-[0.18]" aria-hidden>
        <div className="h-full w-full bg-[radial-gradient(circle_at_20%_10%,rgba(125,211,252,0.45),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(244,202,137,0.4),transparent_45%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-background/60">
              The OAM Framework
            </p>
            <h2 className="mt-5 max-w-xl text-balance text-4xl font-semibold tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Bukan sekadar engagement score. Ini operating system map.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-background/70 sm:text-lg">
            OAM (Organizational Alignment Model) adalah framework diagnostik
            yang dikembangkan ANSAKA bersama praktisi senior. Setiap responden
            menjawab item yang dipetakan ke 5 layer eksekusi, 12 driver, dan
            27 failure point — sehingga laporan langsung menunjuk ke
            intervensi prioritas.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {pillars.map((p, idx) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="rounded-[1.75rem] border border-white/15 bg-white/[0.04] p-6 backdrop-blur"
            >
              <div className="grid size-11 place-items-center rounded-full bg-white/10 text-background">
                <p.icon className="size-5" aria-hidden />
              </div>
              <h3 className="mt-6 text-2xl font-semibold tracking-[-0.04em]">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-background/65">{p.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 grid gap-3 rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 backdrop-blur lg:grid-cols-5">
          {layers.map((layer, idx) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              className="rounded-[1.4rem] border border-white/10 bg-background/5 p-5"
            >
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-background/50">
                <span className="font-mono">Layer {layer.id}</span>
                <span>{layer.drivers} driver</span>
              </div>
              <h4 className="mt-4 text-lg font-semibold tracking-[-0.03em]">
                {layer.name}
              </h4>
              <p className="mt-2 text-xs leading-5 text-background/65">
                {layer.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-background/30 bg-background/10 text-background hover:bg-background/20 hover:text-background"
          >
            <a
              href="/whitepapers/oam-framework.pdf"
              target="_blank"
              rel="noreferrer"
            >
              <Download className="size-4" />
              Download whitepaper OAM
            </a>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="border border-background/25 bg-background/10 text-background hover:bg-background/20 hover:text-background"
          >
            <Link href="#sample-report">
              Lihat sample report
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
