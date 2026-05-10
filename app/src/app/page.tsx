"use client";

import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  LogIn,
  UserPlus,
  CheckCircle,
  FileText,
  BarChart3,
  Mail,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Users,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import { HeroParallax } from "@/components/hero-parallax";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

// FAQ Item Component
function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <button
        className="flex w-full items-center justify-between py-6 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-foreground">{question}</span>
        {isOpen ? (
          <ChevronUp className="size-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-5 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="pb-6 text-base leading-7 text-muted-foreground">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    size: "",
    industry: "",
  });

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <SiteHeader />
      <HeroParallax />

      {/* Free 30 Credits Banner */}
      <div className="relative z-30 bg-gradient-to-r from-green-600 to-emerald-500 px-4 py-4 text-center text-white">
        <p className="text-sm font-medium sm:text-base">
          🎉 Pendaftaran Baru! Dapatkan <strong>30 FREE Credits</strong> untuk
          mencoba platform kami - Tanpa kartu kredit diperlukan!
        </p>
      </div>

      <section
        id="insight"
        className="relative z-20 border-t border-border bg-background px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              First section placeholder
            </p>
            <h2 className="mt-5 max-w-xl text-5xl font-semibold tracking-[-0.06em] text-foreground sm:text-7xl">
              Built to expose the operating system behind performance.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Find the leadership signals that are slowing execution.",
              "Turn survey noise into structured failure point intelligence.",
              "Map what the organization says against what the system rewards.",
              "Prioritize interventions before culture debt compounds.",
            ].map((item, index) => (
              <div
                className="min-h-44 rounded-[1.5rem] border border-border bg-card p-6"
                key={item}
              >
                <div className="font-mono text-sm text-muted-foreground">
                  0{index + 1}
                </div>
                <p className="mt-8 text-xl leading-7 text-card-foreground">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="relative z-20 border-t border-border bg-background px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Simple Process
            </p>
            <h2 className="mt-5 text-5xl font-semibold tracking-[-0.06em] text-foreground sm:text-7xl">
              Bagaimana Cara Kerjanya?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Empat langkah mudah untuk mendapatkan insight mendalam tentang
              organisasi Anda
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                icon: FileText,
                title: "Beli Credit",
                desc: "Pilih paket credit yang sesuai dengan kebutuhan survei Anda",
              },
              {
                step: "02",
                icon: Users,
                title: "Buat Batch",
                desc: "Setup survei dengan menentukan responden dan parameter",
              },
              {
                step: "03",
                icon: Mail,
                title: "Kirim Survei",
                desc: "Distribusikan survei ke responden melalui email atau link",
              },
              {
                step: "04",
                icon: BarChart3,
                title: "Lihat Report",
                desc: "Analisa hasil dengan dashboard interaktif dan export PDF",
              },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                {index < 3 && (
                  <div className="absolute left-1/2 top-12 hidden h-0.5 w-full -translate-x-1/2 bg-gradient-to-r from-green-600/50 to-transparent lg:block" />
                )}
                <div className="relative flex flex-col items-center text-center">
                  <div className="flex size-24 items-center justify-center rounded-full border-2 border-green-600 bg-white shadow-lg">
                    <item.icon className="size-10 text-green-600" />
                  </div>
                  <div className="mt-6">
                    <p className="text-sm font-bold text-green-600">
                      STEP {item.step}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OAM Methodology Section */}
      <section className="border-t border-border bg-background px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Our Framework
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-6xl">
              Metodologi OAM (Organizational Assessment Matrix)
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Framework komprehensif yang dikembangkan berdasarkan riset
              organisasi selama lebih dari 10 tahun. OAM mengukur 12 driver
              kunci performa organisasi.
            </p>

            <div className="mt-8 space-y-6">
              {[
                {
                  title: "Leadership & Strategy",
                  desc: "Mengukur efektivitas kepemimpinan dan kejelasan arah strategis",
                },
                {
                  title: "Culture & Engagement",
                  desc: "Menilai budaya kerja dan tingkat keterlibatan karyawan",
                },
                {
                  title: "Operations & Execution",
                  desc: "Menganalisis efisiensi operasional dan kemampuan eksekusi",
                },
                {
                  title: "Innovation & Adaptability",
                  desc: "Mengukur kapasitas inovasi dan adaptasi terhadap perubahan",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                    <CheckCircle className="size-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Button variant="outline" asChild>
                <a href="/whitepaper.pdf" target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 size-4" />
                  Download Whitepaper
                </a>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-[2rem] border border-border bg-gradient-to-br from-green-50 to-emerald-100 p-8">
              {/* Placeholder for OAM Framework Visualization */}
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="mx-auto size-24 text-green-600" />
                  <p className="mt-4 text-lg font-medium text-foreground">
                    12 Drivers Assessment
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Comprehensive organizational diagnostic
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="border-t border-border bg-muted/30 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Case Studies
            </p>
            <h2 className="mt-5 text-5xl font-semibold tracking-[-0.06em] text-foreground sm:text-7xl">
              Hasil Nyata di Lapangan
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Lihat bagaimana perusahaan-perusahaan ini bertransformasi dengan
              ANSAKA
            </p>
          </div>

          <div className="mt-16 space-y-12">
            {[
              {
                company: "PT Teknologi Maju",
                industry: "Software Development",
                employees: "250 karyawan",
                challenge:
                  "Turnover rate tinggi (35%) dan penurunan produktivitas tim engineering",
                solution:
                  "Survei engagement mendalam + workshop leadership untuk 15 manager",
                results: [
                  { metric: "Turnover Rate", before: "35%", after: "12%", improvement: "-66%" },
                  { metric: "Employee Engagement", before: "52%", after: "78%", improvement: "+50%" },
                  { metric: "Productivity Score", before: "6.2/10", after: "8.4/10", improvement: "+35%" },
                ],
              },
              {
                company: "Bank Digital Indonesia",
                industry: "Financial Services",
                employees: "800 karyawan",
                challenge:
                  "Silo mentality antar departemen dan lambatnya decision making",
                solution:
                  "Organization mapping + cross-functional collaboration assessment",
                results: [
                  { metric: "Decision Speed", before: "14 hari", after: "5 hari", improvement: "-64%" },
                  { metric: "Cross-dept Collaboration", before: "4.1/10", after: "7.8/10", improvement: "+90%" },
                  { metric: "Customer Satisfaction", before: "72%", after: "89%", improvement: "+24%" },
                ],
              },
            ].map((study, i) => (
              <div
                key={i}
                className="rounded-[1.5rem] border border-border bg-card p-8 shadow-sm"
              >
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground">
                      {study.company}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {study.industry} • {study.employees}
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Challenge
                    </p>
                    <p className="mt-2 text-base text-foreground">
                      {study.challenge}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Solution
                    </p>
                    <p className="mt-2 text-base text-foreground">
                      {study.solution}
                    </p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-4">
                    <p className="text-sm font-medium text-green-700">
                      Timeframe
                    </p>
                    <p className="mt-2 text-base text-green-900">
                      6 bulan implementasi
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="mb-4 text-sm font-semibold text-foreground">
                    Key Results:
                  </p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {study.results.map((result) => (
                      <div
                        key={result.metric}
                        className="rounded-lg border border-border p-4 text-center"
                      >
                        <p className="text-sm text-muted-foreground">
                          {result.metric}
                        </p>
                        <div className="mt-2 flex items-baseline justify-center gap-2">
                          <span className="text-2xl font-bold text-red-600 line-through">
                            {result.before}
                          </span>
                          <ArrowRight className="size-4 text-muted-foreground" />
                          <span className="text-2xl font-bold text-green-600">
                            {result.after}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-green-600">
                          {result.improvement}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Report / Demo Section */}
      <section className="border-t border-border bg-background px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl">
                {/* Placeholder for Report Preview */}
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                  <div className="text-center p-8">
                    <FileText className="mx-auto size-20 text-green-600" />
                    <p className="mt-4 text-lg font-semibold text-foreground">
                      Sample Report Preview
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Interactive dashboard with actionable insights
                    </p>
                    <div className="mt-6 flex justify-center gap-4">
                      <div className="rounded-lg bg-white p-3 shadow">
                        <BarChart3 className="size-8 text-blue-600" />
                      </div>
                      <div className="rounded-lg bg-white p-3 shadow">
                        <TrendingUp className="size-8 text-green-600" />
                      </div>
                      <div className="rounded-lg bg-white p-3 shadow">
                        <Users className="size-8 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              See It In Action
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-6xl">
              Coba Demo Interaktif
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Lihat langsung seperti apa report yang akan Anda dapatkan. Sample
              report ini menunjukkan insight yang bisa Anda harapkan dari survei
              organisasi.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                "Dashboard interaktif dengan visualisasi data real-time",
                "Breakdown per departemen, tim, dan demografi",
                "Benchmark comparison dengan industri",
                "Priority matrix untuk action planning",
                "Export ke PDF, Excel, atau PowerPoint",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 size-5 shrink-0 text-green-600" />
                  <span className="text-base text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <a href="/sample-report.pdf" target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 size-5" />
                  Download Sample Report (PDF)
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/signup">
                  Coba Gratis Sekarang
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats & Trusted By Section */}
      <section className="border-t border-border bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Trusted By
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.06em] text-foreground">
              Dipercaya oleh Perusahaan Terkemuka
            </h2>
          </div>

          {/* Logo Grid Placeholder */}
          <div className="mt-12 grid grid-cols-2 gap-8 opacity-60 grayscale sm:grid-cols-3 md:grid-cols-6">
            {["Company A", "Company B", "Company C", "Company D", "Company E", "Company F"].map(
              (company) => (
                <div
                  key={company}
                  className="flex items-center justify-center rounded-lg bg-white p-6 shadow-sm"
                >
                  <span className="text-sm font-medium text-muted-foreground">
                    {company}
                  </span>
                </div>
              )
            )}
          </div>

          {/* Statistics */}
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: Building2,
                value: "50+",
                label: "Perusahaan",
              },
              {
                icon: Users,
                value: "10,000+",
                label: "Responden",
              },
              {
                icon: Briefcase,
                value: "15+",
                label: "Industri",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center"
              >
                <stat.icon className="size-8 text-green-600" />
                <p className="mt-4 text-4xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="access"
        className="relative z-20 border-t border-border bg-background px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Access portal
            </p>
            <h2 className="mt-5 max-w-xl text-5xl font-semibold tracking-[-0.06em] text-foreground sm:text-7xl">
              Masuk untuk melihat diagnostic workspace.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
              Corporate admin bisa login untuk membuat batch survey, melihat
              hasil agregat, dan mengelola credit. Akun baru bisa mendaftar
              sebagai organization workspace.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: LogIn,
                title: "Login",
                body: "Masuk ke dashboard organisasi yang sudah aktif.",
                action: "Open login",
              },
              {
                icon: UserPlus,
                title: "Sign up",
                body: "Daftarkan company workspace dan admin pertama.",
                action: "Create account",
              },
              {
                icon: Building2,
                title: "Demo access",
                body: "Minta guided walkthrough sebelum menjalankan survey.",
                action: "Book demo",
              },
            ].map((item) => (
              <Link
                className="group flex min-h-72 flex-col justify-between rounded-[1.5rem] border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-ink-soft"
                href={
                  item.title === "Login"
                    ? "/login"
                    : item.title === "Sign up"
                      ? "/signup"
                      : "#contact"
                }
                key={item.title}
              >
                <div>
                  <div className="grid size-11 place-items-center rounded-full bg-foreground text-background">
                    <item.icon className="size-5" />
                  </div>
                  <h3 className="mt-8 text-2xl font-semibold tracking-[-0.04em] text-card-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.body}
                  </p>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-border pt-5 text-sm font-medium text-card-foreground">
                  {item.action}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="relative z-20 border-t border-border bg-background px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Pricing
            </p>
            <h2 className="mt-5 text-5xl font-semibold tracking-[-0.06em] text-foreground sm:text-7xl">
              Paket Credit yang Fleksibel
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Pilih paket credit sesuai kebutuhan survei Anda
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {[
              {
                name: "Starter",
                credits: "100 Credits",
                price: "Rp 499K",
                desc: "Cocok untuk UMKM dan startup",
                features: [
                  "Hingga 50 responden",
                  "Basic survey templates",
                  "PDF report export",
                  "Email support",
                  "Validitas 3 bulan",
                ],
                popular: false,
              },
              {
                name: "Professional",
                credits: "500 Credits",
                price: "Rp 1.999K",
                desc: "Untuk perusahaan menengah",
                features: [
                  "Hingga 300 responden",
                  "Advanced survey templates",
                  "Custom branding",
                  "Priority email support",
                  "API access",
                  "Validitas 6 bulan",
                ],
                popular: true,
              },
              {
                name: "Enterprise",
                credits: "2000 Credits",
                price: "Rp 7.499K",
                desc: "Solusi lengkap untuk korporat",
                features: [
                  "Unlimited respondents",
                  "White-label solution",
                  "Dedicated account manager",
                  "24/7 phone support",
                  "Full API access",
                  "Custom integrations",
                  "Validitas 12 bulan",
                ],
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-[1.5rem] border p-8 ${
                  plan.popular
                    ? "border-green-600 bg-green-50 shadow-xl"
                    : "border-border bg-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-green-600 px-4 py-1 text-sm font-medium text-white">
                    Most Popular
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-semibold text-foreground">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.desc}
                  </p>
                  <div className="mt-6">
                    <p className="text-4xl font-bold text-foreground">
                      {plan.price}
                    </p>
                    <p className="mt-1 text-sm text-green-600 font-medium">
                      {plan.credits}
                    </p>
                  </div>
                </div>
                <ul className="mt-8 space-y-4 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 size-5 shrink-0 text-green-600" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-8 w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  Pilih Paket
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="border-t border-border bg-muted/30 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Testimonials
            </p>
            <h2 className="mt-5 text-5xl font-semibold tracking-[-0.06em] text-foreground sm:text-7xl">
              Apa Kata Mereka?
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                quote:
                  "ANSAKA membantu kami mengidentifikasi bottleneck dalam organisasi yang selama ini tidak terlihat. Hasil surveinya sangat actionable.",
                name: "Sarah Wijaya",
                title: "HR Director",
                company: "PT Tech Indonesia",
              },
              {
                quote:
                  "Platform yang user-friendly dengan insight yang mendalam. Tim ANSAKA sangat responsif dan membantu setiap langkah.",
                name: "Budi Santoso",
                title: "CEO",
                company: "Startup Unicorn",
              },
              {
                quote:
                  "Investasi terbaik untuk development organisasi kami. Survey yang komprehensif dengan report yang mudah dipahami.",
                name: "Diana Kusuma",
                title: "People Operations Lead",
                company: "Multinational Corp",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="rounded-[1.5rem] border border-border bg-card p-8"
              >
                <div className="mb-6 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="size-5 fill-yellow-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-base leading-7 text-foreground">
                  "{testimonial.quote}"
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="size-12 rounded-full bg-gradient-to-br from-green-600 to-emerald-500" />
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.title}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="relative z-20 border-t border-border bg-background px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              FAQ
            </p>
            <h2 className="mt-5 text-5xl font-semibold tracking-[-0.06em] text-foreground sm:text-7xl">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>

          <div className="mt-12">
            <FAQItem
              question="Bagaimana cara kerja credit system?"
              answer="Setiap kredit mewakili satu respon survei yang valid. Ketika Anda mengirim survei, kredit akan dipotong sesuai jumlah responden yang menyelesaikan survei. Kredit tidak hangus jika responden tidak menyelesaikan survei."
            />
            <FAQItem
              question="Apakah data responden aman dan anonim?"
              answer="Ya, keamanan dan anonimitas data adalah prioritas kami. Semua data dienkripsi end-to-end, dan identitas responden tidak akan pernah terungkap dalam report kecuali mereka secara eksplisit mengizinkan."
            />
            <FAQItem
              question="Berapa lama durasi survei yang direkomendasikan?"
              answer="Untuk tingkat partisipasi optimal, kami merekomendasikan survei yang dapat diselesaikan dalam 10-15 menit. Namun, platform kami mendukung survei dari 5 menit hingga 45 menit tergantung kebutuhan."
            />
            <FAQItem
              question="Bisakah saya customize template survei?"
              answer="Tentu! Semua paket termasuk akses ke template yang bisa dikustomisasi. Paket Professional dan Enterprise juga memungkinkan pembuatan template dari nol dengan custom branding."
            />
            <FAQItem
              question="Apa saja format report yang tersedia?"
              answer="Kami menyediakan report dalam format PDF interaktif, Excel/CSV untuk analisis lebih lanjut, dan dashboard online yang bisa diakses kapan saja. Paket Enterprise termasuk custom report format."
            />
            <FAQItem
              question="Bagaimana jika responden mengalami kendala teknis?"
              answer="Tim support kami siap membantu 24/7 untuk paket Enterprise, dan pada jam kerja untuk paket lainnya. Responden juga bisa menghubungi support langsung melalui link yang tersedia di survei."
            />
            <FAQItem
              question="Apakah ada minimum pembelian credit?"
              answer="Tidak ada minimum pembelian. Anda bisa mulai dengan paket Starter 100 credits. Credit berlaku hingga masa validitas paket Anda berakhir."
            />
            <FAQItem
              question="Bisakah credit diperpanjang setelah expired?"
              answer="Credit yang sudah expired tidak dapat diperpanjang, namun Anda dapat membeli paket baru kapan saja. Kami akan mengirimkan reminder sebelum credit mendekati masa expired."
            />
            <FAQItem
              question="Apakah ANSAKA mendukung multi-bahasa?"
              answer="Ya, platform kami mendukung survei dalam Bahasa Indonesia dan Inggris. Untuk paket Enterprise, kami bisa menambahkan bahasa lain sesuai kebutuhan."
            />
            <FAQItem
              question="Bagaimana cara mendapatkan invoice untuk pembayaran?"
              answer="Invoice otomatis akan dikirim ke email admin setelah pembayaran berhasil. Invoice mencakup detail transaksi dan dapat digunakan untuk keperluan pembukuan perusahaan."
            />
          </div>
        </div>
      </section>

      {/* Book a Call / Demo Form Section */}
      <section
        id="demo"
        className="border-t border-border bg-muted/30 px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Get Started
            </p>
            <h2 className="mt-5 text-5xl font-semibold tracking-[-0.06em] text-foreground sm:text-7xl">
              Book a Demo
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Jadwalkan demo gratis dan dapatkan 30 credits untuk mencoba
              platform kami
            </p>
          </div>

          <div className="mt-12 rounded-[1.5rem] border border-border bg-card p-8 shadow-lg sm:p-12">
            <form className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    Email Kerja
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">
                  Nama Perusahaan
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                  placeholder="PT Company Name"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    Ukuran Perusahaan
                  </label>
                  <select
                    value={formData.size}
                    onChange={(e) =>
                      setFormData({ ...formData, size: e.target.value })
                    }
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                  >
                    <option value="">Pilih ukuran</option>
                    <option value="1-50">1-50 karyawan</option>
                    <option value="51-200">51-200 karyawan</option>
                    <option value="201-500">201-500 karyawan</option>
                    <option value="501-1000">501-1000 karyawan</option>
                    <option value="1000+">1000+ karyawan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    Industri
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) =>
                      setFormData({ ...formData, industry: e.target.value })
                    }
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
                  >
                    <option value="">Pilih industri</option>
                    <option value="technology">Teknologi / Software</option>
                    <option value="finance">Keuangan / Perbankan</option>
                    <option value="manufacturing">Manufaktur</option>
                    <option value="retail">Retail / E-commerce</option>
                    <option value="healthcare">Kesehatan</option>
                    <option value="education">Pendidikan</option>
                    <option value="consulting">Konsultan</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>
              </div>

              <Button type="submit" className="w-full py-6 text-lg">
                <ArrowRight className="mr-2 size-5" />
                Jadwalkan Demo Gratis
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                🎉 Bonus: Dapatkan <strong>30 FREE Credits</strong> setelah demo!
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="border-t border-border bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-semibold tracking-[-0.05em] text-foreground">
            Subscribe Newsletter
          </h2>
          <p className="mt-4 text-lg leading-7 text-muted-foreground">
            Dapatkan insight terbaru tentang organizational development, tips
            survei, dan update produk langsung ke inbox Anda.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <input
              type="email"
              placeholder="Masukkan email Anda"
              className="w-full max-w-md rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 sm:flex-1"
            />
            <Button className="sm:w-auto">
              Subscribe
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        id="contact"
        className="border-t border-border bg-foreground px-4 py-16 text-background sm:px-6 lg:px-8"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
            Ready to see what the system is really doing?
          </h2>
          <div className="flex gap-4">
            <Button asChild variant="outline" className="border-background/25 text-background hover:text-background">
              <a href="mailto:hello@ansaka.id">
                Let&apos;s connect
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
            {/* WhatsApp Button */}
            <Button asChild className="bg-green-600 text-white hover:bg-green-700">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 size-4" />
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">ANSAKA</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Organization Assessment & Development Platform
            </p>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-foreground">
              Contact
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 ANSAKA. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/6281234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-transform hover:scale-110 hover:bg-green-700"
      >
        <MessageCircle className="size-7" />
      </a>
    </main>
  );
}
