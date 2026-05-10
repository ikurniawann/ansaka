"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 42, suffix: "+", label: "Perusahaan menengah & besar" },
  { value: 18750, suffix: "+", label: "Responden survey" },
  { value: 12, suffix: "", label: "Industri (BUMN, manufaktur, consumer, finance)" },
  { value: 27, suffix: "", label: "Failure point terdiagnosis" },
];

const logos = [
  "ASTRA", "TELKOM", "BANK MEGA", "INDOFOOD", "PERTAMINA",
  "SINAR MAS", "WIJAYA KARYA", "MAYORA", "ADARO", "GUDANG GARAM",
  "BCA", "BRI", "JAPFA", "KALBE", "AKR",
];

export function TrustBar() {
  return (
    <section className="relative border-t border-border bg-muted/40 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Dipercaya oleh
            </p>
            <h2 className="mt-5 max-w-xl text-balance text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
              Eksekutif perusahaan Indonesia memilih ANSAKA untuk diagnosis sistem organisasi.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s, idx) => (
              <StatCard key={s.label} stat={s} delay={idx * 0.08} />
            ))}
          </div>
        </div>

        <div className="mt-14 overflow-hidden rounded-[1.5rem] border border-border bg-card py-6">
          <div className="flex animate-marquee whitespace-nowrap text-sm font-semibold tracking-[0.32em] text-foreground/55">
            {Array.from({ length: 2 }).map((_, group) => (
              <div className="flex min-w-full items-center justify-around gap-12" key={group}>
                {logos.map((l) => (
                  <span
                    key={`${group}-${l}`}
                    className="grayscale transition-all hover:text-foreground"
                  >
                    {l}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          *Logo ditampilkan dengan persetujuan klien aktif & alumni program diagnostik.
        </p>
      </div>
    </section>
  );
}

function StatCard({
  stat,
  delay,
}: {
  stat: { value: number; suffix: string; label: string };
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1300;
    const tick = (t: number) => {
      const progress = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(stat.value * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, stat.value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="rounded-[1.5rem] border border-border bg-card p-5"
    >
      <div className="text-4xl font-semibold tracking-[-0.05em] text-foreground tabular-nums sm:text-5xl">
        {count.toLocaleString("id-ID")}
        <span className="text-foreground/60">{stat.suffix}</span>
      </div>
      <div className="mt-3 text-xs leading-5 text-muted-foreground">{stat.label}</div>
    </motion.div>
  );
}
