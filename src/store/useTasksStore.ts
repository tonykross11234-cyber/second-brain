import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Priority, Task } from '../lib/types'
import { todayKey } from '../lib/date-utils'

interface TasksState {
  tasks: Task[]
  addTask: (title: string, priority: Priority, date?: string) => void
  toggleDone: (id: string) => void
  deleteTask: (id: string) => void
  updateTask: (id: string, changes: Partial<Pick<Task, 'title' | 'priority' | 'done'>>) => void
  getTasksByDate: (date: string) => Task[]
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (title, priority, date) => {
        const task: Task = {
          id: crypto.randomUUID(),
          title,
          priority,
          done: false,
          createdAt: Date.now(),
          date: date ?? todayKey(),
        }
        set((state) => ({ tasks: [task, ...state.tasks] }))
      },
      toggleDone: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, done: !t.done, completedAt: !t.done ? Date.now() : undefined }
              : t
          ),
        }))
      },
      deleteTask: (id) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }))
      },
      updateTask: (id, changes) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  ...changes,
                  completedAt:
                    changes.done === undefined ? t.completedAt : changes.done ? Date.now() : undefined,
                }
              : t
          ),
        }))
      },
      getTasksByDate: (date) => {
        return get().tasks.filter((t) => (t.date ?? todayKey()) === date)
      },
    }),
    { name: 'second-brain:tasks' }
  )
)
