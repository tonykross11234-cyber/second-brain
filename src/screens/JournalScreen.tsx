import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEntriesStore } from '../store/useEntriesStore'
import { useTranslation } from '../lib/useTranslation'
import { todayKey, formatDateLabel } from '../lib/date-utils'
import { Card } from '../components/Card'
import { EmptyState } from '../components/EmptyState'
import styles from './JournalScreen.module.css'

export function JournalScreen() {
  const { t, language } = useTranslation()
  const date = todayKey()
  const entries = useEntriesStore((s) => s.entries)
  const upsertToday = useEntriesStore((s) => s.upsertToday)

  const todayEntry = entries.find((e) => e.date === date)

  const [did, setDid] = useState(() => todayEntry?.did ?? '')
  const [plans, setPlans] = useState(() => todayEntry?.plans ?? '')
  const [thoughts, setThoughts] = useState(() => todayEntry?.thoughts ?? '')
  const [justSaved, setJustSaved] = useState(false)
  const [query, setQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function handleSave() {
    upsertToday(date, { did, plans, thoughts })
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2000)
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
          <label className={styles.label} htmlFor="j-did">{t.journal.did}</label>
          <textarea
            id="j-did"
            className={styles.textarea}
            value={did}
            onChange={(e) => setDid(e.target.value)}
            placeholder={t.journal.didPlaceholder}
            rows={3}
          />
        </Card>

        <Card className={styles.fieldCard}>
          <label className={styles.label} htmlFor="j-plans">{t.journal.plans}</label>
          <textarea
            id="j-plans"
            className={styles.textarea}
            value={plans}
            onChange={(e) => setPlans(e.target.value)}
            placeholder={t.journal.plansPlaceholder}
            rows={3}
          />
        </Card>

        <Card className={styles.fieldCard}>
          <label className={styles.label} htmlFor="j-thoughts">{t.journal.thoughts}</label>
          <textarea
            id="j-thoughts"
            className={styles.textarea}
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            placeholder={t.journal.thoughtsPlaceholder}
            rows={3}
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
          <EmptyState icon="📔" title={t.journal.empty} body={t.journal.emptyBody} />
        ) : filtered.length === 0 ? (
          <EmptyState icon="🔍" title={t.journal.noResults} />
        ) : (
          <div className={styles.list}>
            {filtered.map((entry) => {
              const expanded = expandedId === entry.id
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
                  {!expanded && (
                    <p className={styles.preview}>
                      {entry.did || entry.thoughts || entry.plans}
                    </p>
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
                        {entry.did && (
                          <div className={styles.field}>
                            <span className={styles.fieldLabel}>{t.journal.historyDid}</span>
                            <p>{entry.did}</p>
                          </div>
                        )}
                        {entry.plans && (
                          <div className={styles.field}>
                            <span className={styles.fieldLabel}>{t.journal.historyPlans}</span>
                            <p>{entry.plans}</p>
                          </div>
                        )}
                        {entry.thoughts && (
                          <div className={styles.field}>
                            <span className={styles.fieldLabel}>{t.journal.historyThoughts}</span>
                            <p>{entry.thoughts}</p>
                          </div>
                        )}
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
