"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

export function TextReveal({
  children,
  className,
  delay = 0,
}: {
  children: string;
  className?: string;
  delay?: number;
}) {
  const words = children.split(" ");
  const reduce = useReducedMotion();

  // If the user prefers reduced motion (or framer-motion fails to fire `animate`
  // in dev/strict-mode), we render words at their resting position immediately
  // so the headline is never invisible.
  if (reduce) {
    return <span className={cn("inline-flex flex-wrap", className)}>{children}</span>;
  }

  return (
    <span className={cn("inline-flex flex-wrap", className)}>
      {words.map((word, index) => (
        <span
          className="mr-[0.22em] overflow-hidden pb-[0.04em]"
          key={`${word}-${index}`}
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "105%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{
              duration: 0.9,
              delay: delay + index * 0.045,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
