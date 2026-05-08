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
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card">
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="grid size-8 place-items-center rounded-full bg-primary">
            <Shield className="size-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">ANSAKA Admin</p>
            <p className="text-xs text-muted-foreground">Super Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
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
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}

          <Separator className="my-2" />
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-[0.875rem] px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Building2 className="size-4" />
            Ke Dashboard
          </Link>
        </nav>

        <div className="border-t border-border p-3">
          <div className="flex gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="flex-1 justify-start gap-2 rounded-[0.875rem] text-muted-foreground"
            >
              <LogOut className="size-4" />
              <span className="text-xs">Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      <main className="ml-64 flex-1 min-h-screen">{children}</main>
    </div>
  );
}
