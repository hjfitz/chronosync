"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Moon } from "lucide-react"
import { calculateMoonPhase } from "@/lib/moon-phase"
import { cn } from "@/lib/utils"

export function DateAndMoonDisplay() {
  const [date, setDate] = useState(new Date())
  const [moonPhase, setMoonPhase] = useState({ phase: "", percentage: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setDate(now)
      setMoonPhase(calculateMoonPhase(now))
    }, 60000) // Update every minute

    // Initial moon phase calculation
    setMoonPhase(calculateMoonPhase(date))

    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return date.toLocaleDateString(undefined, options)
  }

  const formatDay = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: "long" }
    const day = date.toLocaleDateString(undefined, options)

    // Split the day to highlight first 3 letters
    const firstThree = day.substring(0, 3)
    const rest = day.substring(3)

    return { firstThree, rest }
  }

  const { firstThree, rest } = formatDay(date)

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Date and Day Card */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <CardTitle>Date & Day</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center">
            <div className="text-2xl font-medium tracking-tight">{formatDate(date)}</div>
            <div className="mt-2 text-3xl font-bold tracking-tight">
              <span className="text-emerald-600 font-extrabold">{firstThree}</span>
              <span>{rest}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Moon Phase Card */}
      <Card className="overflow-hidden flex-1">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            <CardTitle>Moon Phase</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <div className="relative mb-6 h-32 w-32 overflow-hidden rounded-full bg-slate-200 shadow-inner">
            <div
              className="absolute right-0 top-0 bottom-0 bg-slate-800"
              style={{ width: `${100 - moonPhase.percentage}%` }}
            ></div>
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-full bg-white opacity-20"></div>

            {/* Stars in the dark part */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white rounded-full opacity-70"
                  style={{
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 2 + 1}px`,
                    right: `${Math.random() * 40 + 5}%`,
                    top: `${Math.random() * 90 + 5}%`,
                  }}
                ></div>
              ))}
            </div>
          </div>
          <div className="text-2xl font-bold">{moonPhase.phase}</div>
          <div className="mt-1 text-sm text-slate-500">{moonPhase.percentage}% of lunar cycle</div>

          <div className="mt-6 grid grid-cols-4 gap-2 w-full">
            {["New Moon", "First Quarter", "Full Moon", "Last Quarter"].map((phase, index) => (
              <div
                key={phase}
                className={cn(
                  "text-center p-2 rounded-md text-xs",
                  moonPhase.phase === phase
                    ? "bg-indigo-100 text-indigo-800 font-medium"
                    : "bg-slate-100 text-slate-600",
                )}
              >
                {phase}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
