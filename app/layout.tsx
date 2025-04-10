import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://chrono.hjf.io'),
  title: "ChronoSync - Professional Timekeeping",
  description: "A sophisticated timekeeping application with multiple complications including timezones, date, and moon phase tracking for watch enthusiasts and professionals.",
  generator: 'Next.js',
  applicationName: 'ChronoSync',
  referrer: 'origin-when-cross-origin',
  keywords: ['watch', 'chronograph', 'timekeeping', 'moon phase', 'timezone', 'luxury watch', 'time tracker'],
  authors: [{ name: 'ChronoSync Team' }],
  creator: 'ChronoSync',
  publisher: 'ChronoSync',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'ChronoSync - Professional Timekeeping',
    description: 'A sophisticated timekeeping application with multiple complications including timezones, date, and moon phase tracking.',
    url: 'https://chrono.hjf.io',
    siteName: 'ChronoSync',
    images: [
      {
        url: 'https://chrono.hjf.io/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ChronoSync - Professional Timekeeping Application',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChronoSync - Professional Timekeeping',
    description: 'A sophisticated timekeeping application with multiple complications including timezones, date, and moon phase tracking.',
    images: ['https://chrono.hjf.io/images/og-image.jpg'],
    creator: '@chronosync',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="ChronoSync" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <link rel="canonical" href="https://chrono.hjf.io" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}