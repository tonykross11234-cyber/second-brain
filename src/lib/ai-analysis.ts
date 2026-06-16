import { addDays, todayKey } from './date-utils'
import type { DiaryEntry, Language, Task } from './types'

export interface InsightCard {
  id: string
  icon: string
  title: string
  body: string
}

const STOPWORDS: Record<Language, Set<string>> = {
  en: new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'to', 'of', 'in', 'on', 'for', 'with',
    'my', 'i', 'is', 'was', 'were', 'it', 'this', 'that', 'at', 'as', 'be',
    'been', 'am', 'are', 'so', 'just', 'got', 'get', 'today', 'tomorrow',
    'yesterday', 'a bit', 'all', 'few', 'more',
  ]),
  ru: new Set([
    'и', 'в', 'на', 'с', 'по', 'для', 'что', 'это', 'я', 'мне', 'мой', 'моя',
    'моё', 'мои', 'бы', 'же', 'как', 'а', 'но', 'или', 'к', 'у', 'от', 'до',
    'за', 'из', 'не', 'да', 'ли', 'то', 'когда', 'есть', 'был', 'была',
    'были', 'будет', 'уже', 'еще', 'ещё', 'сегодня', 'завтра', 'вчера',
  ]),
}

const TONE_WORDS: Record<Language, { positive: string[]; negative: string[] }> = {
  en: {
    positive: ['happy', 'good', 'great', 'excited', 'productiv', 'proud', 'calm', 'grateful', 'motivat', 'progress'],
    negative: ['tired', 'stress', 'frustrat', 'anxious', 'overwhelm', 'sad', 'stuck', 'worri', 'bad', 'behind'],
  },
  ru: {
    positive: ['рад', 'хорошо', 'отлично', 'продуктив', 'горд', 'спокой', 'благодар', 'мотивац', 'прогресс', 'счастлив'],
    negative: ['устал', 'стресс', 'тревож', 'перегруж', 'грустно', 'застря', 'волну', 'плохо', 'отстаю'],
  },
}

function tokenize(text: string, language: Language): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS[language].has(w))
}

function topKeywords(entries: DiaryEntry[], language: Language, limit = 3): string[] {
  const freq = new Map<string, number>()
  for (const e of entries) {
    for (const w of tokenize(`${e.did} ${e.thoughts}`, language)) {
      freq.set(w, (freq.get(w) ?? 0) + 1)
    }
  }
  return [...freq.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word)
}

function computeStreak(entries: DiaryEntry[]): number {
  const dates = new Set(entries.map((e) => e.date))
  let streak = 0
  let cursor = todayKey()
  while (dates.has(cursor)) {
    streak += 1
    cursor = addDays(cursor, -1)
  }
  return streak
}

function followThroughRatio(entries: DiaryEntry[], language: Language): number | null {
  const today = todayKey()
  const yesterday = addDays(today, -1)
  const todayEntry = entries.find((e) => e.date === today)
  const yesterdayEntry = entries.find((e) => e.date === yesterday)
  if (!todayEntry?.did || !yesterdayEntry?.plans) return null
  const planWords = new Set(tokenize(yesterdayEntry.plans, language))
  if (planWords.size === 0) return null
  const didWords = new Set(tokenize(todayEntry.did, language))
  let overlap = 0
  for (const w of planWords) if (didWords.has(w)) overlap += 1
  return overlap / planWords.size
}

function toneSignal(entries: DiaryEntry[], language: Language): 'positive' | 'negative' | 'neutral' {
  const recent = entries.slice(-3)
  const words = recent.flatMap((e) => tokenize(e.thoughts, language))
  const { positive, negative } = TONE_WORDS[language]
  let pos = 0
  let neg = 0
  for (const w of words) {
    if (positive.some((p) => w.startsWith(p))) pos += 1
    if (negative.some((n) => w.startsWith(n))) neg += 1
  }
  if (pos === neg) return 'neutral'
  return pos > neg ? 'positive' : 'negative'
}

function taskStats(tasks: Task[]) {
  const total = tasks.length
  const done = tasks.filter((t) => t.done).length
  const completionRate = total === 0 ? 0 : Math.round((done / total) * 100)
  const pendingHigh = tasks.filter((t) => !t.done && t.priority === 'high').length
  return { total, done, completionRate, pendingHigh }
}

function pick<T>(candidates: T[], seed: number): T {
  return candidates[Math.abs(seed) % candidates.length]
}

