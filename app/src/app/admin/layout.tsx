"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3, BookOpen, Building2, CreditCard, FileText,
  Layers, LogOut, Shield, Users,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { supabase } from "@/lib/supabase-client";
import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin",             label: "Overview",       icon: BarChart3  },
  { href: "/admin/users",       label: "Users",          icon: Users      },
  { href: "/admin/credits",     label: "Credits",        icon: CreditCard },
  { href: "/admin/pricing",     label: "Pricing Tiers",  icon: Layers     },
  { href: "/admin/formulas",    label: "OAM Formulas",   icon: FileText   },
  { href: "/admin/cms",         label: "CMS",            icon: BookOpen   },
  { href: "/admin/benchmarks",  label: "Benchmarks",     icon: BarChart3  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/login"); return; }
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();
      if (profile?.role !== "super_admin") { router.replace("/dashboard"); return; }
      setChecking(false);
    })();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (checking) return null;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar — always dark */}
      <aside className="dark fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-slate-900">
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
          <div className="grid size-8 place-items-center rounded-full bg-amber-400">
            <Shield className="size-4 text-slate-900" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-white">ANSAKA Admin</p>
            <p className="text-xs text-slate-400">Super Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 p-3">
          {adminNav.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-[0.875rem] px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-amber-500/20 text-amber-300"
                    : "text-slate-400 hover:bg-white/8 hover:text-slate-100",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}

          <Separator className="my-2 bg-white/10" />
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-[0.875rem] px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/8 hover:text-slate-100 transition-colors"
          >
            <Building2 className="size-4" />
            Ke Dashboard
          </Link>
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="flex gap-1">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex flex-1 items-center gap-2 rounded-[0.875rem] px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-white/8 hover:text-slate-100"
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="ml-64 flex-1 min-h-screen bg-background">{children}</main>
    </div>
  );
}
