import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  ["I.", "Insight"],
  ["II.", "Method"],
  ["III.", "Diagnostics"],
  ["IV.", "Advisory"],
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/12 bg-background/45 px-3 py-2 shadow-ink-soft backdrop-blur-2xl supports-[backdrop-filter]:bg-background/35">
        <Link href="/" className="flex items-center gap-3 pl-2">
          <span className="grid size-8 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">
            A
          </span>
          <span className="text-sm font-semibold tracking-[0.28em] text-foreground">
            ANSAKA
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-xs uppercase tracking-[0.22em] text-muted-foreground xl:flex">
          {navItems.map(([index, label]) => (
            <a
              className="group flex items-center gap-2 transition-colors hover:text-foreground"
              href={`#${label.toLowerCase()}`}
              key={label}
            >
              <span className="font-mono text-[10px] text-foreground/60">
                {index}
              </span>
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden md:inline-flex">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" className="hidden lg:inline-flex">
            <Link href="/signup">
              Sign up
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <ThemeToggle />
          <Button asChild variant="default" className="hidden sm:inline-flex">
            <a href="#contact">
              Start diagnostic
              <ArrowUpRight className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
