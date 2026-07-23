import type { Metadata, Viewport } from "next";
import { Montserrat, Bebas_Neue, DM_Sans } from "next/font/google";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import StarCanvas from "@/components/StarCanvas";
import AssistantWidget from "@/components/AssistantWidget";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dalili.study";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
  display: "optional",
  preload: true,
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: "400",
  display: "optional",
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
  display: "optional",
  preload: true,
});

export const viewport: Viewport = {
  themeColor: "#014DF8",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Dalili — Guide des étudiants internationaux en France",
    template: "%s | Dalili",
  },
  description:
    "Dalili accompagne les étudiants internationaux à leur arrivée en France : visa, logement, CAF, budget, universités, mentors et démarches simplifiées.",
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
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
        {/* Critical CSS inline — prevents FOUC before globals.css loads */}
        <style dangerouslySetInnerHTML={{ __html: `*,*::before,*::after{box-sizing:border-box}html{scroll-behavior:auto!important}body{background:#010510;color:#fff;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;overflow-x:hidden}` }} />
      </head>
      <body className="bg-[#010510] text-white antialiased overflow-x-hidden">
        {/* Google Tag Manager (noscript) — must be the first thing in body */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WTNNC952"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* Skip to main content — screen readers & keyboard users */}
        <a href="#main-content" className="skip-link">
          Aller au contenu principal
        </a>
        {/* Fixed background — mounted once, shared across all pages, zero re-init cost */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Dalili",
            "alternateName": "Dalili Study",
            "url": "https://dalili.study",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://dalili.study/blog?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          }) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Dalili",
            "alternateName": "dalili.study",
            "description": "Guide de référence pour les étudiants internationaux souhaitant étudier en France. Visa, Campus France, logement, CAF, banque — tout documenté sur sources officielles.",
            "url": "https://dalili.study",
            "logo": "https://dalili.study/images/logo-dalili.svg",
            "foundingDate": "2025",
            "areaServed": ["Maroc", "Algérie", "Tunisie", "Sénégal", "Côte d'Ivoire", "Cameroun"],
            "knowsAbout": [
              "Visa étudiant France",
              "Campus France CEF",
              "Logement étudiant CROUS France",
              "CAF étudiant étranger",
              "Compte bancaire étudiant France",
              "TCF DELF préparation",
              "OFII validation visa étudiant",
              "Sécurité sociale étudiante France"
            ],
            "sameAs": [
              "https://www.facebook.com/dalili.guide",
              "https://twitter.com/dalilistudy"
            ]
          }) }}
        />
        <StarCanvas />
        <Navbar />
        {children}
        <AssistantWidget />
      </body>
      <GoogleTagManager gtmId="GTM-WTNNC952" />
      <GoogleAnalytics gaId="G-95T08PB2MV" />
    </html>
  );
}
