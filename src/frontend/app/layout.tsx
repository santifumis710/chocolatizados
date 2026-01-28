import { ReactNode } from "react";
import { Source_Sans_3, Playfair_Display } from "next/font/google";
import type { Metadata } from "next";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Chocolatizados - Compra Chocolates Personalizados",
  description: "Lo que quieras decir decilo con chocolates. Compra chocolates personalizados con envío por WhatsApp.",
  icons: {
    icon: "/logo.jpg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${sourceSans.variable} ${playfair.variable}`}>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
