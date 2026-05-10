"use client";

import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Calculator, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Plan = {
  id: string;
  name: string;
  tagline: string;
  pricePerCredit: number; // IDR
  credits: number;
  pricing: number; // total IDR
  perks: string[];
  highlight?: boolean;
  badge?: string;
};

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Tim kecil & pilot project",
    pricePerCredit: 25000,
    credits: 100,
    pricing: 2_500_000,
    perks: [
      "100 link survey aktif",
      "Template OAM lengkap",
      "Report PDF executive",
      "Email reminder otomatis",
      "Email support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "Perusahaan menengah & multi-divisi",
    pricePerCredit: 18000,
    credits: 500,
    pricing: 9_000_000,
    perks: [
      "500 link survey aktif",
      "Multi-user (5 admin) + role-based access",
      "Benchmark industri",
      "Comparison antar batch (YoY/QoQ)",
      "Action plan tracker",
      "Priority support 1×24",
    ],
    highlight: true,
    badge: "Paling populer",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Group holding, BUMN, multi-entity",
    pricePerCredit: 12000,
    credits: 2500,
    pricing: 30_000_000,
    perks: [
      "2.500+ link, kustom on request",
      "Unlimited admin & SSO Microsoft/Google",
      "White-label branding survey",
      "API & SCIM provisioning",
      "DPA + audit log immutable",
      "Dedicated CSM + SLA 99.9%",
    ],
  },
];

const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

export function Pricing() {
  const [respondents, setRespondents] = useState(250);
  const [batches, setBatches] = useState(1);

  const calc = useMemo(() => {
    const totalCredits = Math.max(respondents * batches, 0);
    const billable = Math.max(totalCredits - 30, 0); // free 30 credits for new account
    // pick best per-credit rate for the volume
    const sortedPlans = [...PLANS].sort((a, b) => b.credits - a.credits);
    const bestPlan =
      sortedPlans.find((p) => billable >= p.credits) ?? PLANS[0];
    const total = billable * bestPlan.pricePerCredit;
    return {
      totalCredits,
      billable,
      bestPlan,
      total,
    };
  }, [respondents, batches]);

  return (
    <section
      id="pricing"
      className="relative border-t border-border bg-background px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Pricing
            </p>
            <h2 className="mt-5 max-w-xl text-balance text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl">
              Bayar per credit. 1 credit = 1 link survey.
            </h2>
          </div>
          <div className="max-w-xl space-y-3 text-base leading-7 text-muted-foreground sm:text-lg">
            <p>
              Tidak ada minimum kontrak tahunan. Credit tidak hangus selama
              workspace aktif. Top-up kapan saja, refund 7 hari pertama.
            </p>
            <p className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
              <Sparkles className="size-4" aria-hidden />
              Workspace baru otomatis dapat 30 credit gratis
            </p>
          </div>
        </div>

        {/* Plans */}
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: idx * 0.08 }}
              className={cn(
                "relative flex flex-col rounded-[2rem] border p-7 transition-all",
                plan.highlight
                  ? "border-foreground bg-foreground text-background shadow-ink-soft"
                  : "border-border bg-card text-foreground hover:border-foreground/40",
              )}
            >
              {plan.badge ? (
                <div className="absolute -top-3 left-7 rounded-full bg-amber-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">
                  {plan.badge}
                </div>
              ) : null}

              <div
                className={cn(
                  "text-xs uppercase tracking-[0.22em]",
                  plan.highlight ? "text-background/55" : "text-muted-foreground",
                )}
              >
                {plan.name}
              </div>
              <div className="mt-2 text-sm">
                <span
                  className={
                    plan.highlight ? "text-background/70" : "text-muted-foreground"
                  }
                >
                  {plan.tagline}
                </span>
              </div>

              <div className="mt-7 flex items-baseline gap-2">
                <span className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                  {formatIDR(plan.pricePerCredit).replace(/\s?Rp\s?/, "Rp ")}
                </span>
                <span
                  className={cn(
                    "text-sm",
                    plan.highlight ? "text-background/60" : "text-muted-foreground",
                  )}
                >
                  / credit
                </span>
              </div>
              <div
                className={cn(
                  "mt-1 text-sm",
                  plan.highlight ? "text-background/65" : "text-muted-foreground",
                )}
              >
                Min. {plan.credits.toLocaleString("id-ID")} credit · {formatIDR(plan.pricing)}
              </div>

              <ul className="mt-7 space-y-2.5 text-sm">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3">
                    <BadgeCheck
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        plan.highlight ? "text-amber-300" : "text-foreground",
                      )}
                      aria-hidden
                    />
                    <span
                      className={cn(
                        "leading-6",
                        plan.highlight ? "text-background/85" : "text-foreground/85",
                      )}
                    >
                      {perk}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-7">
                <Button
                  asChild
                  variant={plan.highlight ? "outline" : "default"}
                  className={cn(
                    "w-full justify-between",
                    plan.highlight &&
                      "border-background/30 bg-background/10 text-background hover:bg-background/20 hover:text-background",
                  )}
                >
                  <Link href={plan.id === "enterprise" ? "/#book-demo" : "/signup"}>
                    {plan.id === "enterprise" ? "Hubungi sales" : "Mulai gratis"}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Calculator */}
        <div className="mt-14 grid gap-6 rounded-[2rem] border border-border bg-card p-6 shadow-ink-soft sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <Calculator className="size-4" aria-hidden />
              Kalkulator credit
            </div>
            <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
              Hitung kebutuhan untuk perusahaan Anda.
            </h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              Masukkan jumlah responden dan berapa kali batch dijalankan dalam
              setahun. Kami otomatis mengurangi 30 credit gratis dari total.
            </p>

            <div className="mt-7 space-y-6">
              <Slider
                label="Jumlah responden"
                value={respondents}
                min={20}
                max={5000}
                step={10}
                onChange={setRespondents}
                format={(v) => `${v.toLocaleString("id-ID")} orang`}
              />
              <Slider
                label="Frekuensi batch / tahun"
                value={batches}
                min={1}
                max={4}
                step={1}
                onChange={setBatches}
                format={(v) => `${v}× / tahun`}
              />
            </div>
          </div>

          <div className="flex flex-col rounded-[1.5rem] border border-border bg-background/60 p-6">
            <div className="grid gap-4 text-sm">
              <Row label="Total credit dibutuhkan" value={`${calc.totalCredits.toLocaleString("id-ID")} credit`} />
              <Row label="Credit gratis (signup)" value="− 30 credit" tone="positive" />
              <Row label="Credit billable" value={`${calc.billable.toLocaleString("id-ID")} credit`} />
              <div className="my-2 h-px bg-border" />
              <Row label="Paket terbaik" value={calc.bestPlan.name} />
              <Row label="Harga / credit" value={formatIDR(calc.bestPlan.pricePerCredit)} />
            </div>

            <div className="mt-6 rounded-2xl bg-foreground p-5 text-background">
              <div className="text-xs uppercase tracking-[0.22em] text-background/55">
                Estimasi total
              </div>
              <div className="mt-2 text-4xl font-semibold tracking-[-0.04em]">
                {formatIDR(calc.total)}
              </div>
              <div className="mt-1 text-xs text-background/60">
                Sudah dipotong 30 credit gratis · belum termasuk PPN 11%
              </div>
            </div>

            <Button asChild size="lg" className="mt-5">
              <Link href="/signup">
                Klaim 30 credit & mulai
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "positive";
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "font-mono font-semibold tabular-nums",
          tone === "positive" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground/80">{label}</span>
        <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-foreground"
        aria-label={label}
      />
      <div className="mt-1 flex justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </label>
  );
}
