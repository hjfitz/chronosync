interface MoonPhaseResult {
  phase: string
  percentage: number
}

export function calculateMoonPhase(date: Date): MoonPhaseResult {
  // Algorithm to calculate moon phase
  // Based on a simplified version of the calculation

  // Constants
  const LUNAR_CYCLE_DAYS = 29.53;
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  // Reference New Moon: January 6, 2000, 00:00:00 UTC
  // We use Date.UTC to avoid timezone issues
  const KNOWN_NEW_MOON_MS = Date.UTC(2000, 0, 6); // Month is 0-indexed (0 = January)
  const EPOCH_MS = Date.UTC(1970, 0, 1);

  // Calculate the number of days from epoch to the known new moon date
  const DAYS_OFFSET = Math.floor((KNOWN_NEW_MOON_MS - EPOCH_MS) / MS_PER_DAY); // Should calculate to 10962

  // Get current time in UTC milliseconds and convert to days since epoch
  const currentMsUtc = date.getTime(); // getTime() is already UTC
  const daysSinceEpoch = Math.floor(currentMsUtc / MS_PER_DAY);

  // Calculate days since the known new moon
  const daysSinceKnownNewMoon = daysSinceEpoch - DAYS_OFFSET;

  // Calculate current position in the lunar cycle (0 to 1)
  // Ensure the result is always positive using modulo arithmetic
  const position = ((daysSinceKnownNewMoon % LUNAR_CYCLE_DAYS) + LUNAR_CYCLE_DAYS) % LUNAR_CYCLE_DAYS / LUNAR_CYCLE_DAYS;

  // Convert to percentage (0 to 100)
  const percentage = Math.round(position * 100);

  // Determine the moon phase name
  let phase: string

  if (percentage < 3 || percentage >= 97) {
    phase = "New Moon"
  } else if (percentage < 22) {
    phase = "Waxing Crescent"
  } else if (percentage < 28) {
    phase = "First Quarter"
  } else if (percentage < 47) {
    phase = "Waxing Gibbous"
  } else if (percentage < 53) {
    phase = "Full Moon"
  } else if (percentage < 72) {
    phase = "Waning Gibbous"
  } else if (percentage < 78) {
    phase = "Last Quarter"
  } else {
    phase = "Waning Crescent"
  }

  return { phase, percentage }
}