export function generateInsights(
  entries: DiaryEntry[],
  tasks: Task[],
  language: Language,
  seed: number
): InsightCard[] {
  if (entries.length === 0) return []

  const keywords = topKeywords(entries, language)
  const streak = computeStreak(entries)
  const stats = taskStats(tasks)
  const followThrough = followThroughRatio(entries, language)
  const tone = toneSignal(entries, language)

  const cards: InsightCard[] = []

  const patternBody =
    keywords.length > 0
      ? pick(
          language === 'ru'
            ? [
                `Слово «${keywords[0]}» встречается в твоих записях снова и снова — похоже, это занимает много мыслей.`,
                `Заметный паттерн: «${keywords[0]}» постоянно всплывает в записях. Может, стоит превратить это в осознанную цель?`,
              ]
            : [
                `You've mentioned "${keywords[0]}" multiple times — it looks like it's been on your mind a lot lately.`,
                `A clear pattern: "${keywords[0]}" keeps showing up across your entries. Worth turning into a deliberate goal?`,
              ],
          seed
        )
      : language === 'ru'
        ? 'Сделай ещё несколько записей — и здесь начнут проявляться паттерны.'
        : "Write a few more entries and I'll start spotting patterns."

  cards.push({
    id: 'pattern',
    icon: '🧩',
    title: language === 'ru' ? 'Паттерн' : 'Pattern',
    body: patternBody,
  })

  const priorityBody =
    stats.pendingHigh > 0
      ? language === 'ru'
        ? `У тебя ${stats.pendingHigh} невыполненных задач с высоким приоритетом. Закрыть хотя бы одну сегодня — и завтра станет легче.`
        : `You have ${stats.pendingHigh} high-priority task${stats.pendingHigh > 1 ? 's' : ''} still open. Clearing just one today would make tomorrow easier.`
      : stats.total > 0
        ? language === 'ru'
          ? 'Срочных задач сейчас нет — хороший момент спланировать следующий большой шаг.'
          : 'No open high-priority tasks right now — a good moment to plan your next big push.'
        : language === 'ru'
          ? 'Добавь свою первую задачу, чтобы получить совет по приоритетам.'
          : 'Add your first task to get a priority tip here.'

  cards.push({
    id: 'priority',
    icon: '🎯',
    title: language === 'ru' ? 'Приоритет' : 'Priority',
    body: priorityBody,
  })

  const progressBody =
    stats.total > 0
      ? pick(
          language === 'ru'
            ? [
                `Серия записей подряд: ${streak} ${streak === 1 ? 'день' : 'дня'}. Выполнено ${stats.completionRate}% задач — устойчивый темп.`,
                `${stats.done} из ${stats.total} задач выполнено (${stats.completionRate}%). Продолжай в том же духе.`,
              ]
            : [
                `You're on a ${streak}-day writing streak and have completed ${stats.completionRate}% of your tasks. Steady pace.`,
                `${stats.done} of ${stats.total} tasks done (${stats.completionRate}%). Keep the momentum going.`,
              ],
          seed + 1
        )
      : language === 'ru'
        ? `Серия записей подряд: ${streak} ${streak === 1 ? 'день' : 'дня'}. Добавь задачи, чтобы видеть прогресс по ним.`
        : `You're on a ${streak}-day writing streak. Add some tasks to start tracking progress there too.`

  cards.push({
    id: 'progress',
    icon: '📈',
    title: language === 'ru' ? 'Прогресс' : 'Progress',
    body: progressBody,
  })

  let tipBody: string
  if (followThrough !== null) {
    tipBody =
      followThrough >= 0.5
        ? language === 'ru'
          ? 'Ты выполнил большую часть из того, что планировал вчера — такая стабильность накапливается со временем.'
          : 'You followed through on most of what you planned yesterday — that kind of consistency compounds.'
        : language === 'ru'
          ? 'Вчерашние планы и сегодняшние дела почти не пересекаются — это нормально, но стоит сверить приоритеты.'
          : "Yesterday's plan and today's actions don't overlap much — totally normal, but worth a quick priority check-in."
  } else if (tone === 'positive') {
    tipBody =
      language === 'ru'
        ? 'Последние записи звучат позитивно — хороший момент взяться за что-то посложнее.'
        : 'Your recent entries have a positive tone — a good time to take on something a bit harder.'
  } else if (tone === 'negative') {
    tipBody =
      language === 'ru'
        ? 'В последних записях чувствуется напряжение. Может, стоит облегчить план на завтра?'
        : "Things have felt a bit heavy in your recent entries. Consider lightening tomorrow's plan."
  } else {
    tipBody =
      language === 'ru'
        ? 'Продолжай писать каждый день — чем больше записей, тем точнее становятся советы.'
        : 'Keep the entries coming — the more you write, the sharper these insights get.'
  }

  cards.push({
    id: 'tip',
    icon: '💡',
    title: language === 'ru' ? 'Совет' : 'Tip',
    body: tipBody,
  })

  return cards
}

export function dailySeed(date: string): number {
  let hash = 0
  for (let i = 0; i < date.length; i++) {
    hash = (hash * 31 + date.charCodeAt(i)) | 0
  }
  return hash
}
