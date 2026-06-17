import type { DiaryEntry, Language, Profile, Task } from './types'
import type { FitnessDay, FitnessGoals } from '../store/useFitnessStore'
import { todayKey } from './date-utils'

export function summarizeEntries(entries: DiaryEntry[]): string {
  const recent = [...entries].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 14)
  if (recent.length === 0) return '(no entries yet)'
  return recent
    .map((e) => {
      const text = [e.did, e.plans, e.thoughts].filter(Boolean).join(' | ')
      return `- ${e.date}: ${text || '(empty)'}`
    })
    .join('\n')
}

function summarizeTasks(tasks: Task[]): string {
  if (tasks.length === 0) return '(no tasks yet)'
  return tasks.map((t) => `- (id=${t.id}) [${t.done ? 'x' : ' '}] ${t.title} [${t.priority}]`).join('\n')
}

function summarizeFitness(today: FitnessDay, goals: FitnessGoals): string {
  return [
    `Calories: ${today.calories} / ${goals.calories} kcal`,
    `Protein: ${today.proteinG} / ${goals.proteinG} g`,
    `Water: ${today.waterMl} / ${goals.waterMl} ml`,
  ].join(', ')
}

export function buildSystemPrompt(
  language: Language,
  profile: Profile,
  entries: DiaryEntry[],
  tasks: Task[],
  todayFitness?: FitnessDay,
  fitnessGoals?: FitnessGoals
): string {
  const langLine =
    language === 'ru'
      ? 'Отвечай по-русски, тёплым и дружелюбным тоном.'
      : 'Respond in English, in a warm and friendly tone.'

  const lines = [
    `You are the AI assistant inside "Second Brain"${profile.name ? ` for ${profile.name}` : ''}.`,
    langLine,
    `Today's date: ${todayKey()}.`,
    'You can answer any question the user has. You also have access to their personal data below and can use tools to update it.',
    '',
    'Recent journal entries:',
    summarizeEntries(entries),
    '',
    'Tasks:',
    summarizeTasks(tasks),
  ]

  if (todayFitness && fitnessGoals) {
    lines.push('', `Today's fitness: ${summarizeFitness(todayFitness, fitnessGoals)}`)
  }

  if (profile.weightKg || profile.heightCm || profile.age) {
    const bio = [
      profile.weightKg ? `weight ${profile.weightKg}kg` : null,
      profile.heightCm ? `height ${profile.heightCm}cm` : null,
      profile.age ? `age ${profile.age}` : null,
    ].filter(Boolean).join(', ')
    lines.push('', `User biometrics: ${bio}`)
  }

  return lines.join('\n')
}
