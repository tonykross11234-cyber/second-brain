export type Priority = 'high' | 'medium' | 'low'
export type Theme = 'light' | 'dark' | 'system'
export type Language = 'ru' | 'en'

export interface DiaryEntry {
  id: string
  date: string // YYYY-MM-DD, one entry per day
  did: string
  plans: string
  thoughts: string
  createdAt: number
  updatedAt: number
}

export interface Task {
  id: string
  title: string
  priority: Priority
  done: boolean
  createdAt: number
  completedAt?: number
}

export type TabKey = 'home' | 'fitness' | 'chat' | 'journal' | 'profile'

export interface Profile {
  name: string
  weightKg: number | null
  heightCm: number | null
  age: number | null
  pinEnabled: boolean
  pinCode: string | null
  pinSetupOffered: boolean
}

export interface ChatTurn {
  id: string
  role: 'user' | 'assistant' | 'action'
  text: string
  createdAt: number
}

export interface DailyMotivation {
  date: string
  text: string
}
