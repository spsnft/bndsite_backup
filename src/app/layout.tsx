// src/app/layout.tsx
import "@/styles/globals.css"
import type { Metadata, Viewport } from "next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { Montserrat } from 'next/font/google'
import { siteConfig } from "@/config/site"

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-montserrat',
})

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.name,
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    locale: siteConfig.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/images/og-image.png"],
  },
  other: {
    "dns-prefetch": "https://res.cloudinary.com",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${montserrat.variable}`} style={{ colorScheme: 'dark' }}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      {/* ✅ ЗДЕСЬ ГЛАВНОЕ ИЗМЕНЕНИЕ: заменяем хардкод на brand-цвета */}
      <body className="font-sans min-h-screen bg-brand-primary text-brand-light antialiased selection:bg-brand-secondary/30">
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
