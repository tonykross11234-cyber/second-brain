import type { DiaryEntry, Language } from './types'

export function todayKey(d: Date = new Date()): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function addDays(dateKey: string, delta: number): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + delta)
  return todayKey(date)
}

export function formatDateLabel(dateKey: string, language: Language): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function isToday(timestamp: number): boolean {
  return todayKey(new Date(timestamp)) === todayKey()
}

export function calculateStreak(entries: DiaryEntry[]): number {
  if (entries.length === 0) return 0
  const dates = new Set(entries.map((e) => e.date))
  let cursor = todayKey()
  if (!dates.has(cursor)) {
    cursor = addDays(cursor, -1)
    if (!dates.has(cursor)) return 0
  }
  let streak = 0
  while (dates.has(cursor)) {
    streak += 1
    cursor = addDays(cursor, -1)
  }
  return streak
}

type GreetingPeriod = 'morning' | 'afternoon' | 'evening' | 'night'

export function greetingPeriod(hour: number = new Date().getHours()): GreetingPeriod {
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 23) return 'evening'
  return 'night'
}
