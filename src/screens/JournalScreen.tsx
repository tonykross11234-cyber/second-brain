import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEntriesStore } from '../store/useEntriesStore'
import { useTranslation } from '../lib/useTranslation'
import { todayKey, formatDateLabel } from '../lib/date-utils'
import { Card } from '../components/Card'
import { EmptyState } from '../components/EmptyState'
import { Phantom } from '../components/Phantom'
import { Search } from '../lib/icons'
import styles from './JournalScreen.module.css'

export function JournalScreen() {
  const { t, language } = useTranslation()
  const date = todayKey()
  const entries = useEntriesStore((s) => s.entries)
  const upsertToday = useEntriesStore((s) => s.upsertToday)

  const todayEntry = entries.find((e) => e.date === date)

  const [text, setText] = useState(() => todayEntry?.did ?? '')
  const [justSaved, setJustSaved] = useState(false)
  const [showSavedPhantom, setShowSavedPhantom] = useState(false)
  const [query, setQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function handleSave() {
    upsertToday(date, { did: text, plans: '', thoughts: '' })
    setJustSaved(true)
    setShowSavedPhantom(true)
    setTimeout(() => setJustSaved(false), 2000)
    setTimeout(() => setShowSavedPhantom(false), 3000)
  }

  const pastEntries = useMemo(
    () => [...entries].filter((e) => e.date !== date).sort((a, b) => (a.date < b.date ? 1 : -1)),
    [entries, date]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return pastEntries
    return pastEntries.filter((e) =>
      `${e.did} ${e.plans} ${e.thoughts}`.toLowerCase().includes(q)
    )
  }, [pastEntries, query])

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h1>{t.journal.title}</h1>
      </header>

      <section>
        <span className={styles.sectionLabel}>{t.journal.todaySection}</span>

        <Card className={styles.fieldCard}>
          <textarea
            className={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.journal.textPlaceholder}
            rows={6}
          />
        </Card>

        <motion.button
          type="button"
          className={styles.saveButton}
          whileTap={{ scale: 0.96 }}
          onClick={handleSave}
        >
          {justSaved ? `${t.journal.saved} ✓` : t.journal.save}
        </motion.button>

        <AnimatePresence>
          {showSavedPhantom && (
            <motion.div
              className={styles.savedPhantom}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <Phantom size="sm" state="idle" phrase="Записал!" />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className={styles.historySection}>
        <span className={styles.sectionLabel}>{t.journal.historySection}</span>

        <input
          className={styles.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.journal.search}
          type="search"
        />

        {pastEntries.length === 0 ? (
          <div className={styles.emptyPhantom}>
            <Phantom size="lg" state="sad" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Search size={32} strokeWidth={1.5} />} title={t.journal.noResults} />
        ) : (
          <div className={styles.list}>
            {filtered.map((entry) => {
              const expanded = expandedId === entry.id
              const preview = entry.did || entry.thoughts || entry.plans
              return (
                <Card key={entry.id} className={styles.entryCard}>
                  <button
                    type="button"
                    className={styles.entryHeader}
                    onClick={() => setExpandedId(expanded ? null : entry.id)}
                  >
                    <span className={styles.entryDate}>
                      {formatDateLabel(entry.date, language)}
                    </span>
                    <span
                      className={styles.chevron}
                      style={{ transform: expanded ? 'rotate(90deg)' : 'none' }}
                    >
                      ›
                    </span>
                  </button>
                  {!expanded && preview && (
                    <p className={styles.preview}>{preview}</p>
                  )}
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className={styles.details}
                      >
                        {preview && <p className={styles.entryBody}>{preview}</p>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
