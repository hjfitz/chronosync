"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Clock, Globe } from "lucide-react"

export function CombinedTimeDisplay() {
  const [time, setTime] = useState(new Date())
  const [showGmtHand, setShowGmtHand] = useState(true)
  const [selectedTimezone, setSelectedTimezone] = useState("GMT+0")
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

    // Draw clock face
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.fillStyle = "#ffffff"
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = "#e2e8f0"
    ctx.stroke()

    // Draw hour markers
    ctx.lineWidth = 2
    ctx.strokeStyle = "#64748b"
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6
      const x1 = centerX + radius * 0.9 * Math.sin(angle)
      const y1 = centerY - radius * 0.9 * Math.cos(angle)
      const x2 = centerX + radius * 0.8 * Math.sin(angle)
      const y2 = centerY - radius * 0.8 * Math.cos(angle)

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    // Draw minute markers
    ctx.lineWidth = 1
    ctx.strokeStyle = "#94a3b8"
    for (let i = 0; i < 60; i++) {
      if (i % 5 !== 0) {
        // Skip hour markers
        const angle = (i * Math.PI) / 30
        const x1 = centerX + radius * 0.95 * Math.sin(angle)
        const y1 = centerY - radius * 0.95 * Math.cos(angle)
        const x2 = centerX + radius * 0.9 * Math.sin(angle)
        const y2 = centerY - radius * 0.9 * Math.cos(angle)

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
    }

    // Draw hour numbers
    ctx.font = `${radius * 0.15}px Arial`
    ctx.fillStyle = "#1e293b"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    for (let i = 1; i <= 12; i++) {
      const angle = (i * Math.PI) / 6
      const x = centerX + radius * 0.7 * Math.sin(angle)
      const y = centerY - radius * 0.7 * Math.cos(angle)
      ctx.fillText(i.toString(), x, y)
    }

    // Get current hours, minutes, seconds
    const hours = time.getHours() % 12
    const minutes = time.getMinutes()
    const seconds = time.getSeconds()

    // Draw hour hand
    ctx.beginPath()
    ctx.lineWidth = radius * 0.04
    ctx.lineCap = "round"
    ctx.strokeStyle = "#334155"

    const hourAngle = (hours * Math.PI) / 6 + (minutes * Math.PI) / (6 * 60)
    const hourHandLength = radius * 0.5

    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + hourHandLength * Math.sin(hourAngle), centerY - hourHandLength * Math.cos(hourAngle))
    ctx.stroke()

    // Draw minute hand
    ctx.beginPath()
    ctx.lineWidth = radius * 0.025
    ctx.lineCap = "round"
    ctx.strokeStyle = "#475569"

    const minuteAngle = (minutes * Math.PI) / 30
    const minuteHandLength = radius * 0.7

    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + minuteHandLength * Math.sin(minuteAngle), centerY - minuteHandLength * Math.cos(minuteAngle))
    ctx.stroke()

    // Draw second hand
    ctx.beginPath()
    ctx.lineWidth = radius * 0.01
    ctx.lineCap = "round"
    ctx.strokeStyle = "#ef4444"

    const secondAngle = (seconds * Math.PI) / 30
    const secondHandLength = radius * 0.8

    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + secondHandLength * Math.sin(secondAngle), centerY - secondHandLength * Math.cos(secondAngle))
    ctx.stroke()

    // Draw GMT hand if enabled
    if (showGmtHand) {
      const offset = getTimezoneOffset(selectedTimezone)
      const gmtHours = (hours + offset) % 12
      const gmtAngle = (gmtHours * Math.PI) / 6 + (minutes * Math.PI) / (6 * 60)
      const gmtHandLength = radius * 0.4

      ctx.beginPath()
      ctx.lineWidth = radius * 0.03
      ctx.lineCap = "round"
      ctx.strokeStyle = "#8b5cf6" // Purple for GMT hand

      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX + gmtHandLength * Math.sin(gmtAngle), centerY - gmtHandLength * Math.cos(gmtAngle))
      ctx.stroke()
    }

    // Draw center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.05, 0, 2 * Math.PI)
    ctx.fillStyle = "#1e293b"
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
  }, [time, showGmtHand, selectedTimezone])

  // Format digital time
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const seconds = date.getSeconds().toString().padStart(2, "0")
    return `${hours}:${minutes}:${seconds}`
  }

  // Format GMT time
  const formatGmtTime = (date: Date, offset: number) => {
    const localDate = new Date(date)
    const userOffset = (localDate.getTimezoneOffset() * -1) / 60 // Convert to hours
    localDate.setHours(localDate.getHours() - userOffset + offset)

    const hours = localDate.getHours().toString().padStart(2, "0")
    const minutes = localDate.getMinutes().toString().padStart(2, "0")
    const seconds = localDate.getSeconds().toString().padStart(2, "0")

    return `${hours}:${minutes}:${seconds}`
  }

  const timezones = [
    { label: "GMT-12", value: "GMT-12" },
    { label: "GMT-11", value: "GMT-11" },
    { label: "GMT-10", value: "GMT-10" },
    { label: "GMT-9", value: "GMT-9" },
    { label: "GMT-8", value: "GMT-8" },
    { label: "GMT-7", value: "GMT-7" },
    { label: "GMT-6", value: "GMT-6" },
    { label: "GMT-5", value: "GMT-5" },
    { label: "GMT-4", value: "GMT-4" },
    { label: "GMT-3", value: "GMT-3" },
    { label: "GMT-2", value: "GMT-2" },
    { label: "GMT-1", value: "GMT-1" },
    { label: "GMT+0", value: "GMT+0" },
    { label: "GMT+1", value: "GMT+1" },
    { label: "GMT+2", value: "GMT+2" },
    { label: "GMT+3", value: "GMT+3" },
    { label: "GMT+4", value: "GMT+4" },
    { label: "GMT+5", value: "GMT+5" },
    { label: "GMT+6", value: "GMT+6" },
    { label: "GMT+7", value: "GMT+7" },
    { label: "GMT+8", value: "GMT+8" },
    { label: "GMT+9", value: "GMT+9" },
    { label: "GMT+10", value: "GMT+10" },
    { label: "GMT+11", value: "GMT+11" },
    { label: "GMT+12", value: "GMT+12" },
  ]

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-rose-500 to-rose-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <CardTitle>Time Display</CardTitle>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="show-gmt" className="text-white text-sm">
                GMT Hand
              </Label>
              <Switch
                id="show-gmt"
                checked={showGmtHand}
                onCheckedChange={setShowGmtHand}
                className="data-[state=checked]:bg-white data-[state=checked]:text-rose-600"
              />
            </div>
            <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
              <SelectTrigger className="w-[110px] bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((timezone) => (
                  <SelectItem key={timezone.value} value={timezone.value}>
                    {timezone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-[400px]">
        <div className="relative flex-1">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <div className="text-xl font-medium tabular-nums">{formatTime(time)}</div>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-slate-500" />
            <div className="text-xl font-medium tabular-nums">
              {formatGmtTime(time, getTimezoneOffset(selectedTimezone))}
            </div>
            <span className="text-sm text-slate-500">{selectedTimezone}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
