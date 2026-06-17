import type { ReactElement } from 'react'
import type { TabKey } from '../lib/types'
import { useTranslation } from '../lib/useTranslation'
import { Home, Dumbbell, Brain, BookOpen, User } from '../lib/icons'
import styles from './BottomNav.module.css'

interface BottomNavProps {
  active: TabKey
  onChange: (tab: TabKey) => void
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  const { t } = useTranslation()

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'home',    label: t.nav.home },
    { key: 'fitness', label: t.nav.fitness },
    { key: 'chat',    label: t.nav.chat },
    { key: 'journal', label: t.nav.journal },
    { key: 'profile', label: t.nav.profile },
  ]

  const icons: Record<TabKey, ReactElement> = {
    home:    <Home    size={22} strokeWidth={2} />,
    fitness: <Dumbbell size={22} strokeWidth={2} />,
    chat:    <Brain   size={22} strokeWidth={2} />,
    journal: <BookOpen size={22} strokeWidth={2} />,
    profile: <User    size={22} strokeWidth={2} />,
  }

  return (
    <nav className={styles.nav}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={`${styles.tab} ${active === tab.key ? styles.active : ''}`}
          onClick={() => onChange(tab.key)}
          aria-current={active === tab.key}
        >
          <span className={styles.icon}>{icons[tab.key]}</span>
          <span className={styles.label}>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
