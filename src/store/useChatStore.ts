import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChatTurn, DailyMotivation } from '../lib/types'

interface ChatState {
  messages: ChatTurn[]
  motivation: DailyMotivation | null
  addMessage: (role: ChatTurn['role'], text: string) => void
  clearHistory: () => void
  setMotivation: (motivation: DailyMotivation) => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      motivation: null,
      addMessage: (role, text) => {
        const turn: ChatTurn = { id: crypto.randomUUID(), role, text, createdAt: Date.now() }
        set((state) => ({ messages: [...state.messages, turn] }))
      },
      clearHistory: () => set({ messages: [] }),
      setMotivation: (motivation) => set({ motivation }),
    }),
    { name: 'second-brain:chat' }
  )
)
