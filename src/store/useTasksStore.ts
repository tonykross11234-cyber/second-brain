import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Priority, Task } from '../lib/types'

interface TasksState {
  tasks: Task[]
  addTask: (title: string, priority: Priority) => void
  toggleDone: (id: string) => void
  deleteTask: (id: string) => void
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (title, priority) => {
        const task: Task = {
          id: crypto.randomUUID(),
          title,
          priority,
          done: false,
          createdAt: Date.now(),
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
    }),
    { name: 'second-brain:tasks' }
  )
)
