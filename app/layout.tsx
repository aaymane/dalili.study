import type { Metadata, Viewport } from "next";
import { Montserrat, Open_Sans, Bebas_Neue, DM_Sans } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: false,
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: false,
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: "400",
  display: "swap",
  preload: false,
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
};

export const metadata: Metadata = {
  title: "DALILI — Ton arrivée en France commence ici",
  description:
    "DALILI accompagne les étudiants internationaux à leur arrivée en France : mentors, hôtes, communauté, démarches.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${montserrat.variable} ${openSans.variable} ${bebasNeue.variable} ${dmSans.variable}`}
    >
      <body className="bg-[#010510] text-white antialiased overflow-x-hidden">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
