import type { Metadata, Viewport } from "next";
import { Montserrat, Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import StarCanvas from "@/components/StarCanvas";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dalili.study";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],   // only weights actually used; saves 3 font files
  display: "swap",
  preload: true,
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: "400",
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  themeColor: "#014DF8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Dalili — Guide des étudiants internationaux en France",
    template: "%s | Dalili",
  },
  description:
    "Dalili accompagne les étudiants internationaux à leur arrivée en France : visa, logement, CAF, mentors étudiants et démarches simplifiées.",
  keywords: [
    "Dalili",
    "étudiants internationaux France",
    "guide étudiant France",
    "visa étudiant France",
    "application étudiant",
    "CAF CROUS étudiant",
    "mentor étudiant Paris",
    "arrivée France étudiant",
  ],
  authors: [{ name: "Dalili" }],
  creator: "Dalili",
  publisher: "Dalili",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "6051ba04f9f38498",
  },
  openGraph: {
    title: "Dalili — Guide des étudiants internationaux en France",
    description:
      "L'application qui accompagne les étudiants internationaux à chaque étape de leur aventure en France.",
    url: SITE_URL,
    siteName: "Dalili",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Dalili — Guide des étudiants internationaux en France",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@dalilistudy",
    creator: "@dalilistudy",
    title: "Dalili — Guide des étudiants internationaux en France",
    description:
      "L'application qui accompagne les étudiants internationaux à chaque étape de leur aventure en France.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${montserrat.variable} ${bebasNeue.variable} ${dmSans.variable}`}
    >
      <head>
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="preload" href="/images/logo-dalili.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/plane-parts/fichier1.webp" as="image" type="image/webp" media="(min-width: 768px)" />
      </head>
      <body className="bg-[#010510] text-white antialiased overflow-x-hidden">
        {/* Skip to main content — screen readers & keyboard users */}
        <a href="#main-content" className="skip-link">
          Aller au contenu principal
        </a>
        {/* Fixed background — mounted once, shared across all pages, zero re-init cost */}
        <StarCanvas />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
