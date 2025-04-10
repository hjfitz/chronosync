"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Clock, Globe } from "lucide-react"
import { useTheme } from "next-themes"

export function CombinedTimeDisplay() {
  const [time, setTime] = useState(new Date())
  const [showGmtHand, setShowGmtHand] = useState(true)
  const [selectedTimezone, setSelectedTimezone] = useState("GMT+0")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const [bezelsStyle, setBezelsStyle] = useState<"pepsi" | "batman" | "rootbeer">("pepsi")

  // Get timezone offset in hours
  const getTimezoneOffset = (timezone: string) => {
    return Number.parseInt(timezone.replace("GMT", "")) || 0
  }

  // Parse HSL variable to actual color value
  const parseHslVariable = (variable: string) => {
    // Default fallback colors in case variables aren't available
    const fallbacks = {
      "--card": "255, 255, 255", // white
      "--foreground": "23, 23, 23", // near black
      "--muted": "240, 240, 240", // light gray
      "--muted-foreground": "115, 115, 115", // mid gray
      "--primary": "37, 99, 235", // blue
      "--border": "229, 231, 235", // light gray
      "--accent-foreground": "28, 28, 28", // dark gray
    }

    if (!document.documentElement) return `hsl(${fallbacks[variable as keyof typeof fallbacks] || "0, 0%, 0%"})`;

    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim();
      
    return value ? `hsl(${value})` : `hsl(${fallbacks[variable as keyof typeof fallbacks] || "0, 0%, 0%"})`;
  }

  // Draw clock
  const drawClock = (ctx: CanvasRenderingContext2D, time: Date, width: number, height: number) => {
    const radius = (Math.min(width, height) / 2) * 0.9
    const centerX = width / 2
    const centerY = height / 2

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Get colors based on current theme
    const isDark = theme === "dark"
    
    // GMT Master inspired color palette
    const clockFaceBg = isDark ? "#0a0a14" : "#0a0a14" // Always dark for GMT style
    const hourMarkerColor = "#e0e0e0" // Silver-white
    const hourMarkersOutlineColor = "#d4af37" // Gold outlines for markers
    const handColor = "#e0e0e0" // Silver-white for hands
    const secondHandColor = "#e93b25" // Red second hand
    const gmtHandColor = "#ce4119" // GMT hand in vibrant orange-red
    const centerDotColor = "#e0e0e0" // Silver central dot
    
    // Bezel colors
    const bezelColors = {
      pepsi: {
        upper: "#001e96", // Blue (upper half for day hours)
        lower: "#ce0314"  // Red (lower half for night hours)
      },
      batman: {
        upper: "#001e96", // Blue (upper half)
        lower: "#0a0a14"  // Black (lower half)
      },
      rootbeer: {
        upper: "#382624", // Brown
        lower: "#d4af37"  // Gold
      }
    };
    
    const selectedBezel = bezelColors[bezelsStyle];

    // Draw outer case (representing the watch case)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 1.1, 0, 2 * Math.PI)
    ctx.fillStyle = isDark ? "#32323e" : "#babbbd" // Steel case color
    ctx.fill()

    // Draw bezel - GMT Master iconic two-tone bezel
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 1.05, 0, 2 * Math.PI)
    ctx.fillStyle = "#0a0a14" // Base bezel color
    ctx.fill()
    
    // Draw rotating bezel with 24-hour markings
    // Draw upper half of bezel (day hours)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 1.05, -Math.PI/2, Math.PI/2, false)
    ctx.lineTo(centerX, centerY)
    ctx.closePath()
    ctx.fillStyle = selectedBezel.upper
    ctx.fill()
    
    // Draw lower half of bezel (night hours)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 1.05, Math.PI/2, 3*Math.PI/2, false)
    ctx.lineTo(centerX, centerY)
    ctx.closePath()
    ctx.fillStyle = selectedBezel.lower
    ctx.fill()
    
    // Draw 24-hour markings on bezel
    ctx.font = `${radius * 0.09}px 'Inter', sans-serif`
    ctx.fillStyle = "#ffffff"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    
    // Draw 24h numbers on bezel
    for (let i = 0; i < 24; i++) {
      const angle = (i * Math.PI) / 12
      const x = centerX + radius * 0.93 * Math.sin(angle)
      const y = centerY - radius * 0.93 * Math.cos(angle)
      
      // Even numbers in larger font
      if (i % 2 === 0) {
        ctx.font = `bold ${radius * 0.09}px 'Inter', sans-serif`
        ctx.fillText(i.toString(), x, y)
      } else {
        // Small markers for odd hours
        ctx.beginPath()
        ctx.arc(x, y, radius * 0.01, 0, 2 * Math.PI)
        ctx.fillStyle = "#ffffff"
        ctx.fill()
      }
    }
    
    // Draw bezel triangle at 12 position
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - radius * 1.05)
    ctx.lineTo(centerX - radius * 0.03, centerY - radius)
    ctx.lineTo(centerX + radius * 0.03, centerY - radius)
    ctx.closePath()
    ctx.fillStyle = "#ffffff"
    ctx.fill()
    
    // Draw main clock face
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.fillStyle = clockFaceBg
    ctx.fill()
    
    // Subtle texture for the dial
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
    ctx.fill()
    
    // Draw hour markers - GMT Master style (round markers at 1,2,4,5,7,8,10,11 and rectangular at 3,6,9, triangle at 12)
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6
      const x = centerX + radius * 0.85 * Math.sin(angle)
      const y = centerY - radius * 0.85 * Math.cos(angle)
      
      // Gold outline
      ctx.strokeStyle = hourMarkersOutlineColor
      ctx.lineWidth = 1
      
      if (i === 0) {
        // Triangle at 12
        ctx.beginPath()
        ctx.moveTo(x, y - radius * 0.05)
        ctx.lineTo(x - radius * 0.035, y + radius * 0.02)
        ctx.lineTo(x + radius * 0.035, y + radius * 0.02)
        ctx.closePath()
        ctx.fillStyle = hourMarkerColor
        ctx.fill()
        ctx.stroke()
      } else if (i === 3 || i === 6 || i === 9) {
        // Rectangles at 3, 6, 9
        ctx.beginPath()
        ctx.rect(x - radius * 0.04, y - radius * 0.02, radius * 0.08, radius * 0.04)
        ctx.fillStyle = hourMarkerColor
        ctx.fill()
        ctx.stroke()
      } else {
        // Circles for other hours
        ctx.beginPath()
        ctx.arc(x, y, radius * 0.025, 0, 2 * Math.PI)
        ctx.fillStyle = hourMarkerColor
        ctx.fill()
        ctx.stroke()
      }
      
      // Add lume dots
      ctx.beginPath()
      ctx.arc(x, y, radius * 0.01, 0, 2 * Math.PI)
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.fill()
    }
    
    // Small minute markers
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
    ctx.lineWidth = 1
    for (let i = 0; i < 60; i++) {
      if (i % 5 !== 0) {
        const angle = (i * Math.PI) / 30
        const x1 = centerX + radius * 0.95 * Math.sin(angle)
        const y1 = centerY - radius * 0.95 * Math.cos(angle)
        const x2 = centerX + radius * 0.92 * Math.sin(angle)
        const y2 = centerY - radius * 0.92 * Math.cos(angle)

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
    }
    
    // "Rolex" text - subtle luxury branding
    ctx.font = `${radius * 0.1}px 'Times New Roman', serif`
    ctx.fillStyle = hourMarkersOutlineColor
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("ChronoSync", centerX, centerY - radius * 0.25)
    
    // "GMT-Master" text
    ctx.font = `${radius * 0.06}px 'Inter', sans-serif`
    ctx.fillStyle = "#e0e0e0"
    ctx.fillText("GMT-Master", centerX, centerY + radius * 0.25)

    // Get current hours, minutes, seconds
    const hours = time.getHours() % 12
    const minutes = time.getMinutes()
    const seconds = time.getSeconds()

    // Draw hour hand - Mercedes style
    const hourAngle = (hours * Math.PI) / 6 + (minutes * Math.PI) / (6 * 60)
    const hourHandLength = radius * 0.5
    
    // Hour hand shape - Mercedes style
    ctx.beginPath()
    ctx.lineWidth = radius * 0.04
    ctx.lineCap = "round"
    ctx.strokeStyle = handColor
    
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(
      centerX + hourHandLength * Math.sin(hourAngle), 
      centerY - hourHandLength * Math.cos(hourAngle)
    )
    ctx.stroke()
    
    // Mercedes circle at the end of hour hand
    const hourHandCircleX = centerX + hourHandLength * 0.7 * Math.sin(hourAngle)
    const hourHandCircleY = centerY - hourHandLength * 0.7 * Math.cos(hourAngle)
    ctx.beginPath()
    ctx.arc(hourHandCircleX, hourHandCircleY, radius * 0.05, 0, 2 * Math.PI)
    ctx.fillStyle = handColor
    ctx.fill()

    // Draw minute hand - Sword style
    const minuteAngle = (minutes * Math.PI) / 30
    const minuteHandLength = radius * 0.75
    
    ctx.beginPath()
    ctx.lineWidth = radius * 0.03
    ctx.lineCap = "round"
    ctx.strokeStyle = handColor
    
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(
      centerX + minuteHandLength * Math.sin(minuteAngle), 
      centerY - minuteHandLength * Math.cos(minuteAngle)
    )
    ctx.stroke()

    // Draw GMT hand with distinctive triangle tip
    if (showGmtHand) {
      const offset = getTimezoneOffset(selectedTimezone)
      const gmtHours = (hours + offset) % 24
      const gmtAngle = (gmtHours * Math.PI) / 12
      const gmtHandLength = radius * 0.8
      
      ctx.beginPath()
      ctx.lineWidth = radius * 0.02
      ctx.lineCap = "butt"
      ctx.strokeStyle = gmtHandColor
      
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(
        centerX + gmtHandLength * 0.8 * Math.sin(gmtAngle), 
        centerY - gmtHandLength * 0.8 * Math.cos(gmtAngle)
      )
      ctx.stroke()
      
      // Triangle tip for GMT hand
      const tipX = centerX + gmtHandLength * Math.sin(gmtAngle)
      const tipY = centerY - gmtHandLength * Math.cos(gmtAngle)
      
      ctx.beginPath()
      ctx.moveTo(tipX, tipY)
      ctx.lineTo(
        tipX - radius * 0.04 * Math.cos(gmtAngle), 
        tipY - radius * 0.04 * Math.sin(gmtAngle)
      )
      ctx.lineTo(
        tipX + radius * 0.04 * Math.cos(gmtAngle), 
        tipY + radius * 0.04 * Math.sin(gmtAngle)
      )
      ctx.closePath()
      ctx.fillStyle = gmtHandColor
      ctx.fill()
    }
    
    // Draw second hand
    const secondAngle = (seconds * Math.PI) / 30
    const secondHandLength = radius * 0.85
    
    ctx.beginPath()
    ctx.lineWidth = radius * 0.01
    ctx.lineCap = "round"
    ctx.strokeStyle = secondHandColor
    
    // Draw counterbalance
    const counterbalanceLength = radius * 0.2
    ctx.moveTo(
      centerX - counterbalanceLength * Math.sin(secondAngle), 
      centerY + counterbalanceLength * Math.cos(secondAngle)
    )
    
    // Draw main second hand
    ctx.lineTo(
      centerX + secondHandLength * Math.sin(secondAngle), 
      centerY - secondHandLength * Math.cos(secondAngle)
    )
    ctx.stroke()

    // Draw center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.04, 0, 2 * Math.PI)
    ctx.fillStyle = "#0a0a14"
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.03, 0, 2 * Math.PI)
    ctx.fillStyle = centerDotColor
    ctx.fill()
  }

  // Update clock on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const updateCanvasSize = () => {
      const container = canvas.parentElement
      if (container) {
        const { width, height } = container.getBoundingClientRect()
        canvas.width = width
        canvas.height = height
        drawClock(ctx, time, width, height)
      }
    }

    // Initial size
    updateCanvasSize()

    // Update on resize
    window.addEventListener("resize", updateCanvasSize)

    // Update time every second
    const timer = setInterval(() => {
      const newTime = new Date()
      setTime(newTime)

      const { width, height } = canvas
      drawClock(ctx, newTime, width, height)
    }, 1000)

    return () => {
      clearInterval(timer)
      window.removeEventListener("resize", updateCanvasSize)
    }
  }, [time, showGmtHand, selectedTimezone, theme, bezelsStyle])

  // Format digital time
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const seconds = date.getSeconds().toString().padStart(2, "0")
    return `${hours}:${minutes}:${seconds}`
  }

  // Format GMT time
  const formatGmtTime = (date: Date, offset: number) => {
    const gmtDate = new Date(date.getTime())
    const localOffset = date.getTimezoneOffset() / 60
    gmtDate.setHours(date.getHours() + localOffset + offset)

    const hours = gmtDate.getHours().toString().padStart(2, "0")
    const minutes = gmtDate.getMinutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-400" />
            <CardTitle className="font-light tracking-wide">GMT-Master</CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <button 
              className={`w-5 h-5 rounded-full transition-opacity ${bezelsStyle === 'pepsi' ? 'ring-1 ring-amber-400' : 'opacity-50'}`}
              onClick={() => setBezelsStyle('pepsi')}
              title="Pepsi bezel (red/blue)"
              style={{ 
                background: 'linear-gradient(90deg, #001e96 0%, #001e96 50%, #ce0314 50%, #ce0314 100%)' 
              }}
            />
            <button 
              className={`w-5 h-5 rounded-full transition-opacity ${bezelsStyle === 'batman' ? 'ring-1 ring-amber-400' : 'opacity-50'}`}
              onClick={() => setBezelsStyle('batman')}
              title="Batman bezel (black/blue)"
              style={{ 
                background: 'linear-gradient(90deg, #001e96 0%, #001e96 50%, #0a0a14 50%, #0a0a14 100%)' 
              }}
            />
            <button 
              className={`w-5 h-5 rounded-full transition-opacity ${bezelsStyle === 'rootbeer' ? 'ring-1 ring-amber-400' : 'opacity-50'}`}
              onClick={() => setBezelsStyle('rootbeer')}
              title="Rootbeer bezel (brown/gold)"
              style={{ 
                background: 'linear-gradient(90deg, #382624 0%, #382624 50%, #d4af37 50%, #d4af37 100%)' 
              }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-8">
          {/* Analog clock */}
          <div className="relative h-72 sm:h-96 mx-auto w-full max-w-[350px]">
            <canvas ref={canvasRef} className="h-full w-full" />
          </div>

          {/* Digital clock */}
          <div className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col items-center justify-center rounded-sm bg-muted/20 p-4 text-center border-b border-amber-100/10">
                <div className="text-sm font-light tracking-widest text-muted-foreground mb-1">Local Time</div>
                <div className="text-3xl font-light tracking-[0.2em]">{formatTime(time)}</div>
              </div>
              <div className="flex flex-col items-center justify-center rounded-sm bg-muted/20 p-4 text-center border-b border-amber-100/10">
                <div className="text-sm font-light tracking-widest text-muted-foreground mb-1">{selectedTimezone}</div>
                <div className="text-3xl font-light tracking-[0.2em]">
                  {formatGmtTime(time, getTimezoneOffset(selectedTimezone))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-border/20 pt-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="gmt-hand" 
                  checked={showGmtHand} 
                  onCheckedChange={setShowGmtHand}
                  className="data-[state=checked]:bg-amber-400 data-[state=checked]:text-amber-950"
                />
                <Label htmlFor="gmt-hand" className="text-sm font-light">Show GMT hand</Label>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-amber-400" />
                <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                  <SelectTrigger className="w-32 border-amber-200/20 bg-muted/10 focus:ring-amber-400/20">
                    <SelectValue placeholder="Timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {[-12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                      (offset) => (
                        <SelectItem 
                          key={offset} 
                          value={`GMT${offset >= 0 ? "+" : ""}${offset}`}
                          className="font-light"
                        >
                          GMT{offset >= 0 ? "+" : ""}
                          {offset}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
