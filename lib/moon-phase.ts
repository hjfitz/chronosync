interface MoonPhaseResult {
  phase: string
  percentage: number
}

export function calculateMoonPhase(date: Date): MoonPhaseResult {
  // Algorithm to calculate moon phase
  // Based on a simplified version of the calculation

  // Get days since Jan 1, 1970
  const daysSince1970 = Math.floor(date.getTime() / 86400000)

  // Moon cycle is approximately 29.53 days
  const moonCycle = 29.53

  // Jan 6, 2000 was a new moon
  const daysSinceKnownNewMoon = daysSince1970 - 10957 // Days since Jan 6, 2000

  // Calculate current position in the lunar cycle (0 to 1)
  const position = (daysSinceKnownNewMoon % moonCycle) / moonCycle

  // Convert to percentage (0 to 100)
  const percentage = Math.round(position * 100)

  // Determine the moon phase name
  let phase: string

  if (percentage < 2) {
    phase = "New Moon"
  } else if (percentage < 23) {
    phase = "Waxing Crescent"
  } else if (percentage < 27) {
    phase = "First Quarter"
  } else if (percentage < 48) {
    phase = "Waxing Gibbous"
  } else if (percentage < 52) {
    phase = "Full Moon"
  } else if (percentage < 73) {
    phase = "Waning Gibbous"
  } else if (percentage < 77) {
    phase = "Last Quarter"
  } else if (percentage < 98) {
    phase = "Waning Crescent"
  } else {
    phase = "New Moon"
  }

  return { phase, percentage }
}
