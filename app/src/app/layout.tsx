import type { Metadata, Viewport } from "next";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://ansaka.id";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ANSAKA OAM Insight — Diagnostik Organisasi untuk Eksekutif",
    template: "%s · ANSAKA OAM Insight",
  },
  description:
    "Platform diagnostik organisasi premium berbasis OAM Framework: 5 layer × 12 driver × 27 failure point. Ubah noise survey menjadi peta eksekusi untuk leadership Indonesia. Daftar sekarang dan dapatkan 30 credit gratis.",
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
    title: "ANSAKA OAM Insight — Diagnostik Organisasi untuk Eksekutif",
    description:
      "Diagnostik organisasi berbasis OAM Framework. Daftar workspace baru sekarang dan dapatkan 30 credit gratis untuk 30 link survey pertama Anda.",
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
    title: "ANSAKA OAM Insight — Diagnostik Organisasi",
    description:
      "Ubah noise survey menjadi peta eksekusi. 30 credit gratis untuk workspace baru.",
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
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
