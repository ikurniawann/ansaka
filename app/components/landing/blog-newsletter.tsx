"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, BookOpen, Send } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";

const articles = [
  {
    tag: "Methodology",
    readTime: "9 min",
    date: "12 Mei 2026",
    title: "Bedanya Engagement Score dan OAM Score — dan kenapa keduanya penting.",
    excerpt:
      "Engagement mengukur perasaan, OAM mengukur sistem. Saat kita menyamakan keduanya, kita sering memperbaiki gejala dan melewatkan akar masalah.",
    href: "/blog/engagement-vs-oam",
  },
  {
    tag: "Leadership",
    readTime: "6 min",
    date: "5 Mei 2026",
    title: "5 sinyal eksekusi yang sering salah dibaca sebagai performance issue.",
    excerpt:
      "Apa yang tampak seperti karyawan kurang accountable sering kali adalah gejala decision rights yang kabur — bukan masalah individu.",
    href: "/blog/eksekusi-bukan-performance",
  },
  {
    tag: "Case Study",
    readTime: "11 min",
    date: "28 April 2026",
    title: "Cara grup manufaktur menurunkan eskalasi keputusan dari 14 hari ke 3 hari.",
    excerpt:
      "Studi kasus singkat: bagaimana redesign decision matrix berdasarkan 3 driver bermasalah menggeser throughput operasi 38%.",
    href: "/blog/decision-bottleneck-fmcg",
  },
];

export function BlogNewsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function subscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: email.split("@")[0] || "Subscriber",
          email,
          company: "Newsletter Subscriber",
          source: "newsletter",
        }),
      }).catch(() => null);
      setDone(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      id="blog"
      className="relative border-t border-border bg-background px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Insight & writing
            </p>
            <h2 className="mt-5 max-w-xl text-balance text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl">
              Catatan praktis untuk pemimpin yang membangun sistem.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Artikel singkat tentang OD, employee experience, leadership cascade,
            dan culture energy. Dikurasi oleh tim diagnostik ANSAKA — tanpa
            jargon konsultan.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {articles.map((a, idx) => (
            <motion.article
              key={a.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: idx * 0.08 }}
              className="group relative flex flex-col rounded-[2rem] border border-border bg-card p-6 transition-all hover:border-foreground/30 hover:shadow-ink-soft"
            >
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <span className="rounded-full border border-border bg-background px-2.5 py-1 text-foreground">
                  {a.tag}
                </span>
                <span>{a.readTime} · {a.date}</span>
              </div>

              <h3 className="mt-6 text-2xl font-semibold leading-snug tracking-[-0.03em] text-foreground">
                {a.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {a.excerpt}
              </p>

              <Link
                href={a.href}
                className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-foreground"
              >
                Baca artikel
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-14 grid gap-6 rounded-[2rem] border border-border bg-card p-6 shadow-ink-soft sm:p-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <BookOpen className="size-4" aria-hidden />
              Newsletter bulanan
            </div>
            <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
              Dapat 1 esai diagnostik per bulan, tanpa spam.
            </h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              Kami kirim 1 email yang bagus. Bukan 5 email yang biasa. Unsubscribe
              kapan saja, link selalu di bagian bawah.
            </p>
          </div>

          {done ? (
            <div className="flex flex-col items-start gap-3 rounded-[1.5rem] border border-emerald-500/30 bg-emerald-500/10 p-6 text-emerald-700 dark:text-emerald-300">
              <Send className="size-5" aria-hidden />
              <p className="text-base font-medium">
                Terima kasih! Cek inbox Anda untuk konfirmasi langganan.
              </p>
            </div>
          ) : (
            <form onSubmit={subscribe} className="flex flex-col gap-3 sm:flex-row">
              <label className="flex-1">
                <span className="sr-only">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="andi@perusahaan.com"
                  className="h-12 w-full rounded-full border border-border bg-background px-5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
                />
              </label>
              <Button type="submit" size="lg" disabled={busy} className="w-full sm:w-auto">
                {busy ? "Mengirim…" : "Subscribe"}
                <ArrowRight className="size-4" />
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
