import { useSettingsStore } from '../store/useSettingsStore'
import { useTranslation } from '../lib/useTranslation'
import type { Theme } from '../lib/types'
import styles from './SegmentedControl.module.css'

export function ThemeToggle() {
  const { t } = useTranslation()
  const theme = useSettingsStore((s) => s.theme)
  const setTheme = useSettingsStore((s) => s.setTheme)

  const options: { value: Theme; label: string }[] = [
    { value: 'light', label: t.settings.themeLight },
    { value: 'dark', label: t.settings.themeDark },
    { value: 'system', label: t.settings.themeSystem },
  ]

  return (
    <div className={styles.segmented}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`${styles.segment} ${theme === opt.value ? styles.active : ''}`}
          onClick={() => setTheme(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
