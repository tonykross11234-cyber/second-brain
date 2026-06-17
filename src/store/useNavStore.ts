import { create } from 'zustand'
import type { TabKey } from '../lib/types'

interface NavState {
  activeTab: TabKey
  navigate: (tab: TabKey) => void
}

export const useNavStore = create<NavState>((set) => ({
  activeTab: 'home',
  navigate: (tab) => set({ activeTab: tab }),
}))
