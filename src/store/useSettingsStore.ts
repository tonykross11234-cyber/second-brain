import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Language, Theme } from '../lib/types'

interface SettingsState {
  theme: Theme
  language: Language
  hasSeeded: boolean
  setTheme: (theme: Theme) => void
  setLanguage: (language: Language) => void
  markSeeded: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'en',
      hasSeeded: false,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      markSeeded: () => set({ hasSeeded: true }),
    }),
    { name: 'second-brain:settings' }
  )
)
