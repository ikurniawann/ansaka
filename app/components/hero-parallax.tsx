"use client";

import {
  motion,
  type MotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, LogIn, Play, Sparkles, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { TextReveal } from "@/components/aceternity/text-reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const heroImage =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2400&q=85";

const metrics = [
  ["12", "organizational drivers"],
  ["27", "failure point signals"],
  ["5", "execution layers"],
];

const floatingCards = [
  {
    title: "Strategic clarity",
    value: "84%",
    body: "Signals converging across leadership and cascade rituals.",
    className: "right-[30%] bottom-[18%] hidden 2xl:block",
    depth: 0.4,
  },
  {
    title: "Priority heatmap",
    value: "D7",
    body: "Decision friction detected before rollout stalls.",
    className: "right-[7%] top-[34%] hidden 2xl:block",
    depth: -0.6,
  },
  {
    title: "Culture pulse",
    value: "3.42",
    body: "Stable baseline, but adoption energy needs focus.",
    className: "right-[9%] bottom-[20%] hidden min-[1800px]:block",
    depth: 0.8,
  },
];

function FloatingSignal({
  title,
  value,
  body,
  className,
  y,
}: {
  title: string;
  value: string;
  body: string;
  className?: string;
  y: MotionValue<string>;
}) {
  return (
    <motion.div
      className={cn(
        "absolute z-20 w-56 rounded-[1.5rem] border border-white/20 bg-black/30 p-4 text-white shadow-ink-soft backdrop-blur-2xl",
        className,
      )}
      style={{ y }}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="text-[10px] uppercase tracking-[0.28em] text-white/60">
          {title}
        </div>
        <div className="rounded-full border border-white/15 px-2 py-1 font-mono text-[10px] text-white/70">
          live
        </div>
      </div>
      <div className="mt-4 text-4xl font-semibold tracking-[-0.05em]">
        {value}
      </div>
      <p className="mt-3 text-sm leading-5 text-white/70">{body}</p>
    </motion.div>
  );
}

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

  const imageY = useTransform(smoothProgress, [0, 1], ["0%", "18%"]);
  const imageScale = useTransform(smoothProgress, [0, 1], [1.08, 1.18]);
  const contentY = useTransform(smoothProgress, [0, 1], ["0%", "-22%"]);
  const opacity = useTransform(smoothProgress, [0, 0.72], [1, 0]);
  const ringY = useTransform(smoothProgress, [0, 1], ["0%", "-48%"]);
  const slowY = useTransform(smoothProgress, [0, 1], ["0%", "-26%"]);
  const reverseY = useTransform(smoothProgress, [0, 1], ["0%", "34%"]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[140vh] overflow-hidden bg-background text-foreground"
    >
      <div className="sticky top-0 min-h-screen overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ y: imageY, scale: imageScale }}
        >
          <div
            className="absolute inset-[-6%] bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,10,0.92),rgba(5,7,10,0.55)_43%,rgba(5,7,10,0.18)),linear-gradient(180deg,rgba(5,7,10,0.15),rgba(5,7,10,0.92))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,transparent_0,rgba(0,0,0,0.52)_72%)]" />
        </motion.div>

        <BackgroundBeams />

        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-[18%] size-[38rem] -translate-x-1/2 rounded-full border border-white/10"
          style={{ y: ringY }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute left-[9%] top-[18%] h-40 w-24 rounded-full border border-white/20 bg-white/10 blur-[0.2px]"
          style={{ y: slowY }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute bottom-[18%] right-[8%] h-28 w-28 rounded-[2rem] border border-white/15 bg-white/10 rotate-12 backdrop-blur-md"
          style={{ y: reverseY }}
        />

        <div className="relative z-10 flex min-h-screen items-end px-4 pb-14 pt-28 sm:px-6 lg:px-8 xl:pb-16">
          <motion.div
            className="mx-auto grid w-full max-w-7xl gap-8 xl:grid-cols-[minmax(0,0.95fr)_360px] xl:items-end 2xl:grid-cols-[minmax(0,0.9fr)_390px]"
            style={{ y: contentY, opacity }}
          >
            <div className="relative z-30 max-w-4xl">
              <motion.div
                className="mb-6 flex w-fit items-center gap-3 rounded-full border border-white/15 bg-black/25 px-3 py-2 text-[11px] uppercase tracking-[0.28em] text-white/75 backdrop-blur-2xl"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <span className="size-2 rounded-full bg-cyan-200 shadow-[0_0_22px_rgba(103,232,249,0.9)]" />
                Executive alignment map
              </motion.div>

              <motion.div
                className="mb-7 flex w-fit items-center gap-2 rounded-full border border-amber-200/50 bg-amber-200/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100 backdrop-blur-2xl"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.18, ease: "easeOut" }}
              >
                <Sparkles className="size-3.5" aria-hidden />
                <span>
                  <span className="text-amber-200">Promo workspace baru:</span>{" "}
                  30 credit gratis · 30 link survey
                </span>
              </motion.div>

              <h1 className="max-w-4xl text-balance text-[clamp(3.8rem,8.8vw,9.5rem)] font-semibold leading-[0.82] tracking-[-0.07em] text-white md:max-w-5xl">
                <TextReveal delay={0.08}>Diagnose the hidden system</TextReveal>
              </h1>

              <motion.div
                className="mt-7 grid max-w-4xl gap-6 lg:grid-cols-[minmax(0,1fr)_auto]"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.55, ease: "easeOut" }}
              >
                <p className="max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                  ANSAKA turns leadership noise, execution drag, and culture
                  signals into one crisp organizational map before growth gets
                  expensive.
                </p>
                <div className="flex flex-wrap items-center gap-3 self-end">
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
                </div>
              </motion.div>

              <motion.div
                className="mt-4 flex flex-wrap items-center gap-3"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.72, ease: "easeOut" }}
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

            <motion.div
              className="relative z-30 hidden rounded-[1.75rem] border border-white/15 bg-black/30 p-4 text-white shadow-ink-soft backdrop-blur-2xl xl:block"
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, delay: 0.62, ease: "easeOut" }}
            >
              <div className="grid gap-2">
                {metrics.map(([value, label]) => (
                  <div
                    className="grid grid-cols-[72px_1fr] items-center gap-4 rounded-[1.15rem] border border-white/10 bg-white/[0.06] p-4"
                    key={label}
                  >
                    <div className="text-4xl font-semibold tracking-[-0.06em]">
                      {value}
                    </div>
                    <div className="text-[11px] uppercase leading-4 tracking-[0.18em] text-white/60">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-white/[0.06] p-4">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-white/55">
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
            </motion.div>
          </motion.div>
        </div>

        {floatingCards.map((card) => (
          <FloatingSignal
            body={card.body}
            className={card.className}
            key={card.title}
            title={card.title}
            value={card.value}
            y={card.depth > 0 ? slowY : reverseY}
          />
        ))}

        <div className="absolute bottom-0 left-0 right-0 z-10 border-y border-white/10 bg-black/25 py-3 text-white backdrop-blur-xl">
          <div className="flex animate-marquee whitespace-nowrap text-[11px] uppercase tracking-[0.32em] text-white/54">
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
