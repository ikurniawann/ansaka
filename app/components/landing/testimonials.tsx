"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  industry: string;
  rating: number;
  initials: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Sebagai CHRO grup dengan 12 anak usaha, saya butuh bahasa diagnosis yang sama untuk semua BU. ANSAKA memberi kami itu — dan reportnya benar-benar dipakai oleh BoD, bukan diendapkan.",
    name: "Renata Lestari",
    role: "Chief Human Capital Officer",
    company: "Group Holding · Consumer & Logistics",
    industry: "Consumer Group",
    rating: 5,
    initials: "RL",
  },
  {
    quote:
      "Saya skeptis awalnya — sudah pernah pakai 3 vendor survey. Yang berbeda di ANSAKA adalah report tidak hanya menjelaskan apa, tapi titik kegagalan persisnya di mana. Itu yang akhirnya berani dipakai.",
    name: "Bayu Pradipta",
    role: "Chief Operating Officer",
    company: "PT Industri Otomotif",
    industry: "Manufaktur",
    rating: 5,
    initials: "BP",
  },
  {
    quote:
      "Dengan 30 credit gratis kami bisa coba batch pertama tanpa komite pengadaan. Dalam 2 minggu hasilnya sudah dibawa ke executive committee. Tidak ada vendor lain yang sefleksibel ini.",
    name: "Siti Maharani",
    role: "VP People & Culture",
    company: "Tech Series B",
    industry: "Tech / SaaS",
    rating: 5,
    initials: "SM",
  },
  {
    quote:
      "Anonimitas responden benar-benar dijaga. Kami sempat audit data pipeline-nya, dan minimum N=5 per cluster sudah hard-coded. Tim kami akhirnya berani memberi feedback jujur.",
    name: "Imam Setiawan",
    role: "Head of Internal Audit",
    company: "BUMN Energi",
    industry: "BUMN",
    rating: 5,
    initials: "IS",
  },
  {
    quote:
      "Action plan tracker-nya ngebantu banget — biasanya rekomendasi konsultan menguap setelah closing meeting. Di sini setiap rekomendasi punya owner, due date, dan progress.",
    name: "Dharma Wijaya",
    role: "Direktur SDM",
    company: "Bank Daerah Jawa",
    industry: "Banking",
    rating: 5,
    initials: "DW",
  },
];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => {
      setActive((v) => (v + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(id);
  }, [auto]);

  const t = testimonials[active];

  return (
    <section className="relative border-t border-border bg-muted/40 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Voice of executives
            </p>
            <h2 className="mt-5 max-w-xl text-balance text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl">
              Apa kata mereka yang sudah memetakan organisasinya.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Testimoni di bawah dipublikasikan dengan persetujuan tertulis.
            Beberapa nama perusahaan diringkas atas permintaan klien sesuai
            internal communication policy.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div
            className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-ink-soft sm:p-12"
            onMouseEnter={() => setAuto(false)}
            onMouseLeave={() => setAuto(true)}
          >
            <Quote className="size-10 text-foreground/20" aria-hidden />

            <AnimatePresence mode="wait">
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <p className="mt-6 text-balance text-2xl font-medium leading-9 tracking-[-0.02em] text-foreground sm:text-3xl">
                  “{t.quote}”
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-border pt-6">
                  <div className="flex items-center gap-4">
                    <span className="grid size-12 place-items-center rounded-full bg-foreground text-sm font-semibold text-background">
                      {t.initials}
                    </span>
                    <div>
                      <div className="text-base font-semibold text-foreground">
                        {t.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t.role} · {t.company}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-4 fill-amber-400 text-amber-400"
                        aria-hidden
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Testimonial ${i + 1}`}
                    onClick={() => {
                      setActive(i);
                      setAuto(false);
                    }}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === active
                        ? "w-8 bg-foreground"
                        : "w-3 bg-foreground/20 hover:bg-foreground/40",
                    )}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous"
                  onClick={() => {
                    setActive((v) => (v - 1 + testimonials.length) % testimonials.length);
                    setAuto(false);
                  }}
                  className="grid size-10 place-items-center rounded-full border border-border bg-background hover:bg-muted"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  onClick={() => {
                    setActive((v) => (v + 1) % testimonials.length);
                    setAuto(false);
                  }}
                  className="grid size-10 place-items-center rounded-full border border-border bg-background hover:bg-muted"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Side list */}
          <ul className="grid gap-3">
            {testimonials.map((item, idx) => (
              <li key={item.name}>
                <button
                  type="button"
                  onClick={() => {
                    setActive(idx);
                    setAuto(false);
                  }}
                  className={cn(
                    "group flex w-full items-start gap-4 rounded-[1.5rem] border p-4 text-left transition-all",
                    idx === active
                      ? "border-foreground/40 bg-card shadow-ink-soft"
                      : "border-border bg-card/60 hover:border-foreground/20 hover:bg-card",
                  )}
                >
                  <span className="mt-1 grid size-10 shrink-0 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">
                    {item.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-foreground">
                      {item.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {item.role}
                    </span>
                    <span className="mt-2 line-clamp-2 block text-xs leading-5 text-foreground/70">
                      “{item.quote}”
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
