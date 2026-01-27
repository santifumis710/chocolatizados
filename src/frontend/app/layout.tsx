import { ReactNode } from "react";
import { Source_Sans_3, Playfair_Display } from "next/font/google";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-playfair",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${sourceSans.variable} ${playfair.variable}`}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Chocolatizados - Compra Chocolates Personalizados</title>
        <meta
          name="description"
          content="Lo que quieras decir decilo con chocolates. Compra chocolates personalizados con envío por WhatsApp."
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
