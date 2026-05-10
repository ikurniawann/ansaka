"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { supabase } from "@/lib/supabase-client";
import { cn } from "@/lib/utils";

export type SiteHeaderProps = {
  /** When true, hides the marketing promo strip (e.g. on dashboard). */
  hidePromo?: boolean;
};

const navItems: Array<{ label: string; href: string }> = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Method", href: "/#method" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Cases", href: "/#cases" },
  { label: "FAQ", href: "/#faq" },
];

export function SiteHeader({ hidePromo = false }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) setIsAuthenticated(Boolean(session));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      {!hidePromo ? <PromoStrip /> : null}

      <header
        className={cn(
          "fixed inset-x-0 z-50 px-3 transition-all duration-300 sm:px-6 lg:px-8",
          hidePromo ? "top-3" : "top-9 sm:top-10",
          scrolled && "top-3",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-6xl items-center justify-between rounded-full border border-border/80 bg-card/90 px-3 py-1.5 shadow-ink-soft backdrop-blur-2xl transition-all duration-300",
            "supports-[backdrop-filter]:bg-card/85 dark:border-white/10 dark:bg-background/45 dark:supports-[backdrop-filter]:bg-background/40",
            scrolled && "shadow-ink-strong",
          )}
        >
          <Link href="/" className="flex items-center gap-3 pl-2">
            <span className="grid size-8 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">
              A
            </span>
            <span className="text-sm font-semibold tracking-[0.28em] text-foreground">
              ANSAKA
            </span>
          </Link>

          <nav className="hidden items-center gap-5 text-[11px] uppercase tracking-[0.22em] text-foreground/70 xl:flex">
            {navItems.map((item) => (
              <Link
                className="group transition-colors hover:text-foreground"
                href={item.href}
                key={item.label}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button asChild variant="outline" className="hidden h-10 md:inline-flex">
                <Link href="/dashboard">
                  Dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="hidden h-10 md:inline-flex">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild variant="outline" className="hidden h-10 lg:inline-flex">
                  <Link href="/signup">
                    Sign up
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </>
            )}
            <ThemeToggle />
            <Button asChild variant="default" className="hidden h-10 sm:inline-flex">
              <Link href="/#book-demo">
                Book a demo
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>

            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((value) => !value)}
              className="grid size-10 place-items-center rounded-full border border-border/70 bg-card/70 text-foreground xl:hidden"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          className={cn(
            "mx-auto mt-3 max-w-7xl overflow-hidden rounded-[1.75rem] border border-border bg-card/95 shadow-ink-soft backdrop-blur-2xl transition-all duration-300 xl:hidden",
            mobileOpen
              ? "max-h-[640px] opacity-100"
              : "pointer-events-none max-h-0 border-transparent opacity-0 shadow-none",
          )}
        >
          <nav className="flex flex-col gap-1 p-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
                <ArrowRight className="size-4 text-foreground/40" />
              </Link>
            ))}
            {isAuthenticated ? (
              <div className="mt-2 border-t border-border/70 px-2 pt-3">
                <Button asChild className="w-full">
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    Dashboard
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border/70 px-2 pt-3">
                <Button asChild variant="outline">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/signup" onClick={() => setMobileOpen(false)}>
                    Sign up
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}

function PromoStrip() {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] border-b border-border/40 bg-foreground/95 text-background backdrop-blur-2xl">
      <div className="mx-auto flex h-9 max-w-6xl items-center justify-between gap-3 px-4 text-[11px] font-medium uppercase tracking-[0.2em] sm:px-6 lg:px-8">
        <span className="flex items-center gap-2 truncate">
          <Sparkles className="size-3.5 shrink-0 text-amber-200" aria-hidden />
          <span className="truncate">
            <span className="text-amber-200">Promo:</span>{" "}
            <span className="text-background/90">
              Workspace baru dapat 30 credit gratis = 30 link survey
            </span>
          </span>
        </span>
        <Link
          href="/signup"
          className="hidden shrink-0 items-center gap-1 text-amber-200 transition-colors hover:text-amber-100 sm:inline-flex"
        >
          Klaim sekarang
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
