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

export type TabKey = 'today' | 'entries' | 'ai' | 'tasks' | 'settings'
