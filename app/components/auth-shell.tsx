 "use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Building2, LockKeyhole, Mail, UserRound } from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { ensureUserProfile } from "@/lib/profiles";
import { supabase } from "@/lib/supabase-client";

type AuthShellProps = {
  mode: "login" | "signup";
};

const copy = {
  login: {
    eyebrow: "Secure workspace login",
    title: "Masuk ke ANSAKA diagnostic portal.",
    body: "Gunakan akun corporate admin untuk membuat batch survey, memonitor response, dan membaca hasil diagnostik organisasi.",
    submit: "Login to dashboard",
    switchText: "Belum punya workspace?",
    switchAction: "Create account",
    switchHref: "/signup",
  },
  signup: {
    eyebrow: "Create organization workspace",
    title: "Mulai workspace diagnostik organisasi.",
    body: "Daftarkan perusahaan dan admin pertama. Setelah akun aktif, kamu bisa membuat survey batch dan membagikan link assessment.",
    submit: "Create workspace",
    switchText: "Sudah punya akun?",
    switchAction: "Login",
    switchHref: "/login",
  },
};

function getErrorMessage(caught: unknown) {
  if (caught instanceof Error) return caught.message;

  if (caught && typeof caught === "object") {
    const maybeError = caught as { message?: unknown; error_description?: unknown; details?: unknown };
    if (typeof maybeError.message === "string") return maybeError.message;
    if (typeof maybeError.error_description === "string") return maybeError.error_description;
    if (typeof maybeError.details === "string") return maybeError.details;
  }

  return "Terjadi kesalahan. Coba ulang beberapa saat lagi.";
}

export function AuthShell({ mode }: AuthShellProps) {
  const content = copy[mode];
  const isSignup = mode === "signup";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    if (isSignup && !organizationName.trim()) {
      setError("Nama organisasi wajib diisi.");
      return;
    }

    if (isSignup && !agreed) {
      setError("Centang persetujuan workspace terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSignup) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              organization_name: organizationName.trim(),
              role: "corporate_admin",
            },
          },
        });

        if (signUpError) throw signUpError;

        if (!data.session || !data.user) {
          setMessage("Akun dibuat. Cek email untuk konfirmasi sebelum login.");
          return;
        }

        await ensureUserProfile(data.user);

        router.push("/dashboard");
        router.refresh();
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      if (data.user) await ensureUserProfile(data.user);

      router.push("/dashboard");
      router.refresh();
    } catch (caught) {
      setError(getErrorMessage(caught));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(125,211,252,0.20),transparent_28%),radial-gradient(circle_at_84%_20%,rgba(244,202,137,0.18),transparent_24%),linear-gradient(140deg,hsl(var(--background)),hsl(var(--muted)))]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
      </div>

      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-28 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div>
          <Button asChild variant="ghost" className="mb-10">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Back to home
            </Link>
          </Button>

          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {content.eyebrow}
          </p>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[0.92] tracking-[-0.065em] sm:text-7xl lg:text-8xl">
            {content.title}
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground">
            {content.body}
          </p>

          <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
            {["RLS protected", "Batch survey", "Aggregate insight"].map((item) => (
              <div className="rounded-[1.25rem] border border-border bg-card/70 p-4" key={item}>
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Portal
                </div>
                <div className="mt-4 text-sm font-medium">{item}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-card/80 p-4 shadow-ink-soft backdrop-blur-2xl sm:p-7 lg:min-w-[600px]">
          <div className="rounded-[1.5rem] border border-border bg-background/65 p-6 sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  {isSignup ? "Sign up" : "Login"}
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
                  {isSignup ? "Create your account" : "Welcome back"}
                </h2>
              </div>
              <div className="grid size-12 place-items-center rounded-full bg-foreground text-background">
                {isSignup ? <UserRound className="size-5" /> : <LockKeyhole className="size-5" />}
              </div>
            </div>

            <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
              {isSignup ? (
                <label className="block">
                  <span className="text-base font-medium text-muted-foreground">
                    Organization name
                  </span>
                  <div className="mt-3 flex min-h-14 items-center gap-3 rounded-full border border-border/70 bg-background px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors focus-within:border-primary/70 focus-within:ring-2 focus-within:ring-primary/20">
                    <Building2 className="size-5 shrink-0 text-muted-foreground" />
                    <input
                      className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
                      onChange={(event) => setOrganizationName(event.target.value)}
                      placeholder="PT Ansaka Indonesia"
                      type="text"
                      value={organizationName}
                    />
                  </div>
                </label>
              ) : null}

              <label className="block">
                <span className="text-base font-medium text-muted-foreground">
                  Work email
                </span>
                <div className="mt-3 flex min-h-14 items-center gap-3 rounded-full border border-border/70 bg-background px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors focus-within:border-primary/70 focus-within:ring-2 focus-within:ring-primary/20">
                  <Mail className="size-5 shrink-0 text-muted-foreground" />
                  <input
                    className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    type="email"
                    value={email}
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-base font-medium text-muted-foreground">
                  Password
                </span>
                <div className="mt-3 flex min-h-14 items-center gap-3 rounded-full border border-border/70 bg-background px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors focus-within:border-primary/70 focus-within:ring-2 focus-within:ring-primary/20">
                  <LockKeyhole className="size-5 shrink-0 text-muted-foreground" />
                  <input
                    className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimum 8 characters"
                    type="password"
                    value={password}
                  />
                </div>
              </label>

              {isSignup ? (
                <label className="flex gap-4 rounded-[1.25rem] border border-border bg-muted/40 p-5 text-base leading-7 text-muted-foreground">
                  <input
                    checked={agreed}
                    className="mt-1 size-5 accent-foreground"
                    onChange={(event) => setAgreed(event.target.checked)}
                    type="checkbox"
                  />
                  I agree to create an ANSAKA workspace for my organization and receive onboarding instructions.
                </label>
              ) : (
                <div className="flex items-center justify-between text-base text-muted-foreground">
                  <label className="flex items-center gap-3">
                    <input className="size-5 accent-foreground" type="checkbox" />
                    Remember me
                  </label>
                  <a className="font-medium text-foreground hover:underline" href="mailto:support@ansaka.id">
                    Forgot password?
                  </a>
                </div>
              )}

              {error ? (
                <div className="rounded-[1.25rem] border border-destructive/30 bg-destructive/10 p-4 text-sm leading-6 text-destructive">
                  {error}
                </div>
              ) : null}

              {message ? (
                <div className="rounded-[1.25rem] border border-primary/30 bg-primary/10 p-4 text-sm leading-6 text-foreground">
                  {message}
                </div>
              ) : null}

              <Button
                className="h-12 w-full justify-between px-5 text-base"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Processing..." : content.submit}
                <ArrowRight className="size-4" />
              </Button>
            </form>

            <div className="mt-8 flex flex-col gap-3 border-t border-border pt-7 text-base text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>{content.switchText}</span>
              <Link className="font-medium text-foreground hover:underline" href={content.switchHref}>
                {content.switchAction}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
