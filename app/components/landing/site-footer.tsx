import Link from "next/link";
import { ArrowUpRight, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";

const navColumns: Array<{
  heading: string;
  links: Array<{ label: string; href: string }>;
}> = [
  {
    heading: "Produk",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Method (OAM)", href: "/#method" },
      { label: "Sample report", href: "/#sample-report" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Case studies", href: "/#cases" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    heading: "Untuk perusahaan",
    links: [
      { label: "Login workspace", href: "/login" },
      { label: "Sign up · 30 credit gratis", href: "/signup" },
      { label: "Book a demo", href: "/#book-demo" },
      { label: "Help center", href: "/help" },
      { label: "Status page", href: "https://status.ansaka.id" },
    ],
  },
  {
    heading: "Perusahaan",
    links: [
      { label: "Tentang ANSAKA", href: "/about" },
      { label: "Karir", href: "/careers" },
      { label: "Blog", href: "/#blog" },
      { label: "Press kit", href: "/press" },
      { label: "Kontak", href: "mailto:hello@ansaka.id" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Data Processing Agreement", href: "/legal/dpa" },
      { label: "Cookie Policy", href: "/legal/cookies" },
      { label: "Refund Policy", href: "/legal/refund" },
      { label: "SLA", href: "/legal/sla" },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_2fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-background text-xs font-semibold text-foreground">
                A
              </span>
              <span className="text-sm font-semibold tracking-[0.28em]">ANSAKA</span>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-7 text-background/70">
              ANSAKA OAM Insight adalah platform diagnostik organisasi premium
              untuk leadership Indonesia. Kami percaya organisasi yang sehat
              dimulai dari kejelasan sistem — bukan dari survey engagement.
            </p>

            <ul className="mt-8 space-y-3 text-sm">
              <li className="flex items-start gap-3 text-background/80">
                <MapPin className="mt-0.5 size-4 shrink-0 text-amber-200" aria-hidden />
                PT Ansaka Indonesia · District 8, SCBD<br />
                Jl. Senopati Raya No. 8B, Jakarta Selatan 12190
              </li>
              <li className="flex items-center gap-3 text-background/80">
                <Mail className="size-4 shrink-0 text-amber-200" aria-hidden />
                <a className="hover:underline" href="mailto:hello@ansaka.id">
                  hello@ansaka.id
                </a>
              </li>
              <li className="flex items-center gap-3 text-background/80">
                <Phone className="size-4 shrink-0 text-amber-200" aria-hidden />
                <a className="hover:underline" href="tel:+62211234567">
                  +62 21 0000-0000
                </a>
              </li>
            </ul>

            <div className="mt-8 flex items-center gap-3">
              {[
                { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/ansaka" },
                { icon: Instagram, label: "Instagram", href: "https://instagram.com/ansaka.id" },
                { icon: Youtube, label: "YouTube", href: "https://youtube.com/@ansaka" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/5 text-background transition-colors hover:bg-white/15"
                >
                  <s.icon className="size-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {navColumns.map((col) => (
              <nav key={col.heading} aria-label={col.heading}>
                <div className="text-xs uppercase tracking-[0.22em] text-background/55">
                  {col.heading}
                </div>
                <ul className="mt-4 space-y-2.5 text-sm text-background/85">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="inline-flex items-center gap-1 transition-colors hover:text-amber-200"
                      >
                        {l.label}
                        {l.href.startsWith("http") ? (
                          <ArrowUpRight className="size-3" aria-hidden />
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-3 border-t border-white/10 pt-8 text-xs text-background/55 sm:flex sm:items-center sm:justify-between">
          <span>
            © {year} PT Ansaka Indonesia · NPWP 00.000.000.0-000.000 · Terdaftar di
            Kemenkumham
          </span>
          <span className="flex flex-wrap items-center gap-3">
            <span>Made in Jakarta</span>
            <span aria-hidden>·</span>
            <span>Hosted in 🇮🇩 Jakarta region</span>
            <span aria-hidden>·</span>
            <span>UU PDP &amp; GDPR ready</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
