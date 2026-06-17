import type { DiaryEntry, Language, Profile, Task } from './types'
import { todayKey } from './date-utils'

export function summarizeEntries(entries: DiaryEntry[]): string {
  const recent = [...entries].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 14)
  if (recent.length === 0) return '(no entries yet)'
  return recent
    .map((e) => `- ${e.date}: did="${e.did}" plans="${e.plans}" thoughts="${e.thoughts}"`)
    .join('\n')
}

function summarizeTasks(tasks: Task[]): string {
  if (tasks.length === 0) return '(no tasks yet)'
  return tasks.map((t) => `- (id=${t.id}) [${t.done ? 'x' : ' '}] ${t.title} [${t.priority}]`).join('\n')
}

export function buildSystemPrompt(
  language: Language,
  profile: Profile,
  entries: DiaryEntry[],
  tasks: Task[]
): string {
  const langLine =
    language === 'ru'
      ? 'Отвечай по-русски, тёплым и поддерживающим тоном.'
      : 'Respond in English, in a warm and supportive tone.'

  return [
    `You are the AI assistant inside "Second Brain", a personal journal app${profile.name ? ` for ${profile.name}` : ''}.`,
    langLine,
    `Today's date: ${todayKey()}.`,
    'You can see the recent journal entries and current tasks below. Use the provided tools to add, update, or delete tasks, and to create or update the journal entry for today, whenever the user asks you to.',
    '',
    'Recent journal entries:',
    summarizeEntries(entries),
    '',
    'Current tasks:',
    summarizeTasks(tasks),
  ].join('\n')
}
