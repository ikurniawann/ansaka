"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-9 min-w-[116px] rounded-full border border-border bg-muted",
          className,
        )}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={cn(
        "inline-flex min-w-[116px] rounded-full border border-border/80 bg-muted/80 p-0.5 text-muted-foreground dark:border-white/10 dark:bg-white/10",
        className,
      )}
    >
      <button
        onClick={() => setTheme("light")}
        className={[
          "flex flex-1 items-center justify-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-all",
          !isDark
            ? "bg-foreground text-background shadow-sm"
            : "hover:text-foreground",
        ].join(" ")}
      >
        <Sun className="size-3" />
        Light
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={[
          "flex flex-1 items-center justify-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-all",
          isDark
            ? "bg-foreground text-background shadow-sm"
            : "hover:text-foreground",
        ].join(" ")}
      >
        <Moon className="size-3" />
        Night
      </button>
    </div>
  );
}
