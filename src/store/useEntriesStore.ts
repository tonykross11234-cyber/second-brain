import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DiaryEntry } from '../lib/types'

interface EntriesState {
  entries: DiaryEntry[]
  upsertToday: (date: string, fields: Partial<Pick<DiaryEntry, 'did' | 'plans' | 'thoughts'>>) => void
}

export const useEntriesStore = create<EntriesState>()(
  persist(
    (set) => ({
      entries: [],
      upsertToday: (date, fields) => {
        const now = Date.now()
        set((state) => {
          const existing = state.entries.find((e) => e.date === date)
          if (existing) {
            return {
              entries: state.entries.map((e) =>
                e.date === date ? { ...e, ...fields, updatedAt: now } : e
              ),
            }
          }
          const newEntry: DiaryEntry = {
            id: crypto.randomUUID(),
            date,
            did: fields.did ?? '',
            plans: fields.plans ?? '',
            thoughts: fields.thoughts ?? '',
            createdAt: now,
            updatedAt: now,
          }
          return { entries: [...state.entries, newEntry] }
        })
      },
    }),
    { name: 'second-brain:entries' }
  )
)
