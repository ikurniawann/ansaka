"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, CreditCard, LogOut, Send, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ensureUserProfile } from "@/lib/profiles";
import { supabase, type UserProfile } from "@/lib/supabase-client";

type DashboardState = {
  profile: UserProfile | null;
  organizationName: string | null;
  batchCount: number;
  responseCount: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<DashboardState>({
    profile: null,
    organizationName: null,
    batchCount: 0,
    responseCount: 0,
  });

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      setError(null);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        setError(sessionError.message);
        setIsLoading(false);
        return;
      }

      if (!session) {
        router.replace("/login");
        return;
      }

      const profile = await ensureUserProfile(session.user);

      if (!profile) {
        setError("Profile workspace belum tersedia untuk akun ini.");
        setIsLoading(false);
        return;
      }

      const orgPromise = profile.organization_id
        ? supabase
            .from("organizations")
            .select("name")
            .eq("id", profile.organization_id)
            .single()
        : Promise.resolve({ data: null, error: null });

      const batchPromise = profile.organization_id
        ? supabase
            .from("survey_batches")
            .select("id", { count: "exact", head: true })
            .eq("organization_id", profile.organization_id)
        : Promise.resolve({ count: 0, error: null });

      const responsePromise = supabase
        .from("survey_responses")
        .select("id", { count: "exact", head: true });

      const [orgResult, batchResult, responseResult] = await Promise.all([
        orgPromise,
        batchPromise,
        responsePromise,
      ]);

      if (!mounted) return;

      setState({
        profile,
        organizationName: orgResult.data?.name ?? null,
        batchCount: batchResult.count ?? 0,
        responseCount: responseResult.count ?? 0,
      });
      setIsLoading(false);
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-4 text-foreground">
        <div className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-ink-soft">
          <div className="mx-auto mb-5 size-10 animate-pulse rounded-full bg-primary" />
          <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
            Loading workspace
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-4 text-foreground">
        <div className="max-w-lg rounded-[2rem] border border-destructive/30 bg-card p-8 shadow-ink-soft">
          <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
            Dashboard error
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em]">
            Tidak bisa memuat workspace.
          </h1>
          <p className="mt-4 text-muted-foreground">{error}</p>
          <Button asChild className="mt-6">
            <Link href="/login">Back to login</Link>
          </Button>
        </div>
      </main>
    );
  }

  const profile = state.profile;

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-border bg-card/80 p-5 shadow-ink-soft backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Home
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button onClick={handleLogout} variant="default">
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </header>

        <section className="grid gap-8 py-16 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Diagnostic workspace
            </p>
            <h1 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-7xl">
              Welcome, {profile?.full_name || profile?.email || "Admin"}.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Workspace ini sudah terhubung ke Supabase Auth. Dari sini nanti
              kita bisa lanjutkan fitur batch survey, link assessment, dan
              dashboard hasil agregat.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Building2,
                label: "Organization",
                value: state.organizationName || "Not assigned",
              },
              {
                icon: CreditCard,
                label: "Credit balance",
                value: `${profile?.credit_balance ?? 0}`,
              },
              {
                icon: Send,
                label: "Survey batches",
                value: `${state.batchCount}`,
              },
              {
                icon: UsersRound,
                label: "Responses",
                value: `${state.responseCount}`,
              },
            ].map((item) => (
              <div
                className="min-h-48 rounded-[1.5rem] border border-border bg-card p-6"
                key={item.label}
              >
                <div className="grid size-11 place-items-center rounded-full bg-foreground text-background">
                  <item.icon className="size-5" />
                </div>
                <div className="mt-8 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {item.label}
                </div>
                <div className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
