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
  { name: "Astra", src: "https://logo.clearbit.com/astra.co.id" },
  { name: "Telkom Indonesia", src: "https://logo.clearbit.com/telkom.co.id" },
  { name: "Bank Mega", src: "https://logo.clearbit.com/bankmega.com" },
  { name: "Indofood", src: "https://logo.clearbit.com/indofood.com" },
  { name: "Pertamina", src: "https://logo.clearbit.com/pertamina.com" },
  { name: "Sinar Mas", src: "https://logo.clearbit.com/sinarmas.com" },
  { name: "Wijaya Karya", src: "https://logo.clearbit.com/wika.co.id" },
  { name: "Mayora", src: "https://logo.clearbit.com/mayoraindah.co.id" },
  { name: "Adaro", src: "https://logo.clearbit.com/adaro.com" },
  { name: "Gudang Garam", src: "https://logo.clearbit.com/gudanggaramtbk.com" },
  { name: "BCA", src: "https://logo.clearbit.com/bca.co.id" },
  { name: "BRI", src: "https://logo.clearbit.com/bri.co.id" },
  { name: "JAPFA", src: "https://logo.clearbit.com/japfacomfeed.co.id" },
  { name: "Kalbe", src: "https://logo.clearbit.com/kalbe.co.id" },
  { name: "AKR", src: "https://logo.clearbit.com/akr.co.id" },
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

          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {stats.map((s, idx) => (
              <StatCard key={s.label} stat={s} delay={idx * 0.08} />
            ))}
          </div>
        </div>

        <div className="mt-14 overflow-hidden rounded-[1.5rem] border border-border bg-card py-6">
          <div className="flex w-max animate-marquee items-center whitespace-nowrap">
            {Array.from({ length: 2 }).map((_, group) => (
              <div className="flex shrink-0 items-center gap-16 px-10" key={group}>
                {logos.map((logo) => (
                  <span
                    key={`${group}-${logo.name}`}
                    className="grid h-12 w-32 shrink-0 place-items-center rounded-xl bg-white/70 px-5 ring-1 ring-border/60 transition-all hover:bg-white"
                  >
                    <img
                      src={logo.src}
                      alt={`${logo.name} logo`}
                      className="max-h-7 max-w-full object-contain opacity-65 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                      loading="lazy"
                    />
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
      className="min-w-0 rounded-[1.5rem] border border-border bg-card p-5"
    >
      <div className="whitespace-nowrap text-[2.4rem] font-semibold leading-none tracking-normal text-foreground tabular-nums sm:text-[2.65rem] 2xl:text-[3rem]">
        {count.toLocaleString("id-ID")}
        <span className="text-foreground/60">{stat.suffix}</span>
      </div>
      <div className="mt-3 text-xs leading-5 text-muted-foreground">{stat.label}</div>
    </motion.div>
  );
}
