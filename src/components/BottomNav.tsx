import type { ReactElement } from 'react'
import type { TabKey } from '../lib/types'
import { useTranslation } from '../lib/useTranslation'
import styles from './BottomNav.module.css'

interface BottomNavProps {
  active: TabKey
  onChange: (tab: TabKey) => void
}

const ICONS: Record<TabKey, ReactElement> = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  ),
  fitness: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h11" />
      <path d="M6.5 17.5h11" />
      <path d="M4 8.5v7" />
      <path d="M20 8.5v7" />
      <path d="M2 10v4" />
      <path d="M22 10v4" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.5 8.5 0 1 1-3.8-7.1L21 3l-1 4.6a8.5 8.5 0 0 1 1 3.9z" />
      <path d="M3 21l1.6-4.1" />
    </svg>
  ),
  journal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h11a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2z" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  const { t } = useTranslation()

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'home', label: t.nav.home },
    { key: 'fitness', label: t.nav.fitness },
    { key: 'chat', label: t.nav.chat },
    { key: 'journal', label: t.nav.journal },
    { key: 'profile', label: t.nav.profile },
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
