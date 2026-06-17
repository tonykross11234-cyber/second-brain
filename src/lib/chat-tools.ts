import type { ToolDef } from './anthropic-client'
import { useTasksStore } from '../store/useTasksStore'
import { useEntriesStore } from '../store/useEntriesStore'
import { todayKey } from './date-utils'

export const CHAT_TOOLS: ToolDef[] = [
  {
    name: 'add_task',
    description: "Add a new task/to-do item to the user's task list.",
    input_schema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Short task title' },
        priority: { type: 'string', enum: ['high', 'medium', 'low'], description: 'Defaults to medium' },
      },
      required: ['title'],
    },
  },
  {
    name: 'update_task',
    description: 'Update an existing task — change its title, priority, or done status. Use the task id shown in the current task list.',
    input_schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        priority: { type: 'string', enum: ['high', 'medium', 'low'] },
        done: { type: 'boolean' },
      },
      required: ['id'],
    },
  },
  {
    name: 'delete_task',
    description: 'Delete a task by id.',
    input_schema: {
      type: 'object',
      properties: { id: { type: 'string' } },
      required: ['id'],
    },
  },
  {
    name: 'update_journal_entry',
    description:
      "Create or update today's journal entry. Only set the fields the user actually mentioned — omit the rest so they stay unchanged.",
    input_schema: {
      type: 'object',
      properties: {
        did: { type: 'string', description: 'What the user did today' },
        plans: { type: 'string', description: "What the user plans next" },
        thoughts: { type: 'string', description: "The user's thoughts/mood" },
      },
    },
  },
]

export function executeChatTool(name: string, input: Record<string, unknown>): string {
  switch (name) {
    case 'add_task': {
      const title = input.title as string | undefined
      if (!title) return 'Error: title is required'
      const priority = (input.priority as 'high' | 'medium' | 'low' | undefined) ?? 'medium'
      useTasksStore.getState().addTask(title, priority)
      return `Added task "${title}"`
    }
    case 'update_task': {
      const id = input.id as string | undefined
      if (!id) return 'Error: id is required'
      const changes = {
        ...(input.title !== undefined && { title: input.title as string }),
        ...(input.priority !== undefined && { priority: input.priority as 'high' | 'medium' | 'low' }),
        ...(input.done !== undefined && { done: input.done as boolean }),
      }
      useTasksStore.getState().updateTask(id, changes)
      return `Updated task ${id}`
    }
    case 'delete_task': {
      const id = input.id as string | undefined
      if (!id) return 'Error: id is required'
      useTasksStore.getState().deleteTask(id)
      return `Deleted task ${id}`
    }
    case 'update_journal_entry': {
      const did = input.did as string | undefined
      const plans = input.plans as string | undefined
      const thoughts = input.thoughts as string | undefined
      useEntriesStore.getState().upsertToday(todayKey(), { did, plans, thoughts })
      return "Saved today's journal entry"
    }
    default:
      return `Unknown tool: ${name}`
  }
}
