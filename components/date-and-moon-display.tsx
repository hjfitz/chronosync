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
  const [selectedPreviewPhase, setSelectedPreviewPhase] = useState<string | null>(null)

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

  // Generate moon phase display parameters
  const calculateMoonDisplay = (percentage: number) => {
    // First, ensure percentage is between 0-100
    const normalizedPercentage = ((percentage % 100) + 100) % 100;
    
    // Determine if it's waxing (first half of cycle) or waning (second half)
    const isWaxing = normalizedPercentage < 50;
    const isWaning = normalizedPercentage > 50;
    
    let position;
    
    if (normalizedPercentage < 3 || normalizedPercentage >= 97) {
      // New Moon - completely dark
      position = -10; // Center shadow to fully cover moon (for a 120% width shadow, -10% centers it)
    } else if (normalizedPercentage >= 47 && normalizedPercentage < 53) {
      // Full Moon - completely illuminated
      position = -110; // Move shadow completely off screen
    } else if (normalizedPercentage >= 22 && normalizedPercentage < 28) {
      // First Quarter - right half illuminated (shadow covers left half)
      position = -50; // Position shadow to cover left half only
    } else if (normalizedPercentage >= 72 && normalizedPercentage < 78) {
      // Last Quarter - left half illuminated (shadow covers right half)
      position = 50; // Position shadow to cover right half only
    } else if (isWaxing) {
      // Waxing phase (New Moon → Full Moon)
      // As percentage increases from 0→50, shadow moves from 50→-110
      position = 50 - ((normalizedPercentage / 50) * 160);
    } else {
      // Waning phase (Full Moon → New Moon)
      // As percentage increases from 50→100, shadow moves from -110→50
      position = -110 + (((normalizedPercentage - 50) / 50) * 160);
    }
    
    return { isWaxing, position };
  };

  // Get percentage value for each primary moon phase
  const getPercentageForPhase = (phase: string): number => {
    switch(phase) {
      case "New Moon": return 0;
      case "First Quarter": return 25;
      case "Full Moon": return 50;
      case "Last Quarter": return 75;
      default: return moonPhase.percentage;
    }
  };

  // Determine which percentage to use for the moon display
  const displayPercentage = selectedPreviewPhase 
    ? getPercentageForPhase(selectedPreviewPhase)
    : moonPhase.percentage;

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
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 to-slate-900">
              {/* Stars in the night sky */}
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
            
            {/* Moon phase implementation using two circles technique */}
            <div className="absolute inset-0">
              {/* Base moon (visible part) */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-50 via-amber-100 to-amber-200">
                {/* Moon texture overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute rounded-full bg-slate-800/40 h-6 w-6 top-[20%] left-[30%]" />
                  <div className="absolute rounded-full bg-slate-800/30 h-4 w-4 top-[40%] left-[60%]" />
                  <div className="absolute rounded-full bg-slate-800/40 h-5 w-5 top-[65%] left-[25%]" />
                </div>
              </div>
              
              {/* Shadow overlay circle - creates the crescent effect */}
              {(() => {
                const { position } = calculateMoonDisplay(displayPercentage);
                return (
                  <div 
                    className="absolute rounded-full bg-slate-950" 
                    style={{
                      top: '-10%',
                      bottom: '-10%',
                      width: '120%',
                      left: `${position}%`,
                      transition: 'left 0.5s ease-in-out'
                    }}
                  />
                );
              })()}
            </div>
            
            {/* Gold rim effect */}
            <div className="absolute inset-0 rounded-full border border-amber-200/20" />
            
            {/* Glass reflection overlay */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div className="absolute -inset-full rotate-[20deg] translate-x-1/4 translate-y-1/4 bg-gradient-to-t from-transparent via-white to-transparent opacity-5" />
            </div>
          </div>
          
          <div className="text-2xl font-light tracking-wider">
            {selectedPreviewPhase || moonPhase.phase}
          </div>
          <div className="mt-1 text-sm text-amber-200/70">
            {selectedPreviewPhase 
              ? `${getPercentageForPhase(selectedPreviewPhase)}% of lunar cycle (preview)` 
              : `${moonPhase.percentage}% of lunar cycle`}
          </div>

          <div className="mt-8 w-full">
            <div className="flex justify-between items-center gap-2">
              {["New Moon", "First Quarter", "Full Moon", "Last Quarter"].map((phase, index) => (
                <div
                  key={phase}
                  className={cn(
                    "text-center p-2 rounded-sm border-b-2 text-xs flex-1 transition-colors cursor-pointer hover:text-amber-200",
                    (moonPhase.phase === phase || selectedPreviewPhase === phase)
                      ? "border-amber-400 text-amber-400 font-medium"
                      : "border-transparent text-muted-foreground",
                  )}
                  onClick={() => {
                    // Toggle preview - if clicking the same phase, clear the preview
                    if (selectedPreviewPhase === phase) {
                      setSelectedPreviewPhase(null);
                    } else {
                      setSelectedPreviewPhase(phase);
                    }
                  }}
                  onMouseEnter={() => setSelectedPreviewPhase(phase)}
                  onMouseLeave={() => setSelectedPreviewPhase(null)}
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
