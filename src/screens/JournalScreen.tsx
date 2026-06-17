import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEntriesStore } from '../store/useEntriesStore'
import { useTranslation } from '../lib/useTranslation'
import { todayKey, formatDateLabel } from '../lib/date-utils'
import { Card } from '../components/Card'
import { EmptyState } from '../components/EmptyState'
import { Search, ChevronRight } from '../lib/icons'
import { TasksSection } from '../components/TasksSection'
import styles from './JournalScreen.module.css'

export function JournalScreen() {
  const { t, language } = useTranslation()
  const date = todayKey()
  const entries = useEntriesStore((s) => s.entries)
  const upsertToday = useEntriesStore((s) => s.upsertToday)

  const todayEntry = entries.find((e) => e.date === date)

  const [activeTab, setActiveTab] = useState<0 | 1>(0)
  const [text, setText] = useState(() => todayEntry?.did ?? '')
  const [justSaved, setJustSaved] = useState(false)
  const [query, setQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function handleSave() {
    upsertToday(date, { did: text, plans: '', thoughts: '' })
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2000)
  }

  const wordCount = text.split(' ').filter((w) => w.trim()).length

  const pastEntries = useMemo(
    () =>
      [...entries]
        .filter((e) => e.date !== date)
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
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
      {/* ── Header ── */}
      <header className={styles.header}>
        <h1>{t.journal.title}</h1>
      </header>

      {/* ── Tab Bar ── */}
      <div className={styles.tabBar}>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 0 ? styles.tabActive : ''}`}
          onClick={() => setActiveTab(0)}
        >
          {t.journal.tabEntry}
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 1 ? styles.tabActive : ''}`}
          onClick={() => setActiveTab(1)}
        >
          {t.journal.tabTasks}
        </button>
      </div>

      {/* ── Entry Tab ── */}
      {activeTab === 0 && (
        <>
          {/* ── Today Section ── */}
          <section>
            <span className={styles.sectionLabel}>{t.journal.todaySection}</span>

            <div className={styles.writingCard}>
              <textarea
                className={styles.textarea}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t.journal.textPlaceholder}
                rows={6}
              />
              <div className={styles.wordCounter}>
                {wordCount} words
              </div>
            </div>

            <motion.button
              type="button"
              className={`${styles.saveButton} ${justSaved ? styles.saveButtonSaved : ''}`}
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
            >
              {t.journal.saved && justSaved ? t.journal.saved : t.journal.save}
            </motion.button>

          </section>

          {/* ── History Section ── */}
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
              <EmptyState
                icon={<Search size={32} strokeWidth={1.5} />}
                title={t.journal.noResults}
              />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={<Search size={32} strokeWidth={1.5} />}
                title={t.journal.noResults}
              />
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
                          style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                        >
                          <ChevronRight size={16} strokeWidth={2} />
                        </span>
                      </button>

                      {!expanded && preview && (
                        <p className={styles.preview}>{preview}</p>
                      )}

                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.div
                            className={styles.details}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                          >
                            {preview && (
                              <p className={styles.entryBody}>{preview}</p>
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
        </>
      )}

      {/* ── Tasks Tab ── */}
      {activeTab === 1 && <TasksSection />}
    </div>
  )
}
