"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  LogIn,
  Play,
  Sparkles,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { TextReveal } from "@/components/aceternity/text-reveal";
import { Button } from "@/components/ui/button";

const heroImage =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2400&q=85";

const metrics = [
  ["12", "Organizational drivers"],
  ["27", "Failure point signals"],
  ["5", "Execution layers"],
];

const priorities = [
  ["D7", "Decision friction", "Critical signal"],
  ["3.42", "Culture pulse", "Stable"],
  ["84%", "Strategic clarity", "Improving"],
];

export function HeroParallax() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    mass: 0.25,
  });

  const imageY = useTransform(smoothProgress, [0, 1], ["0%", "14%"]);
  const imageScale = useTransform(smoothProgress, [0, 1], [1.04, 1.12]);
  const contentY = useTransform(smoothProgress, [0, 1], ["0%", "-12%"]);
  const opacity = useTransform(smoothProgress, [0, 0.78], [1, 0]);
  const ringY = useTransform(smoothProgress, [0, 1], ["0%", "-22%"]);
  const panelY = useTransform(smoothProgress, [0, 1], ["0%", "-8%"]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="relative min-h-[128vh] overflow-hidden bg-background text-foreground"
    >
      <div className="sticky top-0 min-h-screen overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ y: imageY, scale: imageScale }}
        >
          <div
            className="absolute inset-[-5%] bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,10,0.94),rgba(5,7,10,0.72)_45%,rgba(5,7,10,0.44)),linear-gradient(180deg,rgba(5,7,10,0.18),rgba(5,7,10,0.94))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_42%,rgba(125,211,252,0.16),transparent_34%)]" />
        </motion.div>

        <BackgroundBeams />

        <motion.div
          aria-hidden="true"
          className="absolute right-[7%] top-[24%] hidden h-[34rem] w-[34rem] rounded-full border border-white/14 xl:block"
          style={{ y: ringY }}
        />

        <div className="relative z-10 flex min-h-screen items-center px-4 pb-20 pt-36 sm:px-6 lg:px-8">
          <motion.div
            className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_410px] lg:items-center"
            style={{ y: contentY, opacity }}
          >
            <div className="max-w-4xl">
              <motion.div
                className="mb-5 flex w-fit items-center gap-3 rounded-full border border-white/15 bg-black/30 px-3 py-2 text-[11px] uppercase tracking-widest text-white/75 backdrop-blur-2xl"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <span className="size-2 rounded-full bg-cyan-200 shadow-[0_0_22px_rgba(103,232,249,0.9)]" />
                Executive alignment map
              </motion.div>

              <motion.div
                className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-amber-200/40 bg-amber-200/15 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-amber-100 backdrop-blur-2xl"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.16, ease: "easeOut" }}
              >
                <Sparkles className="size-3.5 shrink-0" aria-hidden />
                <span className="truncate">Workspace baru dapat 30 credit gratis</span>
              </motion.div>

              <h1
                id="hero-heading"
                className="max-w-4xl text-balance text-6xl font-semibold leading-none tracking-normal text-white sm:text-7xl lg:text-8xl"
              >
                <TextReveal delay={0.08}>Diagnose the hidden system</TextReveal>
              </h1>

              <motion.p
                className="mt-7 max-w-2xl text-lg leading-8 text-white/82"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              >
                ANSAKA membantu eksekutif membaca sinyal leadership, ritme
                eksekusi, dan energi budaya menjadi satu peta keputusan yang
                jelas sebelum pertumbuhan menjadi mahal.
              </motion.p>

              <motion.div
                className="mt-8 flex flex-wrap items-center gap-3"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.66, ease: "easeOut" }}
              >
                <Button asChild size="lg">
                  <Link href="/signup">
                    Klaim 30 credit gratis
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="border border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                >
                  <a href="#sample-report">
                    <Play className="size-4 fill-current" />
                    Lihat sample report
                  </a>
                </Button>
              </motion.div>

              <motion.div
                className="mt-4 flex flex-wrap items-center gap-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.76, ease: "easeOut" }}
              >
                <Button
                  asChild
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                >
                  <Link href="/login">
                    <LogIn className="size-4" />
                    Login portal
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="border border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                >
                  <Link href="/signup">
                    <UserPlus className="size-4" />
                    Create account
                  </Link>
                </Button>
              </motion.div>
            </div>

            <motion.aside
              aria-label="ANSAKA OAM framework summary"
              className="relative hidden rounded-[1.75rem] border border-white/16 bg-black/34 p-5 text-white shadow-ink-soft backdrop-blur-2xl lg:block"
              style={{ y: panelY }}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, delay: 0.58, ease: "easeOut" }}
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/55">OAM Insight</p>
                  <h2 className="mt-1 text-xl font-semibold tracking-normal">Executive map</h2>
                </div>
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">
                  live
                </span>
              </div>

              <div className="grid gap-3">
                {metrics.map(([value, label]) => (
                  <div
                    className="grid grid-cols-[72px_1fr] items-center gap-4 rounded-[1.15rem] border border-white/12 bg-white/[0.07] p-4"
                    key={label}
                  >
                    <div className="text-4xl font-semibold leading-none tracking-normal">
                      {value}
                    </div>
                    <div className="text-xs uppercase leading-5 tracking-widest text-white/62">
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-[1.25rem] border border-white/12 bg-white/[0.07] p-4">
                <p className="text-xs uppercase tracking-widest text-white/55">Priority signals</p>
                <div className="mt-3 space-y-3">
                  {priorities.map(([value, label, status]) => (
                    <div className="flex items-center justify-between gap-4" key={label}>
                      <div>
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-xs text-white/48">{status}</p>
                      </div>
                      <span className="text-2xl font-semibold tracking-normal">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-[1.25rem] border border-white/12 bg-white/[0.07] p-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-widest text-white/55">
                  Scroll depth
                  <ArrowDown className="size-4 animate-bounce" />
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-200 via-white to-amber-200"
                    style={{ scaleX: smoothProgress, transformOrigin: "left" }}
                  />
                </div>
              </div>

              <Button
                asChild
                variant="ghost"
                className="mt-4 w-full justify-between border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                <Link href="/login">
                  Login or create workspace
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </motion.aside>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 border-y border-white/10 bg-black/32 py-3 text-white backdrop-blur-xl">
          <div className="flex animate-marquee whitespace-nowrap text-[11px] uppercase tracking-widest text-white/55">
            {Array.from({ length: 2 }).map((_, group) => (
              <div className="flex min-w-full justify-around gap-12" key={group}>
                <span>Strategy</span>
                <span>Leadership</span>
                <span>Management cascade</span>
                <span>Team execution</span>
                <span>Capability fit</span>
                <span>Culture energy</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
