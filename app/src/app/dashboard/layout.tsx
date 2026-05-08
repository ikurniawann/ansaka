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
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card">
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="grid size-8 place-items-center rounded-full bg-primary">
            <Building2 className="size-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">ANSAKA</p>
            <p className="text-xs text-muted-foreground">OAM Insight</p>
          </div>
        </div>

        {/* Org info */}
        {orgName && (
          <div className="border-b border-border px-6 py-3">
            <p className="text-xs text-muted-foreground">Workspace</p>
            <p className="truncate text-sm font-medium">{orgName}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
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
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}

          {profile?.role === "super_admin" && (
            <>
              <Separator className="my-2" />
              <Link
                href="/admin"
                className={cn(
                  "flex items-center gap-3 rounded-[0.875rem] px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname.startsWith("/admin")
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Shield className="size-4" />
                Admin Panel
              </Link>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-3">
          {profile && (
            <div className="mb-2 flex items-center gap-2 rounded-[0.875rem] bg-muted/50 px-3 py-2">
              <div className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {(profile.full_name ?? profile.email ?? "?")[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{profile.full_name ?? profile.email}</p>
                <p className="text-xs text-muted-foreground">{profile.credit_balance} credits</p>
              </div>
            </div>
          )}
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

      {/* Main */}
      <main className="ml-64 flex-1 min-h-screen">{children}</main>
    </div>
  );
}
