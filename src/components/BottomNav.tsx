import type { TabKey } from '../lib/types'
import { useTranslation } from '../lib/useTranslation'
import { Home, Dumbbell, BookOpen, User, MessageCircle } from '../lib/icons'
import styles from './BottomNav.module.css'

interface BottomNavProps {
  active: TabKey
  onChange: (tab: TabKey) => void
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  const { t } = useTranslation()

  return (
    <nav className={styles.nav}>
      <button
        type="button"
        className={`${styles.tab} ${active === 'home' ? styles.active : ''}`}
        onClick={() => onChange('home')}
      >
        <span className={styles.icon}><Home size={22} strokeWidth={1.8} /></span>
        <span className={styles.label}>{t.nav.home}</span>
      </button>

      <button
        type="button"
        className={`${styles.tab} ${active === 'fitness' ? styles.active : ''}`}
        onClick={() => onChange('fitness')}
      >
        <span className={styles.icon}><Dumbbell size={22} strokeWidth={1.8} /></span>
        <span className={styles.label}>{t.nav.fitness}</span>
      </button>

      <div className={styles.centerSlot}>
        <button
          type="button"
          className={`${styles.centerBtn} ${active === 'chat' ? styles.centerActive : ''}`}
          onClick={() => onChange('chat')}
          aria-label={t.nav.chat}
        >
          <MessageCircle size={24} strokeWidth={2} />
        </button>
      </div>

      <button
        type="button"
        className={`${styles.tab} ${active === 'journal' ? styles.active : ''}`}
        onClick={() => onChange('journal')}
      >
        <span className={styles.icon}><BookOpen size={22} strokeWidth={1.8} /></span>
        <span className={styles.label}>{t.nav.journal}</span>
      </button>

      <button
        type="button"
        className={`${styles.tab} ${active === 'profile' ? styles.active : ''}`}
        onClick={() => onChange('profile')}
      >
        <span className={styles.icon}><User size={22} strokeWidth={1.8} /></span>
        <span className={styles.label}>{t.nav.profile}</span>
      </button>
    </nav>
  )
}
