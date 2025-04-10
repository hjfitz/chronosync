import { CombinedTimeDisplay } from "@/components/combined-time-display"
import { DateAndMoonDisplay } from "@/components/date-and-moon-display"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between py-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Chrono<span className="text-rose-500">Sync</span>
          </h1>
          <p className="text-sm text-slate-500">Precision timekeeping for the modern world</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <CombinedTimeDisplay />
          <DateAndMoonDisplay />
        </div>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          © 2025 ChronoSync. All rights reserved.
        </footer>
      </div>
    </main>
  )
}
