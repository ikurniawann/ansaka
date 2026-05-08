"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-8 w-full rounded-[0.875rem] bg-white/6" />;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex w-full rounded-[0.875rem] bg-white/8 p-0.5">
      <button
        onClick={() => setTheme("light")}
        className={[
          "flex flex-1 items-center justify-center gap-1.5 rounded-[0.75rem] px-2 py-1.5 text-xs font-medium transition-all",
          !isDark
            ? "bg-white text-slate-800 shadow-sm"
            : "text-slate-400 hover:text-slate-200",
        ].join(" ")}
      >
        <Sun className="size-3" />
        Light
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={[
          "flex flex-1 items-center justify-center gap-1.5 rounded-[0.75rem] px-2 py-1.5 text-xs font-medium transition-all",
          isDark
            ? "bg-white/15 text-white shadow-sm"
            : "text-slate-400 hover:text-slate-200",
        ].join(" ")}
      >
        <Moon className="size-3" />
        Night
      </button>
    </div>
  );
}
