import type { ReactElement } from 'react'
import type { TabKey } from '../lib/types'
import { useTranslation } from '../lib/useTranslation'
import styles from './BottomNav.module.css'

interface BottomNavProps {
  active: TabKey
  onChange: (tab: TabKey) => void
}

const ICONS: Record<TabKey, ReactElement> = {
  today: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </svg>
  ),
  entries: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h11a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2z" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
      <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" />
    </svg>
  ),
  tasks: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l2 2 4-4" />
      <rect x="3" y="4" width="18" height="16" rx="3" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13a8 8 0 0 0 0-2l2-1.5-2-3.4-2.4.7a8 8 0 0 0-1.7-1L15 3h-4l-.3 2.8a8 8 0 0 0-1.7 1l-2.4-.7-2 3.4L6.6 11a8 8 0 0 0 0 2l-2 1.5 2 3.4 2.4-.7a8 8 0 0 0 1.7 1L11 21h4l.3-2.8a8 8 0 0 0 1.7-1l2.4.7 2-3.4-2-1.5z" />
    </svg>
  ),
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  const { t } = useTranslation()

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'today', label: t.nav.today },
    { key: 'entries', label: t.nav.entries },
    { key: 'ai', label: t.nav.ai },
    { key: 'tasks', label: t.nav.tasks },
    { key: 'settings', label: t.nav.settings },
  ]

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
          <span className={styles.icon}>{ICONS[tab.key]}</span>
          <span className={styles.label}>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
