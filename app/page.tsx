import { CombinedTimeDisplay } from "@/components/combined-time-display"
import { DateAndMoonDisplay } from "@/components/date-and-moon-display"
import Script from "next/script"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 sm:p-6">
      <Script id="json-ld" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "ChronoSync",
            "url": "https://chrono.hjf.io",
            "description": "A sophisticated timekeeping application with multiple complications including timezones, date, and moon phase tracking for watch enthusiasts and professionals.",
            "applicationCategory": "UtilitiesApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "screenshot": "https://chrono.hjf.io/images/og-image.jpg",
            "featureList": "Time zones, Date tracking, Moon phase display, High precision timekeeping",
            "author": {
              "@type": "Organization",
              "name": "ChronoSync",
              "url": "https://chrono.hjf.io"
            }
          }
        `}
      </Script>
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between py-8 border-b border-amber-200/10">
          <h1 className="text-2xl sm:text-3xl font-light tracking-wider text-foreground">
            Chrono<span className="text-amber-400">Sync</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2 sm:mt-0 font-light tracking-wider">Refined timekeeping for connoisseurs</p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          <CombinedTimeDisplay />
          <DateAndMoonDisplay />
        </div>

        <footer className="mt-16 border-t border-amber-200/10 pt-8 text-center text-sm text-muted-foreground font-light tracking-wider">
          <div className="flex flex-col items-center justify-center">
            <div className="text-amber-400 font-serif mb-2">ChronoSync</div>
            <div>© 2025 All rights reserved</div>
          </div>
        </footer>
      </div>
    </main>
  )
}
