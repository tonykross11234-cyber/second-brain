import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { todayKey } from '../lib/date-utils'

export interface FitnessDay {
  date: string
  calories: number
  proteinG: number
  waterMl: number
  workout?: number
}

export interface FitnessGoals {
  calories: number
  proteinG: number
  waterMl: number
}

interface FitnessState {
  days: FitnessDay[]
  goals: FitnessGoals
  getTodayData: () => FitnessDay
  addToday: (delta: Partial<Omit<FitnessDay, 'date'>>) => void
  setTodayField: (data: Partial<Omit<FitnessDay, 'date'>>) => void
  addWorkout: () => void
  setGoals: (goals: Partial<FitnessGoals>) => void
  reset: () => void
}

const DEFAULT_GOALS: FitnessGoals = {
  calories: 2000,
  proteinG: 150,
  waterMl: 2000,
}

function emptyDay(date: string): FitnessDay {
  return { date, calories: 0, proteinG: 0, waterMl: 0 }
}

export const useFitnessStore = create<FitnessState>()(
  persist(
    (set, get) => ({
      days: [],
      goals: DEFAULT_GOALS,

      getTodayData: () => {
        const date = todayKey()
        return get().days.find((d) => d.date === date) ?? emptyDay(date)
      },

      addToday: (delta) => {
        const date = todayKey()
        set((state) => {
          const existing = state.days.find((d) => d.date === date)
          if (existing) {
            return {
              days: state.days.map((d) =>
                d.date === date
                  ? {
                      ...d,
                      calories: d.calories + (delta.calories ?? 0),
                      proteinG: d.proteinG + (delta.proteinG ?? 0),
                      waterMl: d.waterMl + (delta.waterMl ?? 0),
                    }
                  : d
              ),
            }
          }
          return {
            days: [
              ...state.days,
              {
                date,
                calories: delta.calories ?? 0,
                proteinG: delta.proteinG ?? 0,
                waterMl: delta.waterMl ?? 0,
              },
            ],
          }
        })
      },

      setTodayField: (data) => {
        const date = todayKey()
        set((state) => {
          const existing = state.days.find((d) => d.date === date)
          if (existing) {
            return { days: state.days.map((d) => (d.date === date ? { ...d, ...data } : d)) }
          }
          return { days: [...state.days, { ...emptyDay(date), ...data }] }
        })
      },

      addWorkout: () => {
        const date = todayKey()
        set((state) => {
          const existing = state.days.find((d) => d.date === date)
          if (existing) {
            return {
              days: state.days.map((d) =>
                d.date === date ? { ...d, workout: (d.workout ?? 0) + 1 } : d
              ),
            }
          }
          return { days: [...state.days, { ...emptyDay(date), workout: 1 }] }
        })
      },

      setGoals: (goals) => {
        set((state) => ({ goals: { ...state.goals, ...goals } }))
      },

      reset: () => set({ days: [], goals: DEFAULT_GOALS }),
    }),
    { name: 'second-brain:fitness' }
  )
)
