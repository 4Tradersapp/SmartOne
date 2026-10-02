import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Public_Sans, Saira_Semi_Condensed } from "next/font/google";
import "./globals.css";

const saira = Saira_Semi_Condensed({ variable: "--font-saira", subsets: ["latin"], weight: ["500", "600", "700"] });
const publicSans = Public_Sans({ variable: "--font-public", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const plex = IBM_Plex_Mono({ variable: "--font-plex", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: { default: "Smart One · Grupo FortSvig", template: "%s · Smart One" },
  description: "Plataforma de gestão operacional do Grupo FortSvig: portaria, limpeza, brigada e manutenção num só lugar.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0E1B33",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${saira.variable} ${publicSans.variable} ${plex.variable}`}>
      <body>{children}</body>
    </html>
  );
}
