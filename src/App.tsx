import { useEffect, useState } from 'react'
import type { ComponentType } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BottomNav } from './components/BottomNav'
import { TodayScreen } from './screens/TodayScreen'
import { EntriesScreen } from './screens/EntriesScreen'
import { AIScreen } from './screens/AIScreen'
import { TasksScreen } from './screens/TasksScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { useApplyTheme } from './lib/useApplyTheme'
import { useSettingsStore } from './store/useSettingsStore'
import { useEntriesStore } from './store/useEntriesStore'
import { useTasksStore } from './store/useTasksStore'
import { buildSeedEntries, buildSeedTasks } from './lib/seed-data'
import type { TabKey } from './lib/types'
import styles from './App.module.css'

const SCREENS: Record<TabKey, ComponentType> = {
  today: TodayScreen,
  entries: EntriesScreen,
  ai: AIScreen,
  tasks: TasksScreen,
  settings: SettingsScreen,
}

function App() {
  useApplyTheme()

  const [activeTab, setActiveTab] = useState<TabKey>('today')
  const hasSeeded = useSettingsStore((s) => s.hasSeeded)
  const markSeeded = useSettingsStore((s) => s.markSeeded)

  useEffect(() => {
    if (!hasSeeded) {
      useEntriesStore.setState({ entries: buildSeedEntries() })
      useTasksStore.setState({ tasks: buildSeedTasks() })
      markSeeded()
    }
  }, [hasSeeded, markSeeded])

  const ActiveScreen = SCREENS[activeTab]

  return (
    <div className={styles.app}>
      <main className={styles.main}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <ActiveScreen />
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  )
}

export default App
