"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Building2,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { supabase, type UserProfile } from "@/lib/supabase-client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard",         label: "Overview",  icon: LayoutDashboard },
  { href: "/dashboard/batches", label: "Batches",   icon: BarChart3 },
  { href: "/dashboard/credits", label: "Credits",   icon: CreditCard },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orgName, setOrgName] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace("/login"); return; }
      const { data: p } = await supabase
        .from("users")
        .select("id, organization_id, role, full_name, email, credit_balance")
        .eq("id", session.user.id)
        .single();
      if (!p) { router.replace("/login"); return; }
      setProfile(p as UserProfile);
      if (p.organization_id) {
        const { data: org } = await supabase
          .from("organizations")
          .select("name")
          .eq("id", p.organization_id)
          .single();
        setOrgName(org?.name ?? null);
      }
    });
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar — always dark */}
      <aside className="dark fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-slate-900">
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
          <div className="grid size-8 place-items-center rounded-full bg-sky-400">
            <Building2 className="size-4 text-slate-900" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-white">ANSAKA</p>
            <p className="text-xs text-slate-400">OAM Insight</p>
          </div>
        </div>

        {/* Org info */}
        {orgName && (
          <div className="border-b border-white/10 px-6 py-3">
            <p className="text-xs text-slate-400">Workspace</p>
            <p className="truncate text-sm font-medium text-slate-200">{orgName}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 p-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-[0.875rem] px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sky-500/20 text-sky-300"
                    : "text-slate-400 hover:bg-white/8 hover:text-slate-100",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}

          {profile?.role === "super_admin" && (
            <>
              <Separator className="my-2 bg-white/10" />
              <Link
                href="/admin"
                className={cn(
                  "flex items-center gap-3 rounded-[0.875rem] px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname.startsWith("/admin")
                    ? "bg-sky-500/20 text-sky-300"
                    : "text-slate-400 hover:bg-white/8 hover:text-slate-100",
                )}
              >
                <Shield className="size-4" />
                Admin Panel
              </Link>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-3">
          {profile && (
            <div className="mb-2 flex items-center gap-2 rounded-[0.875rem] bg-white/6 px-3 py-2">
              <div className="grid size-7 shrink-0 place-items-center rounded-full bg-sky-500 text-xs font-bold text-white">
                {(profile.full_name ?? profile.email ?? "?")[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-slate-200">{profile.full_name ?? profile.email}</p>
                <p className="text-xs text-slate-400">{profile.credit_balance} credits</p>
              </div>
            </div>
          )}
          <div className="space-y-1.5">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-[0.875rem] px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-white/8 hover:text-slate-100"
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 min-h-screen bg-background">{children}</main>
    </div>
  );
}
