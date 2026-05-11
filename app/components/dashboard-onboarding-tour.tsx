"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

type TourStep = {
  body: string;
  nextHref?: string;
  target: string;
  title: string;
};

type Rect = {
  height: number;
  left: number;
  top: number;
  width: number;
};

type DashboardOnboardingTourProps = {
  userId?: string;
};

const TOUR_STEPS: TourStep[] = [
  {
    target: "dashboard-nav-overview",
    title: "Overview dashboard",
    body: "Halaman ringkasan untuk melihat batch terbaru, total responden, dan saldo credit workspace.",
  },
  {
    target: "dashboard-create-batch",
    title: "Buat batch survey",
    body: "Mulai assessment baru dari sini. Setiap batch memakai credit sesuai jumlah responden yang dialokasikan.",
  },
  {
    target: "dashboard-nav-batches",
    title: "Menu Batches",
    body: "Di sini Anda mengelola batch survey, menyalin link survey, memantau progres, dan menutup batch saat data siap.",
  },
  {
    target: "dashboard-nav-reports",
    title: "Menu Report",
    body: "Setelah batch selesai, laporan agregat OAM dan insight organisasi bisa dibuka dari menu ini.",
  },
  {
    target: "dashboard-nav-credits",
    title: "Menu Credits",
    body: "Credits dipakai untuk membeli kuota responden. Saya akan buka halaman credit untuk menunjukkan area pembelian.",
    nextHref: "/dashboard/credits",
  },
  {
    target: "credits-balance",
    title: "Saldo credit",
    body: "Bagian ini menunjukkan sisa credit workspace. Satu credit setara satu responden survey yang selesai.",
  },
  {
    target: "credits-packages",
    title: "Paket credit",
    body: "Pilih paket sesuai kebutuhan responden. Tombol Beli Sekarang akan membuat invoice pembayaran.",
  },
  {
    target: "credits-transactions",
    title: "Riwayat transaksi",
    body: "Setiap pembelian, alokasi, dan pemakaian credit akan tercatat di sini untuk audit workspace.",
  },
];

function getStorageKey(userId?: string) {
  return `ansaka.dashboardTour.completed.${userId ?? "anonymous"}`;
}

function getTargetRect(target: string): Rect | null {
  const el = document.querySelector<HTMLElement>(`[data-tour="${target}"]`);
  if (!el) return null;

  const rect = el.getBoundingClientRect();
  const padding = 8;

  return {
    height: rect.height + padding * 2,
    left: Math.max(12, rect.left - padding),
    top: Math.max(12, rect.top - padding),
    width: rect.width + padding * 2,
  };
}

export function DashboardOnboardingTour({ userId }: DashboardOnboardingTourProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);

  const storageKey = useMemo(() => getStorageKey(userId), [userId]);
  const step = TOUR_STEPS[stepIndex];
  const isLast = stepIndex === TOUR_STEPS.length - 1;

  useEffect(() => {
    if (!userId) return;

    const completed = window.localStorage.getItem(storageKey);
    if (!completed) {
      const timer = window.setTimeout(() => setActive(true), 650);
      return () => window.clearTimeout(timer);
    }
  }, [storageKey, userId]);

  const updateRect = useCallback(() => {
    if (!active || !step) return;

    const nextRect = getTargetRect(step.target);
    setRect(nextRect);
  }, [active, step]);

  useEffect(() => {
    if (!active || !step) return;

    let frame = window.requestAnimationFrame(updateRect);
    const timer = window.setTimeout(updateRect, 350);

    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [active, pathname, step, updateRect]);

  useEffect(() => {
    if (!active || !step) return;

    const el = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
    el?.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
  }, [active, stepIndex, step]);

  function finish() {
    window.localStorage.setItem(storageKey, "true");
    setActive(false);
  }

  function next() {
    if (isLast) {
      finish();
      return;
    }

    if (step.nextHref && pathname !== step.nextHref) {
      router.push(step.nextHref);
    }

    setStepIndex((current) => current + 1);
  }

  function back() {
    setStepIndex((current) => Math.max(0, current - 1));
  }

  if (!active || !step) return null;

  const tooltipWidth = 360;
  const tooltipLeft = rect
    ? Math.min(
        window.innerWidth - tooltipWidth - 16,
        Math.max(16, rect.left + rect.width + 18),
      )
    : Math.max(16, (window.innerWidth - tooltipWidth) / 2);
  const tooltipTop = rect
    ? Math.min(
        window.innerHeight - 260,
        Math.max(16, rect.top + rect.height / 2 - 120),
      )
    : Math.max(16, (window.innerHeight - 240) / 2);

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/30" />

      {rect ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed rounded-[1.1rem] border-2 border-primary bg-transparent shadow-[0_0_0_9999px_rgba(2,6,23,0.68),0_0_0_6px_rgba(255,255,255,0.26),0_18px_52px_rgba(15,23,42,0.28)] transition-all duration-200"
          style={{
            height: rect.height,
            left: rect.left,
            top: rect.top,
            width: rect.width,
          }}
        />
      ) : null}

      <section
        aria-live="polite"
        className="fixed rounded-[1.25rem] border border-border bg-card p-5 text-card-foreground shadow-ink-strong"
        style={{
          left: tooltipLeft,
          top: tooltipTop,
          width: tooltipWidth,
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Panduan {stepIndex + 1}/{TOUR_STEPS.length}
          </p>
          <button
            className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            onClick={finish}
            type="button"
          >
            Lewati
          </button>
        </div>
        <h2 className="mt-3 text-xl font-semibold tracking-tight">{step.title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.body}</p>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${((stepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Button disabled={stepIndex === 0} onClick={back} type="button" variant="outline">
            Kembali
          </Button>
          <Button onClick={next} type="button">
            {isLast ? "Selesai" : step.nextHref ? "Buka Credits" : "Lanjut"}
          </Button>
        </div>
      </section>
    </div>
  );
}
