import { ArrowRight, ArrowUpRight, Building2, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

import { HeroParallax } from "@/components/hero-parallax";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <SiteHeader />
      <HeroParallax />

      <section
        id="insight"
        className="relative z-20 border-t border-border bg-background px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              First section placeholder
            </p>
            <h2 className="mt-5 max-w-xl text-5xl font-semibold tracking-[-0.06em] text-foreground sm:text-7xl">
              Built to expose the operating system behind performance.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Find the leadership signals that are slowing execution.",
              "Turn survey noise into structured failure point intelligence.",
              "Map what the organization says against what the system rewards.",
              "Prioritize interventions before culture debt compounds.",
            ].map((item, index) => (
              <div
                className="min-h-44 rounded-[1.5rem] border border-border bg-card p-6"
                key={item}
              >
                <div className="font-mono text-sm text-muted-foreground">
                  0{index + 1}
                </div>
                <p className="mt-8 text-xl leading-7 text-card-foreground">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="access"
        className="relative z-20 border-t border-border bg-background px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Access portal
            </p>
            <h2 className="mt-5 max-w-xl text-5xl font-semibold tracking-[-0.06em] text-foreground sm:text-7xl">
              Masuk untuk melihat diagnostic workspace.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
              Corporate admin bisa login untuk membuat batch survey, melihat
              hasil agregat, dan mengelola credit. Akun baru bisa mendaftar
              sebagai organization workspace.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: LogIn,
                title: "Login",
                body: "Masuk ke dashboard organisasi yang sudah aktif.",
                action: "Open login",
              },
              {
                icon: UserPlus,
                title: "Sign up",
                body: "Daftarkan company workspace dan admin pertama.",
                action: "Create account",
              },
              {
                icon: Building2,
                title: "Demo access",
                body: "Minta guided walkthrough sebelum menjalankan survey.",
                action: "Book demo",
              },
            ].map((item) => (
              <Link
                className="group flex min-h-72 flex-col justify-between rounded-[1.5rem] border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-ink-soft"
                href={
                  item.title === "Login"
                    ? "/login"
                    : item.title === "Sign up"
                      ? "/signup"
                      : "#contact"
                }
                key={item.title}
              >
                <div>
                  <div className="grid size-11 place-items-center rounded-full bg-foreground text-background">
                    <item.icon className="size-5" />
                  </div>
                  <h3 className="mt-8 text-2xl font-semibold tracking-[-0.04em] text-card-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.body}
                  </p>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-border pt-5 text-sm font-medium text-card-foreground">
                  {item.action}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="border-t border-border bg-foreground px-4 py-16 text-background sm:px-6 lg:px-8"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
            Ready to see what the system is really doing?
          </h2>
          <Button asChild variant="outline" className="border-background/25 text-background hover:text-background">
            <a href="mailto:hello@ansaka.id">
              Let&apos;s connect
              <ArrowUpRight className="size-4" />
            </a>
          </Button>
        </div>
      </section>
    </main>
  );
}
