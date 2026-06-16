import { useTranslation } from '../lib/useTranslation'
import { useEntriesStore } from '../store/useEntriesStore'
import { useTasksStore } from '../store/useTasksStore'
import { Card } from '../components/Card'
import { ThemeToggle } from '../components/ThemeToggle'
import { LanguageToggle } from '../components/LanguageToggle'
import styles from './SettingsScreen.module.css'

export function SettingsScreen() {
  const { t } = useTranslation()

  function handleReset() {
    if (window.confirm(t.settings.resetConfirm)) {
      useEntriesStore.setState({ entries: [] })
      useTasksStore.setState({ tasks: [] })
    }
  }

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h1>{t.settings.title}</h1>
      </header>

      <Card className={styles.section}>
        <span className={styles.sectionLabel}>{t.settings.appearance}</span>
        <div className={styles.row}>
          <span className={styles.rowLabel}>{t.settings.theme}</span>
        </div>
        <ThemeToggle />
      </Card>

      <Card className={styles.section}>
        <span className={styles.sectionLabel}>{t.settings.language}</span>
        <LanguageToggle />
      </Card>

      <Card className={styles.section}>
        <span className={styles.sectionLabel}>{t.settings.data}</span>
        <p className={styles.about}>{t.settings.about}</p>
        <button type="button" className={styles.resetButton} onClick={handleReset}>
          {t.settings.resetData}
        </button>
      </Card>
    </div>
  )
}
