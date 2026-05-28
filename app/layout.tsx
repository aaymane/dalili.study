import type { Metadata, Viewport } from "next";
import { Montserrat, Bebas_Neue, DM_Sans } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });

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
  title: "DALILI — Ton arrivée en France commence ici",
  description:
    "DALILI accompagne les étudiants internationaux à leur arrivée en France : mentors, communauté et démarches simplifiées.",
  openGraph: {
    title: "DALILI — Ton arrivée en France commence ici",
    description:
      "L'application qui accompagne les étudiants internationaux à chaque étape de leur aventure en France.",
    type: "website",
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
      <body className="bg-[#010510] text-white antialiased overflow-x-hidden">
        {/* Skip to main content — screen readers & keyboard users */}
        <a
          href="#main-content"
          className="skip-link"
        >
          Aller au contenu principal
        </a>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
