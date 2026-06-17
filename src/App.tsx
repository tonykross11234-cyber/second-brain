import { useEffect, useState } from 'react'
import type { ComponentType } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BottomNav } from './components/BottomNav'
import { PinLockScreen } from './components/PinLockScreen'
import { HomeScreen } from './screens/HomeScreen'
import { FitnessScreen } from './screens/FitnessScreen'
import { ChatScreen } from './screens/ChatScreen'
import { JournalScreen } from './screens/JournalScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { useApplyTheme } from './lib/useApplyTheme'
import { useSettingsStore } from './store/useSettingsStore'
import { useEntriesStore } from './store/useEntriesStore'
import { useTasksStore } from './store/useTasksStore'
import { useProfileStore } from './store/useProfileStore'
import { useNavStore } from './store/useNavStore'
import { buildSeedEntries, buildSeedTasks } from './lib/seed-data'
import type { TabKey } from './lib/types'
import styles from './App.module.css'

const SCREENS: Record<TabKey, ComponentType> = {
  home: HomeScreen,
  fitness: FitnessScreen,
  chat: ChatScreen,
  journal: JournalScreen,
  profile: ProfileScreen,
}

function App() {
  useApplyTheme()

  const { activeTab, navigate } = useNavStore()
  const hasSeeded = useSettingsStore((s) => s.hasSeeded)
  const markSeeded = useSettingsStore((s) => s.markSeeded)
  const pinEnabled = useProfileStore((s) => s.pinEnabled)
  const pinSetupOffered = useProfileStore((s) => s.pinSetupOffered)
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    if (!hasSeeded) {
      useEntriesStore.setState({ entries: buildSeedEntries() })
      useTasksStore.setState({ tasks: buildSeedTasks() })
      markSeeded()
    }
  }, [hasSeeded, markSeeded])

  if (!unlocked && (!pinSetupOffered || pinEnabled)) {
    return <PinLockScreen onUnlock={() => setUnlocked(true)} />
  }

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
      <BottomNav active={activeTab} onChange={navigate} />
    </div>
  )
}

export default App
