import "@/styles/globals.css"
import type { Metadata, Viewport } from "next"
import { siteConfig } from "@/config/site"

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  other: {
    "dns-prefetch": "https://res.cloudinary.com",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale || "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      {/* ✅ ИСПРАВЛЕНО: заменяем хардкод на brand-цвета */}
      <body className="min-h-screen bg-brand-primary text-brand-light antialiased selection:bg-brand-secondary/30">
        {children}
      </body>
    </html>
  )
}
