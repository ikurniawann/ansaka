import { cn } from "@/lib/utils";

export function BackgroundBeams({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="absolute left-1/2 top-[-20%] h-[64rem] w-[64rem] -translate-x-1/2 rounded-full border border-sky-300/15 dark:border-sky-200/10" />
      <div className="absolute left-[12%] top-1/4 h-px w-[72rem] -rotate-12 bg-gradient-to-r from-transparent via-cyan-200/35 to-transparent" />
      <div className="absolute right-[-10%] top-1/3 h-px w-[58rem] rotate-[18deg] bg-gradient-to-r from-transparent via-amber-200/30 to-transparent" />
      <div className="absolute bottom-1/4 left-[-8%] h-px w-[42rem] rotate-12 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(125,211,252,0.18),transparent_28%),radial-gradient(circle_at_82%_24%,rgba(244,202,137,0.16),transparent_25%),radial-gradient(circle_at_48%_80%,rgba(203,213,225,0.14),transparent_26%)]" />
    </div>
  );
}
