"use client";

import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const faqs: Array<{ q: string; a: string; category: string }> = [
  {
    category: "Privasi & Anonimitas",
    q: "Apakah data responden benar-benar anonim?",
    a: "Ya. Kami tidak menampilkan jawaban individual ke admin perusahaan. Hasil agregat hanya muncul jika minimum 5 responden per cluster (divisi/level/lokasi). Pipeline ini hard-coded di database — bahkan super admin platform tidak bisa membypass-nya.",
  },
  {
    category: "Privasi & Anonimitas",
    q: "Bagaimana ANSAKA tunduk pada UU PDP Indonesia & GDPR?",
    a: "Kami punya DPO terdaftar, DPA siap tanda tangan elektronik untuk klien B2B, dan menyediakan endpoint untuk hak akses, koreksi, dan penghapusan data. Hosting data di region Indonesia (Jakarta) dengan opsi region Singapura untuk klien multinasional.",
  },
  {
    category: "Survey",
    q: "Berapa lama survey diisi oleh responden?",
    a: "Rata-rata 8–12 menit untuk 27 item OAM. Survey dioptimalkan untuk mobile, dengan progress indicator dan auto-save di tiap pertanyaan agar tidak hilang saat koneksi putus.",
  },
  {
    category: "Survey",
    q: "Apa yang terjadi kalau respon rate kami rendah?",
    a: "Sistem mengirim reminder otomatis pada T+3 dan T+7 hari. Anda juga bisa redistribute link, broadcast via WhatsApp Business, atau perpanjang periode batch. Report tetap dapat di-generate selama minimum N=5 per cluster terpenuhi.",
  },
  {
    category: "Credit & Billing",
    q: "Apa itu 30 credit gratis untuk workspace baru?",
    a: "Setiap workspace yang baru terdaftar otomatis menerima 30 credit, setara dengan 30 link survey aktif. Cukup untuk batch pertama sebagai pilot — tanpa kartu kredit, tanpa komitmen. Promo ini bisa diaktifkan/dimatikan oleh super admin.",
  },
  {
    category: "Credit & Billing",
    q: "Apakah credit bisa hangus?",
    a: "Tidak, selama workspace aktif. Jika workspace tidak aktif lebih dari 12 bulan, kami akan kirim notifikasi 30 hari sebelum credit di-freeze. Dapat di-reaktifasi kapan saja dengan menghubungi support.",
  },
  {
    category: "Credit & Billing",
    q: "Apakah ada refund?",
    a: "Refund 100% untuk credit yang belum digunakan, berlaku 7 hari sejak pembelian. Setelah itu, refund parsial bisa diajukan dengan justifikasi, dievaluasi case-by-case maksimal 14 hari kerja.",
  },
  {
    category: "Credit & Billing",
    q: "Bagaimana invoice & faktur pajak?",
    a: "Setiap pembayaran sukses langsung men-generate invoice ber-nomor seri pajak dan e-Faktur PPN 11%. Bisa diunduh dari dashboard atau dikirim otomatis ke email finance perusahaan Anda.",
  },
  {
    category: "Integrasi & Akses",
    q: "Apakah ada integrasi SSO?",
    a: "Paket Enterprise mendukung SSO Google Workspace dan Microsoft Entra ID (formerly Azure AD), serta SCIM provisioning untuk auto-deactivate user yang resign.",
  },
  {
    category: "Integrasi & Akses",
    q: "Bisa custom branding di halaman survey responden?",
    a: "Ya, mulai paket Growth. Anda bisa upload logo perusahaan dan warna primer yang akan tampil di halaman survey, email reminder, dan halaman ucapan terima kasih.",
  },
  {
    category: "Hasil & Report",
    q: "Format apa saja yang tersedia untuk export report?",
    a: "PDF executive summary (branded), PPTX siap presentasi, XLSX raw data terenkripsi, dan CSV. Selain itu ada shareable link read-only dengan password & expiry.",
  },
  {
    category: "Hasil & Report",
    q: "Apakah ada benchmark industri?",
    a: "Ya. Kami punya database benchmark dari 14 industri di Indonesia, di-update tiap kuartal. Skor perusahaan Anda dibandingkan dengan persentil 25/50/75 industri sejenis & ukuran karyawan setara.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<string | null>(faqs[0].q);
  const categories = Array.from(new Set(faqs.map((f) => f.category)));
  const [activeCat, setActiveCat] = useState<string | "all">("all");

  const visible = activeCat === "all" ? faqs : faqs.filter((f) => f.category === activeCat);

  return (
    <section
      id="faq"
      className="relative border-t border-border bg-background px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              FAQ
            </p>
            <h2 className="mt-5 max-w-xl text-balance text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl">
              Pertanyaan yang paling sering ditanyakan eksekutif.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Tidak menemukan jawaban? Tim kami biasanya respon dalam{" "}
            <span className="font-medium text-foreground">2 jam</span> di hari
            kerja. Buka chat WhatsApp di pojok kanan bawah, atau email{" "}
            <a className="underline hover:no-underline" href="mailto:hello@ansaka.id">
              hello@ansaka.id
            </a>
            .
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          <FilterPill
            active={activeCat === "all"}
            label="Semua"
            onClick={() => setActiveCat("all")}
          />
          {categories.map((c) => (
            <FilterPill
              key={c}
              active={activeCat === c}
              label={c}
              onClick={() => setActiveCat(c)}
            />
          ))}
        </div>

        <ul className="mt-8 grid gap-3">
          {visible.map((f, idx) => {
            const isOpen = open === f.q;
            return (
              <motion.li
                key={f.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                className={cn(
                  "rounded-[1.5rem] border bg-card transition-colors",
                  isOpen ? "border-foreground/40 shadow-ink-soft" : "border-border hover:border-foreground/20",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : f.q)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-6 px-6 py-5 text-left"
                >
                  <span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {f.category}
                    </span>
                    <span className="mt-2 block text-lg font-semibold text-foreground sm:text-xl">
                      {f.q}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "mt-1 grid size-9 shrink-0 place-items-center rounded-full border border-border transition-colors",
                      isOpen ? "bg-foreground text-background" : "bg-background text-foreground",
                    )}
                  >
                    {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                  </span>
                </button>
                <div
                  className={cn(
                    "grid overflow-hidden transition-[grid-template-rows,opacity] duration-300",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="min-h-0">
                    <p className="px-6 pb-6 text-sm leading-7 text-muted-foreground sm:text-base">
                      {f.a}
                    </p>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function FilterPill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card text-foreground/70 hover:border-foreground/40 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
