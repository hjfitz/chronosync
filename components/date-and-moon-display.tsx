"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Moon } from "lucide-react"
import { calculateMoonPhase } from "@/lib/moon-phase"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

export function DateAndMoonDisplay() {
  const [date, setDate] = useState(new Date())
  const [moonPhase, setMoonPhase] = useState({ phase: "", percentage: 0 })
  const { theme } = useTheme()
  const isDark = theme === "dark"

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
    return date.toLocaleDateString(undefined, options)
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Date and Day Card */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-400" />
            <CardTitle className="font-light tracking-wide">Date & Day</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 items-center justify-center">
            <div className="text-4xl font-light tracking-wider text-center">{formatDate(date)}</div>
            <div className="text-xl text-muted-foreground font-light tracking-wide">{formatDay(date)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Moon Phase Card */}
      <Card className="overflow-hidden flex-1">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-amber-400" />
            <CardTitle className="font-light tracking-wide">Moon Phase</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <div className="relative mb-8 h-36 w-36 overflow-hidden rounded-full border border-amber-200/30">
            {/* Night sky background with subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 to-slate-900" />
            
            {/* Moon portion */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-50 via-amber-100 to-amber-200"
              style={{ width: `${moonPhase.percentage}%` }}
            >
              {/* Moon texture overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute rounded-full bg-slate-800/40 h-6 w-6 top-[20%] left-[30%]" />
                <div className="absolute rounded-full bg-slate-800/30 h-4 w-4 top-[40%] left-[60%]" />
                <div className="absolute rounded-full bg-slate-800/40 h-5 w-5 top-[65%] left-[25%]" />
              </div>
            </div>
            
            {/* Bezel reflection (luxury watch effect) */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
            
            {/* Stars in the night sky */}
            <div className="absolute inset-0">
              {[...Array(35)].map((_, i) => {
                const size = Math.random() * 1.2 + 0.6;
                const opacity = Math.random() * 0.5 + 0.5;
                const twinkle = Math.random() > 0.7;
                
                return (
                  <div
                    key={i}
                    className={cn(
                      "absolute bg-white rounded-full",
                      twinkle && "animate-pulse"
                    )}
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      right: `${Math.random() * 95}%`,
                      top: `${Math.random() * 95}%`,
                      opacity: opacity,
                      boxShadow: `0 0 ${size}px ${size / 2}px rgba(255,255,255,0.15)`
                    }}
                  />
                );
              })}
            </div>
            
            {/* Gold rim effect */}
            <div className="absolute inset-0 rounded-full border border-amber-200/20" />
            
            {/* Glass reflection overlay */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div className="absolute -inset-full rotate-[20deg] translate-x-1/4 translate-y-1/4 bg-gradient-to-t from-transparent via-white to-transparent opacity-5" />
            </div>
          </div>
          
          <div className="text-2xl font-light tracking-wider">{moonPhase.phase}</div>
          <div className="mt-1 text-sm text-amber-200/70">{moonPhase.percentage}% of lunar cycle</div>

          <div className="mt-8 w-full">
            <div className="flex justify-between items-center gap-2">
              {["New Moon", "First Quarter", "Full Moon", "Last Quarter"].map((phase, index) => (
                <div
                  key={phase}
                  className={cn(
                    "text-center p-2 rounded-sm border-b-2 text-xs flex-1 transition-colors",
                    moonPhase.phase === phase
                      ? "border-amber-400 text-amber-400 font-medium"
                      : "border-transparent text-muted-foreground",
                  )}
                >
                  {phase}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
