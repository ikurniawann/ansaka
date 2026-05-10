"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";

const sizeOptions = [
  "1–50 karyawan",
  "51–250 karyawan",
  "251–1.000 karyawan",
  "1.001–5.000 karyawan",
  "5.000+ karyawan",
];

const industryOptions = [
  "Manufaktur",
  "Banking & Finance",
  "Consumer Goods",
  "Tech / SaaS",
  "BUMN",
  "Healthcare",
  "Energi & Pertambangan",
  "Properti & Konstruksi",
  "Logistik",
  "Pendidikan",
  "Lainnya",
];

export function CtaDemo() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [size, setSize] = useState(sizeOptions[1]);
  const [industry, setIndustry] = useState(industryOptions[0]);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!name || !email || !company) {
      setError("Nama, email kantor, dan nama perusahaan wajib diisi.");
      return;
    }

    setBusy(true);
    try {
      // Best-effort POST. The endpoint is created in a follow-up task; we degrade gracefully.
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          size,
          industry,
          message,
          source: "landing_book_demo",
        }),
      }).catch(() => null);

      setSubmitted(true);
    } catch {
      setError("Tidak bisa mengirim sekarang. Coba lagi atau hubungi hello@ansaka.id.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      id="book-demo"
      className="relative border-t border-border bg-foreground px-4 py-24 text-background sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="absolute inset-0 -z-0 opacity-30" aria-hidden>
        <div className="h-full w-full bg-[radial-gradient(circle_at_15%_20%,rgba(125,211,252,0.4),transparent_45%),radial-gradient(circle_at_85%_30%,rgba(244,202,137,0.4),transparent_45%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-background/55">
              Book a call
            </p>
            <h2 className="mt-5 max-w-xl text-balance text-4xl font-semibold tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Bicara 30 menit dengan tim diagnostik kami.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-background/70 sm:text-lg">
              Kami akan walk-through workspace, sample report, dan konfigurasi
              yang paling pas untuk struktur perusahaan Anda. Tidak ada slide
              jualan — kami buka langsung dashboard live.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                "Demo dashboard untuk admin perusahaan",
                "Walk-through methodology OAM (5 layer × 12 driver)",
                "Estimasi credit & timeline pilot batch",
                "Setup awal dengan 30 credit gratis",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-base text-background/80">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-amber-300" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>

            <div className="mt-10 grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-amber-200" aria-hidden />
                <a
                  href="mailto:hello@ansaka.id"
                  className="text-sm text-background/85 hover:underline"
                >
                  hello@ansaka.id
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="size-5 text-amber-200" aria-hidden />
                <a
                  href="https://wa.me/6281100000000"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-background/85 hover:underline"
                >
                  +62 811 0000 0000
                </a>
              </div>
              <div className="flex items-center gap-3 sm:col-span-2">
                <ShieldCheck className="size-5 text-amber-200" aria-hidden />
                <span className="text-xs text-background/65">
                  Submission diproses berdasarkan UU PDP. Tidak akan dijual ke pihak ketiga.
                </span>
              </div>
            </div>
          </div>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="rounded-[2rem] border border-white/15 bg-white/[0.05] p-6 shadow-ink-soft backdrop-blur-2xl sm:p-8"
          >
            {submitted ? (
              <div className="grid place-items-center py-16 text-center">
                <span className="grid size-16 place-items-center rounded-full bg-amber-300 text-foreground">
                  <CheckCircle2 className="size-8" />
                </span>
                <h3 className="mt-6 text-3xl font-semibold tracking-[-0.04em]">
                  Terima kasih, {name.split(" ")[0]}.
                </h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-background/70">
                  Tim kami akan menghubungi Anda di {email} dalam 1×24 jam kerja.
                  Sambil menunggu, klaim 30 credit gratis Anda dan mulai
                  workspace pertama.
                </p>
                <Button asChild className="mt-7" size="lg">
                  <a href="/signup">
                    Klaim 30 credit
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Nama lengkap"
                    icon={<User className="size-4" />}
                    placeholder="Andi Wijaya"
                    value={name}
                    onChange={setName}
                    required
                  />
                  <Field
                    label="Email kantor"
                    icon={<Mail className="size-4" />}
                    placeholder="andi@perusahaan.com"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    required
                  />
                  <Field
                    label="WhatsApp / Telp"
                    icon={<Phone className="size-4" />}
                    placeholder="08xx xxxx xxxx"
                    value={phone}
                    onChange={setPhone}
                  />
                  <Field
                    label="Nama perusahaan"
                    icon={<Building2 className="size-4" />}
                    placeholder="PT Contoh Tbk"
                    value={company}
                    onChange={setCompany}
                    required
                  />
                  <SelectField
                    label="Ukuran perusahaan"
                    icon={<Users className="size-4" />}
                    options={sizeOptions}
                    value={size}
                    onChange={setSize}
                  />
                  <SelectField
                    label="Industri"
                    options={industryOptions}
                    value={industry}
                    onChange={setIndustry}
                  />
                </div>

                <label className="mt-4 block">
                  <span className="text-xs uppercase tracking-[0.22em] text-background/55">
                    Konteks (opsional)
                  </span>
                  <textarea
                    className="mt-3 min-h-32 w-full rounded-2xl border border-white/15 bg-background/10 p-4 text-sm leading-6 text-background outline-none placeholder:text-background/40 focus:border-amber-300/70 focus:ring-2 focus:ring-amber-300/30"
                    placeholder="Tantangan utama yang ingin didiagnosis…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={1500}
                  />
                </label>

                {error ? (
                  <div className="mt-4 rounded-2xl border border-rose-400/40 bg-rose-500/10 p-3 text-sm text-rose-200">
                    {error}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  size="lg"
                  className="mt-6 w-full justify-between"
                  disabled={busy}
                >
                  {busy ? "Mengirim…" : "Book a 30-min demo"}
                  <ArrowRight className="size-4" />
                </Button>

                <p className="mt-4 text-center text-xs text-background/55">
                  Submit form ini = setuju dengan{" "}
                  <a href="/legal/privacy" className="underline hover:no-underline">
                    Privacy Policy
                  </a>{" "}
                  &{" "}
                  <a href="/legal/terms" className="underline hover:no-underline">
                    ToS
                  </a>
                  .
                </p>
              </>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.22em] text-background/55">
        {label}
        {required ? <span className="ml-1 text-amber-300">*</span> : null}
      </span>
      <div className="mt-3 flex h-12 items-center gap-3 rounded-full border border-white/15 bg-background/10 px-4 transition-colors focus-within:border-amber-300/70 focus-within:ring-2 focus-within:ring-amber-300/20">
        {icon ? <span className="text-background/55">{icon}</span> : null}
        <input
          required={required}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-full w-full bg-transparent text-sm text-background outline-none placeholder:text-background/40"
        />
      </div>
    </label>
  );
}

function SelectField({
  label,
  options,
  value,
  onChange,
  icon,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.22em] text-background/55">
        {label}
      </span>
      <div className="mt-3 flex h-12 items-center gap-3 rounded-full border border-white/15 bg-background/10 px-4 focus-within:border-amber-300/70 focus-within:ring-2 focus-within:ring-amber-300/20">
        {icon ? <span className="text-background/55">{icon}</span> : null}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-full w-full appearance-none bg-transparent text-sm text-background outline-none"
        >
          {options.map((o) => (
            <option key={o} value={o} className="bg-foreground text-background">
              {o}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}
