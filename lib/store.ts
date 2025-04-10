"use client"

import { create } from "zustand"

// We're no longer using this store since we've moved the state to the components directly
// Keeping this file for reference or future use

interface WatchState {
  showSeconds: boolean
  setShowSeconds: (show: boolean) => void

  showDate: boolean
  setShowDate: (show: boolean) => void

  showDay: boolean
  setShowDay: (show: boolean) => void

  showMoonPhase: boolean
  setShowMoonPhase: (show: boolean) => void

  showSecondTimezone: boolean
  setShowSecondTimezone: (show: boolean) => void

  secondTimezone: string
  setSecondTimezone: (timezone: string) => void
}

export const useWatchStore = create<WatchState>((set) => ({
  showSeconds: true,
  setShowSeconds: (show) => set({ showSeconds: show }),

  showDate: true,
  setShowDate: (show) => set({ showDate: show }),

  showDay: true,
  setShowDay: (show) => set({ showDay: show }),

  showMoonPhase: true,
  setShowMoonPhase: (show) => set({ showMoonPhase: show }),

  showSecondTimezone: true,
  setShowSecondTimezone: (show) => set({ showSecondTimezone: show }),

  secondTimezone: "GMT+0",
  setSecondTimezone: (timezone) => set({ secondTimezone: timezone }),
}))
