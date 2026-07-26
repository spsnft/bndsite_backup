import type { Metadata } from "next";
import "./globals.css";
import { CalendlyScript } from "@/src/components/CalendlyScript";

export const metadata: Metadata = {
  title: "Fedor Tsvetkov — Growth Architect & Performance Marketer",
  description:
    "We build high-ticket growth engines. No fluff, just architecture that scales.",
  openGraph: {
    title: "Fedor Tsvetkov — Growth Architect & Performance Marketer",
    description:
      "Managing $500K+ annual media budgets. Scaled monthly revenue 7×. 1,000+ qualified B2B leads per month.",
    url: "https://tsvetkov.site",
    siteName: "Fedor Tsvetkov",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <CalendlyScript />
      </body>
    </html>
  );
}
