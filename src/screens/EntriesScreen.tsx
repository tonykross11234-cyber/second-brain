import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEntriesStore } from '../store/useEntriesStore'
import { useTranslation } from '../lib/useTranslation'
import { formatDateLabel } from '../lib/date-utils'
import { Card } from '../components/Card'
import { EmptyState } from '../components/EmptyState'
import styles from './EntriesScreen.module.css'

export function EntriesScreen() {
  const { t, language } = useTranslation()
  const entries = useEntriesStore((s) => s.entries)
  const [query, setQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const sorted = useMemo(
    () => [...entries].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [entries]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sorted
    return sorted.filter((e) => `${e.did} ${e.plans} ${e.thoughts}`.toLowerCase().includes(q))
  }, [sorted, query])

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h1>{t.entries.title}</h1>
      </header>

      <input
        className={styles.search}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.entries.search}
        type="search"
      />

      {entries.length === 0 ? (
        <EmptyState icon="📔" title={t.entries.empty} body={t.entries.emptyBody} />
      ) : filtered.length === 0 ? (
        <EmptyState icon="🔍" title={t.entries.noResults} />
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
                  <span className={styles.entryDate}>{formatDateLabel(entry.date, language)}</span>
                  <span className={styles.chevron} style={{ transform: expanded ? 'rotate(90deg)' : 'none' }}>
                    ›
                  </span>
                </button>
                {!expanded && (
                  <p className={styles.preview}>{entry.did || entry.thoughts || entry.plans}</p>
                )}
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className={styles.details}
                    >
                      {entry.did && (
                        <div className={styles.field}>
                          <span className={styles.fieldLabel}>{t.entries.did}</span>
                          <p>{entry.did}</p>
                        </div>
                      )}
                      {entry.plans && (
                        <div className={styles.field}>
                          <span className={styles.fieldLabel}>{t.entries.plans}</span>
                          <p>{entry.plans}</p>
                        </div>
                      )}
                      {entry.thoughts && (
                        <div className={styles.field}>
                          <span className={styles.fieldLabel}>{t.entries.thoughts}</span>
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
    </div>
  )
}
