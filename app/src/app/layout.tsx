import type { Metadata, Viewport } from "next";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://ansaka.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ANSAKA OAM Insight | Platform Diagnostik Organisasi & Survey OAM",
    template: "%s · ANSAKA OAM Insight",
  },
  description:
    "ANSAKA OAM Insight adalah platform diagnostik organisasi berbasis OAM Framework untuk survey leadership alignment, execution gap, culture signal, dan laporan prioritas eksekutif.",
  keywords: [
    "assessment perusahaan",
    "survey karyawan",
    "organizational diagnostic",
    "employee engagement",
    "leadership alignment",
    "OAM framework",
    "ANSAKA",
    "diagnostik organisasi",
  ],
  authors: [{ name: "ANSAKA Indonesia" }],
  creator: "ANSAKA Indonesia",
  publisher: "ANSAKA Indonesia",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "id-ID": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "ANSAKA OAM Insight",
    title: "ANSAKA OAM Insight | Platform Diagnostik Organisasi",
    description:
      "Platform survey dan diagnostic report berbasis OAM Framework untuk membaca leadership alignment, execution gap, dan culture signal.",
    images: [
      {
        url: "/og-cover.png",
        width: 1200,
        height: 630,
        alt: "ANSAKA OAM Insight — Diagnostik Organisasi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ANSAKA OAM Insight | Platform Diagnostik Organisasi",
    description:
      "Ubah noise survey menjadi peta eksekusi berbasis OAM Framework.",
    images: ["/og-cover.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Business / HR Tech",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1f3f6" },
    { media: "(prefers-color-scheme: dark)", color: "#070a12" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ANSAKA Indonesia",
              url: SITE_URL,
              logo: `${SITE_URL}/logo.png`,
              sameAs: [
                "https://www.linkedin.com/company/ansaka",
                "https://www.instagram.com/ansaka.id",
              ],
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+62-21-0000-0000",
                  contactType: "sales",
                  areaServed: "ID",
                  availableLanguage: ["Indonesian", "English"],
                },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "ANSAKA OAM Insight",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              url: SITE_URL,
              description:
                "Platform diagnostik organisasi untuk survey OAM, leadership alignment, execution gap, dan report eksekutif.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "IDR",
                description: "Workspace baru mendapatkan 30 credit gratis.",
              },
            }),
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
