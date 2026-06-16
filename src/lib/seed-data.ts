import { addDays, todayKey } from './date-utils'
import type { DiaryEntry, Task } from './types'

function makeEntry(daysAgo: number, did: string, plans: string, thoughts: string): DiaryEntry {
  const date = addDays(todayKey(), -daysAgo)
  const ts = Date.now() - daysAgo * 86_400_000
  return {
    id: crypto.randomUUID(),
    date,
    did,
    plans,
    thoughts,
    createdAt: ts,
    updatedAt: ts,
  }
}

export function buildSeedEntries(): DiaryEntry[] {
  return [
    makeEntry(
      3,
      'Started planning the Second Brain app. Sketched the five sections on paper.',
      'Finish the onboarding flow and pick a color palette.',
      'Excited about this one — feels like a project that could actually stick.'
    ),
    makeEntry(
      2,
      'Worked on the onboarding flow and picked an indigo color palette.',
      'Write the task list feature and add priority levels.',
      'A bit tired today, but happy with the progress.'
    ),
    makeEntry(
      1,
      'Built the task list feature with high, medium and low priority.',
      'Polish the AI insights screen and test on my phone.',
      'Realized I keep putting off the AI insights work — should tackle it first tomorrow.'
    ),
    makeEntry(
      0,
      'Tested the app on my phone and fixed a few layout bugs.',
      'Write a few more journal entries so search has something to find.',
      'Productive day. Good momentum heading into the weekend.'
    ),
  ]
}

export function buildSeedTasks(): Task[] {
  const now = Date.now()
  const day = 86_400_000
  return [
    {
      id: crypto.randomUUID(),
      title: 'Finish AI insights screen',
      priority: 'high',
      done: false,
      createdAt: now - 2 * day,
    },
    {
      id: crypto.randomUUID(),
      title: 'Test app on iPhone Safari',
      priority: 'high',
      done: true,
      createdAt: now - 3 * day,
      completedAt: now - 1 * day,
    },
    {
      id: crypto.randomUUID(),
      title: 'Pick app icon design',
      priority: 'medium',
      done: true,
      createdAt: now - 3 * day,
      completedAt: now - 2 * day,
    },
    {
      id: crypto.randomUUID(),
      title: 'Write a few more journal entries',
      priority: 'medium',
      done: false,
      createdAt: now - 1 * day,
    },
    {
      id: crypto.randomUUID(),
      title: 'Read a chapter of a book',
      priority: 'low',
      done: false,
      createdAt: now - 1 * day,
    },
  ]
}
