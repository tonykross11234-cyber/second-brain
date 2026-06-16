import { useSettingsStore } from '../store/useSettingsStore'
import type { Language } from '../lib/types'
import styles from './SegmentedControl.module.css'

export function LanguageToggle() {
  const language = useSettingsStore((s) => s.language)
  const setLanguage = useSettingsStore((s) => s.setLanguage)

  const options: { value: Language; label: string }[] = [
    { value: 'en', label: 'EN' },
    { value: 'ru', label: 'RU' },
  ]

  return (
    <div className={styles.segmented}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`${styles.segment} ${language === opt.value ? styles.active : ''}`}
          onClick={() => setLanguage(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
