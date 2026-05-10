"use client";

import { motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "6281100000000"; // ganti dengan nomor resmi WA Business
const PRESET_TEXT =
  "Halo ANSAKA, saya tertarik dengan diagnostik OAM dan ingin tahu lebih lanjut tentang 30 credit gratis untuk workspace baru.";

export function WhatsappFab() {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PRESET_TEXT)}`;

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-ink-strong"
        >
          <div className="flex items-center justify-between bg-emerald-600 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-white/15">
                <MessageCircle className="size-4" aria-hidden />
              </span>
              <div className="leading-tight">
                <div className="text-sm font-semibold">Tim ANSAKA</div>
                <div className="text-[11px] text-emerald-100">
                  <span className="mr-1.5 inline-block size-1.5 rounded-full bg-emerald-300" />
                  Online · biasanya balas dalam 5 menit
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="rounded-full p-1 hover:bg-white/15"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="space-y-3 bg-muted/40 px-4 py-5">
            <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-card p-3 text-sm text-foreground shadow-sm">
              👋 Halo! Lagi cari info tentang diagnostik OAM, demo dashboard, atau klaim 30 credit gratis?
            </div>
            <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-card p-3 text-sm text-foreground shadow-sm">
              Klik tombol di bawah, kita lanjut di WhatsApp ya.
            </div>
          </div>

          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-emerald-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            <MessageCircle className="size-4" aria-hidden />
            Lanjut di WhatsApp
          </a>
        </motion.div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat WhatsApp"
        className="group relative grid size-14 place-items-center rounded-full bg-emerald-600 text-white shadow-ink-strong transition-all hover:bg-emerald-700"
      >
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-emerald-500/40" />
        <MessageCircle className="size-6" aria-hidden />
      </button>
    </div>
  );
}
