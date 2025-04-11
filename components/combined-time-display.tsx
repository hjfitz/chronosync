"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Globe } from "lucide-react"
import { useTheme } from "next-themes"

type Timezone = {
  label: string
  offset: number
}

const defaultTimezone: Timezone = {
  label: "London",
  offset: 0,
}

const timezones: Timezone[] = [
  { label: "London", offset: 0 },
  { label: "Paris", offset: 1 },
  { label: "New York", offset: -5 },
  { label: "Los Angeles", offset: -8 },
  { label: "Sydney", offset: 10 },
  { label: "Tokyo", offset: 9 },
  { label: "Beijing", offset: 8 },
  { label: "Moscow", offset: 3 },
  { label: "Sao Paulo", offset: -3 },
  { label: "Mexico City", offset: -6 },
  { label: "Buenos Aires", offset: -3 },
  { label: "Cape Town", offset: 2 },
  { label: "Johannesburg", offset: 2 },
  { label: "Seattle", offset: -8 },
  { label: "Athens", offset: 2 },
]

export function CombinedTimeDisplay() {
  const [time, setTime] = useState(new Date())
  const [selectedTimezone, setSelectedTimezone] = useState<Timezone>(defaultTimezone)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const [bezelsStyle, setBezelsStyle] = useState<"pepsi" | "batman" | "gmt" | "explorer">("pepsi")

  // Get timezone offset in hours
  const getTimezoneOffset = (timezone: string) => {
    return Number.parseInt(timezone.replace("GMT", "")) || 0
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
        upper: "#001e96", // Blue (top half)
        lower: "#ce0314"  // Red (bottom half)
      },
      batman: {
        upper: "#001e96", // Blue (top half)
        lower: "#0a0a14"  // Black (bottom half)
      },
      gmt: {
        upper: "#006e51", // Green (top half)
        lower: "#0a0a14"  // Black (bottom half)
      },
      explorer: {
        upper: "#babbbd", // Steel color (full bezel)
        lower: "#babbbd"  // Steel color (full bezel)
      }
    };
    
    const selectedBezel = bezelColors[bezelsStyle];

    // Draw outer case (representing the watch case)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 1.1, 0, 2 * Math.PI)
    ctx.fillStyle = isDark ? "#32323e" : "#babbbd" // Steel case color
    ctx.fill()

    // 1. Create a raised bezel effect with a slight gradient for depth
    const bezelOuterRadius = radius * 1.05;
    const bezelInnerRadius = radius * 0.88;
    
    // Create gradient for bezel edge to give a 3D effect
    const bezelEdgeGradient = ctx.createRadialGradient(
      centerX, centerY, bezelInnerRadius,
      centerX, centerY, bezelOuterRadius
    );
    bezelEdgeGradient.addColorStop(0, isDark ? "#444" : "#999");
    bezelEdgeGradient.addColorStop(1, isDark ? "#222" : "#777");
    
    // Draw bezel outer edge
    ctx.beginPath();
    ctx.arc(centerX, centerY, bezelOuterRadius, 0, 2 * Math.PI);
    ctx.arc(centerX, centerY, bezelInnerRadius, 0, 2 * Math.PI, true);
    ctx.fillStyle = bezelEdgeGradient;
    ctx.fill();
    
    // 2. Create the bezel insert with the two-tone color - WIDER INSERT
    const bezelInsertOuterRadius = radius * 1.04;
    const bezelInsertInnerRadius = radius * 0.89;
    
    // Draw the full bezel insert background (in case we want a full-color bezel)
    ctx.beginPath();
    ctx.arc(centerX, centerY, bezelInsertOuterRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#0a0a14"; // Base bezel color
    ctx.fill();
    
    // Draw upper/right half of bezel insert (day hours) - ROTATED by 90 degrees
    ctx.beginPath()
    ctx.arc(centerX, centerY, bezelInsertOuterRadius, 0, Math.PI, false);
    ctx.arc(centerX, centerY, bezelInsertInnerRadius, Math.PI, 0, true);
    ctx.closePath()
    ctx.fillStyle = selectedBezel.upper;
    ctx.fill()
    
    // Draw lower/left half of bezel insert (night hours) - ROTATED by 90 degrees
    ctx.beginPath()
    ctx.arc(centerX, centerY, bezelInsertOuterRadius, Math.PI, 2*Math.PI, false);
    ctx.arc(centerX, centerY, bezelInsertInnerRadius, 2*Math.PI, Math.PI, true);
    ctx.closePath()
    ctx.fillStyle = selectedBezel.lower;
    ctx.fill()
    
    // 3. Add a subtle ring to separate the bezel insert from the bezel edge
    ctx.beginPath();
    ctx.arc(centerX, centerY, bezelInsertOuterRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = isDark ? "#555" : "#999";
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Also add a subtle inner ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, bezelInsertInnerRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = isDark ? "#333" : "#777";
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // 4. Draw bezel triangle marker at 12 position (24 hour mark)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - bezelInsertOuterRadius + radius * 0.01);
    ctx.lineTo(centerX - radius * 0.02, centerY - bezelInsertOuterRadius + radius * 0.04);
    ctx.lineTo(centerX + radius * 0.02, centerY - bezelInsertOuterRadius + radius * 0.04);
    ctx.closePath()
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    
    // 5. Draw the bezel 24-hour markings - integrated into the bezel
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    for (let i = 0; i < 24; i++) {
      const angle = (i * Math.PI) / 12;
      // Position numbers precisely on the bezel insert
      const bezelCenter = (bezelInsertOuterRadius + bezelInsertInnerRadius) / 2;
      const x = centerX + bezelCenter * Math.sin(angle);
      const y = centerY - bezelCenter * Math.cos(angle);
      
      // Determine if this number is in upper or lower half
      const isInUpperHalf = i >= 18 || i <= 5; // 18-23, 0-5 hours (6pm-5am)
      
      // Set font size based on hour importance - slightly larger for wider bezel
      if (i % 6 === 0) {
        // Cardinal hours (0/24, 6, 12, 18)
        ctx.font = `bold ${radius * 0.13}px Arial, sans-serif`;
      } else if (i % 2 === 0) {
        // Even hours
        ctx.font = `bold ${radius * 0.11}px Arial, sans-serif`;
      } else {
        // Odd hours
        ctx.font = `${radius * 0.09}px Arial, sans-serif`;
      }
      
      // For a more professional look, add a subtle shadow effect
      const hourText = i === 0 ? "24" : i.toString();
      
      // Draw text shadow/outline first
      ctx.fillStyle = "#000000";
      ctx.globalAlpha = 0.6;
      ctx.fillText(hourText, x + 0.5, y + 0.5);
      ctx.globalAlpha = 1.0;
      
      // Then draw the actual text
      ctx.fillStyle = "#ffffff";
      ctx.fillText(hourText, x, y);
    }
    
    // Draw main clock face - REDUCED SIZE to fit better with bezel
    const dialRadius = radius * 0.86; // Reduced from 0.88 to 0.86 to fit with wider bezel
    ctx.beginPath()
    ctx.arc(centerX, centerY, dialRadius, 0, 2 * Math.PI)

    // Change dial color to opaline for Explorer 2 style
    if (bezelsStyle === "explorer") {
      // Opaline dial for Explorer 2
      ctx.fillStyle = "#f0f0f0"
    } else {
      ctx.fillStyle = clockFaceBg
    }
    ctx.fill()

    // Add a subtle edge to the dial for depth
    ctx.beginPath();
    ctx.arc(centerX, centerY, dialRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = isDark ? "#222" : "#444";
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Subtle texture for the dial - adjust for opaline
    ctx.beginPath()
    ctx.arc(centerX, centerY, dialRadius, 0, 2 * Math.PI)
    if (bezelsStyle === "explorer") {
      // Create subtle opaline texture effect
      const opalineGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, dialRadius
      );
      opalineGradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
      opalineGradient.addColorStop(0.5, "rgba(240, 240, 240, 0.6)");
      opalineGradient.addColorStop(1, "rgba(220, 220, 220, 0.4)");
      ctx.fillStyle = opalineGradient;
    } else {
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
    }
    ctx.fill()
    
    // Draw hour markers - GMT Master style (round markers at 1,2,4,5,7,8,10,11 and rectangular at 3,6,9, triangle at 12)
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6
      const markerDistance = dialRadius * 0.85;
      const x = centerX + markerDistance * Math.sin(angle)
      const y = centerY - markerDistance * Math.cos(angle)
      
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

    // Draw date window if enabled
      // Position date window at 3 o'clock
      const dateAngle = Math.PI / 2; // 3 o'clock position
      const dateDistance = dialRadius * 0.7; // Slightly closer to center than hour markers
      const dateX = centerX + dateDistance * Math.sin(dateAngle);
      const dateY = centerY - dateDistance * Math.cos(dateAngle);
      
      // Date window size
      const dateWidth = radius * 0.14;
      const dateHeight = radius * 0.09;
      
      // Create date window background
      ctx.beginPath();
      ctx.rect(dateX - dateWidth/2, dateY - dateHeight/2, dateWidth, dateHeight);
      
      // Different background color based on style
      if (bezelsStyle === "explorer") {
        ctx.fillStyle = "#f0f0f0"; // Match opaline dial for Explorer
      } else {
        ctx.fillStyle = "#e0e0e0"; // Silver-white for GMT styles
      }
      ctx.fill();
      
      // Add border
      ctx.strokeStyle = hourMarkersOutlineColor;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Add the date text
      ctx.font = `bold ${radius * 0.07}px Arial, sans-serif`;
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Format the date to show just the day
      const dateNum = time.getDate().toString().padStart(2, '0');
      ctx.fillText(dateNum, dateX, dateY);
      
      // Add cyclops magnification effect (the raised glass bubble over the date)
      // This is just a visual effect - a gradient oval around the date window
      const cyclopsGradient = ctx.createRadialGradient(
        dateX, dateY, 0,
        dateX, dateY, dateWidth
      );
      
      cyclopsGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
      cyclopsGradient.addColorStop(0.7, "rgba(255, 255, 255, 0)");
      cyclopsGradient.addColorStop(0.9, "rgba(255, 255, 255, 0.15)");
      cyclopsGradient.addColorStop(1, "rgba(255, 255, 255, 0.25)");
      
      ctx.beginPath();
      ctx.ellipse(dateX, dateY, dateWidth * 0.8, dateHeight * 1.3, 0, 0, Math.PI * 2);
      ctx.fillStyle = cyclopsGradient;
      ctx.fill();


    // Small minute markers
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
    ctx.lineWidth = 1
    for (let i = 0; i < 60; i++) {
      if (i % 5 !== 0) {
        const angle = (i * Math.PI) / 30
        const minuteMarkerOuterRadius = dialRadius * 0.95;
        const minuteMarkerInnerRadius = dialRadius * 0.92;
        const x1 = centerX + minuteMarkerOuterRadius * Math.sin(angle)
        const y1 = centerY - minuteMarkerOuterRadius * Math.cos(angle)
        const x2 = centerX + minuteMarkerInnerRadius * Math.sin(angle)
        const y2 = centerY - minuteMarkerInnerRadius * Math.cos(angle)

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
    }
    
    ctx.font = `${radius * 0.09}px 'Times New Roman', serif`
    ctx.fillStyle = hourMarkersOutlineColor
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("chrono.hjf.io", centerX, centerY - dialRadius * 0.3)
    
    // "GMT-Master" text
    ctx.font = `${radius * 0.05}px 'Inter', sans-serif`
    ctx.fillStyle = "#e0e0e0"
    if (bezelsStyle === "explorer") {
      ctx.fillStyle = "#000000" // Black text for opaline dial
      ctx.fillText("Explorer II", centerX, centerY + dialRadius * 0.3)
    } else {
      ctx.fillText("GMT-Master", centerX, centerY + dialRadius * 0.3)
    }

    // Get current hours, minutes, seconds
    const hours = time.getHours() % 12
    const minutes = time.getMinutes()
    const seconds = time.getSeconds()
    const milliseconds = time.getMilliseconds()
    const fullHours = time.getHours() // Full 24-hour value for GMT hand
    
    // Calculate fractional seconds for smooth sweep (when in high-beat mode)
    const fractionalSeconds = seconds + milliseconds / 1000

    // Draw hour hand - Mercedes style
    const hourAngle = (hours * Math.PI) / 6 + (minutes * Math.PI) / (6 * 60)
    const hourHandLength = dialRadius * 0.5 // Adjusted for smaller dial
    
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
    ctx.arc(hourHandCircleX, hourHandCircleY, radius * 0.04, 0, 2 * Math.PI)
    ctx.fillStyle = handColor
    ctx.fill()

    // Draw minute hand - Sword style
    const minuteAngle = (minutes * Math.PI) / 30
    const minuteHandLength = dialRadius * 0.75
    
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
      const offset = selectedTimezone.offset
      const gmtHours = (fullHours + offset) % 24 // Use full hours instead of 12-hour format
      const gmtAngle = (gmtHours * Math.PI) / 12
      const gmtHandLength = dialRadius * 0.8
      
      // For Explorer 2, use orange GMT hand
      const currentGmtHandColor = bezelsStyle === "explorer" ? "#ff4500" : gmtHandColor
      
      ctx.beginPath()
      ctx.lineWidth = radius * 0.02
      ctx.lineCap = "butt"
      ctx.strokeStyle = currentGmtHandColor
      
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
      ctx.fillStyle = currentGmtHandColor
      ctx.fill()
    
    // Draw second hand
    const secondAngle = (fractionalSeconds * Math.PI) / 30
    const secondHandLength = dialRadius * 0.85
    
    ctx.beginPath()
    ctx.lineWidth = radius * 0.01
    ctx.lineCap = "round"
    ctx.strokeStyle = secondHandColor
    
    // Draw counterbalance
    const counterbalanceLength = dialRadius * 0.2
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

    // Update time at appropriate interval based on mode
    const updateInterval = 125 // 8 updates per second in high-beat mode
    const timer = setInterval(() => {
      const newTime = new Date()
      setTime(newTime)

      const { width, height } = canvas
      drawClock(ctx, newTime, width, height)
    }, updateInterval)

    return () => {
      clearInterval(timer)
      window.removeEventListener("resize", updateCanvasSize)
    }
  }, [time, selectedTimezone, theme, bezelsStyle])

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
    gmtDate.setHours(date.getHours() + offset)

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
                background: 'linear-gradient(180deg, #001e96 0%, #001e96 50%, #ce0314 50%, #ce0314 100%)' 
              }}
            />
            <button 
              className={`w-5 h-5 rounded-full transition-opacity ${bezelsStyle === 'batman' ? 'ring-1 ring-amber-400' : 'opacity-50'}`}
              onClick={() => setBezelsStyle('batman')}
              title="Batman bezel (black/blue)"
              style={{ 
                background: 'linear-gradient(180deg, #001e96 0%, #001e96 50%, #0a0a14 50%, #0a0a14 100%)' 
              }}
            />
            <button 
              className={`w-5 h-5 rounded-full transition-opacity ${bezelsStyle === 'gmt' ? 'ring-1 ring-amber-400' : 'opacity-50'}`}
              onClick={() => setBezelsStyle('gmt')}
              title="GMT bezel (green/black)"
              style={{ 
                background: 'linear-gradient(180deg, #006e51 0%, #006e51 50%, #0a0a14 50%, #0a0a14 100%)' 
              }}
            />
            <button 
              className={`w-5 h-5 rounded-full transition-opacity ${bezelsStyle === 'explorer' ? 'ring-1 ring-amber-400' : 'opacity-50'}`}
              onClick={() => setBezelsStyle('explorer')}
              title="Explorer II bezel (steel/opaline)"
              style={{ 
                background: '#babbbd' 
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
                <div className="text-sm font-light tracking-widest text-muted-foreground mb-1">{selectedTimezone.label}</div>
                <div className="text-3xl font-light tracking-[0.2em]">
                  {formatGmtTime(time, selectedTimezone.offset)}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-border/20 pt-4">
              <div className="flex items-center gap-2 mx-auto">
                <Globe className="h-4 w-4 text-amber-400" />
                <Select value={selectedTimezone.label} onValueChange={(value) => {
                  const timezone = timezones.find((tz) => tz.label === value)
                  if (timezone) {
                    setSelectedTimezone(timezone)
                  }
                }}>
                  <SelectTrigger className="w-32 border-amber-200/20 bg-muted/10 focus:ring-amber-400/20">
                    <SelectValue placeholder="Timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((timezone) => (
                      <SelectItem 
                        key={timezone.label} 
                        value={timezone.label}
                        className="font-light"
                      >
                        {timezone.label}
                      </SelectItem>
                    ))}
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
