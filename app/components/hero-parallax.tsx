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
          className="absolute right-[8%] top-[25%] hidden h-[30rem] w-[30rem] rounded-full border border-white/14 xl:block"
          style={{ y: ringY }}
        />

        <div className="relative z-10 flex min-h-screen items-center px-4 pb-18 pt-32 sm:px-6 lg:px-8">
          <motion.div
            className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_330px] xl:grid-cols-[minmax(0,1fr)_370px] lg:items-center"
            style={{ y: contentY }}
          >
            <div className="max-w-3xl">
              <motion.div
                className="mb-4 flex w-fit items-center gap-3 rounded-full border border-white/15 bg-black/30 px-3 py-2 text-[10px] uppercase tracking-widest text-white/75 backdrop-blur-2xl"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <span className="size-2 rounded-full bg-cyan-200 shadow-[0_0_22px_rgba(103,232,249,0.9)]" />
                Executive alignment map
              </motion.div>

              <motion.div
                className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-amber-200/40 bg-amber-200/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-amber-100 backdrop-blur-2xl"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px" }}
                transition={{ duration: 0.7, delay: 0.16, ease: "easeOut" }}
              >
                <Sparkles className="size-3.5 shrink-0" aria-hidden />
                <span className="truncate">Workspace baru dapat 30 credit gratis</span>
              </motion.div>

              <h1
                id="hero-heading"
                className="max-w-3xl text-balance text-5xl font-semibold leading-[0.96] tracking-normal text-white sm:text-6xl lg:text-7xl xl:text-[5.75rem]"
              >
                <TextReveal delay={0.08}>Diagnose the hidden system</TextReveal>
              </h1>

              <motion.p
                className="mt-6 max-w-xl text-base leading-7 text-white/82 lg:text-[1.05rem]"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px" }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              >
                ANSAKA membantu eksekutif membaca sinyal leadership, ritme
                eksekusi, dan energi budaya menjadi satu peta keputusan yang
                jelas sebelum pertumbuhan menjadi mahal.
              </motion.p>

              <motion.div
                className="mt-7 flex flex-wrap items-center gap-3"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px" }}
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
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px" }}
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
              className="relative hidden rounded-[1.5rem] border border-white/16 bg-black/34 p-4 text-white shadow-ink-soft backdrop-blur-2xl lg:block"
              style={{ y: panelY }}
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.85, delay: 0.58, ease: "easeOut" }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-white/55">OAM Insight</p>
                  <h2 className="mt-1 text-lg font-semibold tracking-normal">Executive map</h2>
                </div>
                <span className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-white/70">
                  live
                </span>
              </div>

              <div className="grid gap-2.5">
                {metrics.map(([value, label]) => (
                  <div
                    className="grid grid-cols-[58px_1fr] items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.07] p-3.5"
                    key={label}
                  >
                    <div className="text-3xl font-semibold leading-none tracking-normal">
                      {value}
                    </div>
                    <div className="text-[11px] uppercase leading-5 tracking-widest text-white/62">
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3.5 rounded-2xl border border-white/12 bg-white/[0.07] p-3.5">
                <p className="text-[11px] uppercase tracking-widest text-white/55">Priority signals</p>
                <div className="mt-3 space-y-2.5">
                  {priorities.map(([value, label, status]) => (
                    <div className="flex items-center justify-between gap-4" key={label}>
                      <div>
                        <p className="text-[13px] font-medium">{label}</p>
                        <p className="text-[11px] text-white/48">{status}</p>
                      </div>
                      <span className="text-xl font-semibold tracking-normal">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3.5 rounded-2xl border border-white/12 bg-white/[0.07] p-3.5">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-white/55">
                  Scroll depth
                  <ArrowDown className="size-4 animate-bounce" />
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-200 via-white to-amber-200"
                    style={{ scaleX: smoothProgress, transformOrigin: "left" }}
                  />
                </div>
              </div>

              <Button
                asChild
                variant="ghost"
                className="mt-3.5 h-10 w-full justify-between border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
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
          <div className="flex w-max animate-marquee whitespace-nowrap text-[11px] uppercase tracking-widest text-white/55">
            {Array.from({ length: 2 }).map((_, group) => (
              <div className="flex shrink-0 items-center gap-16 px-8" key={group}>
                <span className="shrink-0">Strategy</span>
                <span className="shrink-0">Leadership</span>
                <span className="shrink-0">Management cascade</span>
                <span className="shrink-0">Team execution</span>
                <span className="shrink-0">Capability fit</span>
                <span className="shrink-0">Culture energy</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
