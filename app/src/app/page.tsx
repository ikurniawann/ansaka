import { Building2, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

import { HeroParallax } from "@/components/hero-parallax";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

// Landing page sections
import { HowItWorks } from "@/components/landing/how-it-works";
import { Methodology } from "@/components/landing/methodology";
import { CaseStudies } from "@/components/landing/case-studies";
import { SampleReport } from "@/components/landing/sample-report";
import { TrustBar } from "@/components/landing/trust-bar";
import { Pricing } from "@/components/landing/pricing";
import { Testimonials } from "@/components/landing/testimonials";
import { Faq } from "@/components/landing/faq";
import { CtaDemo } from "@/components/landing/cta-demo";
import { BlogNewsletter } from "@/components/landing/blog-newsletter";
import { SiteFooter } from "@/components/landing/site-footer";
import { WhatsappFab } from "@/components/landing/whatsapp-fab";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <SiteHeader />
      <HeroParallax />
      <HowItWorks />
      <Methodology />
      <CaseStudies />
      <SampleReport />
      <TrustBar />
      <Pricing />
      <Testimonials />
      <Faq />
      <CtaDemo />
      <BlogNewsletter />
      <SiteFooter />
      <WhatsappFab />
    </main>
  );
}
