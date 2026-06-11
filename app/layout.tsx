import type { Metadata, Viewport } from "next";
import { Montserrat, Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dalili-waitlist.vercel.app";

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
  themeColor: "#010510",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Dalili — Guide des étudiants internationaux en France",
    description:
      "L'application qui accompagne les étudiants internationaux à chaque étape de leur aventure en France.",
    creator: "@dalili_app",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Dalili",
  url: SITE_URL,
  description:
    "Dalili accompagne les étudiants internationaux à leur arrivée en France : visa, logement, CAF, mentors étudiants et démarches simplifiées.",
  logo: `${SITE_URL}/dalili-logo.svg`,
  sameAs: [],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#010510] text-white antialiased overflow-x-hidden">
        {/* Skip to main content — screen readers & keyboard users */}
        <a
          href="#main-content"
          className="skip-link"
        >
          Aller au contenu principal
        </a>
        {children}
      </body>
    </html>
  );
}
