import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEntriesStore } from '../store/useEntriesStore'
import { useTasksStore } from '../store/useTasksStore'
import { useTranslation } from '../lib/useTranslation'
import { generateInsights, dailySeed } from '../lib/ai-analysis'
import { todayKey } from '../lib/date-utils'
import { Card } from '../components/Card'
import { EmptyState } from '../components/EmptyState'
import styles from './AIScreen.module.css'

export function AIScreen() {
  const { t, language } = useTranslation()
  const entries = useEntriesStore((s) => s.entries)
  const tasks = useTasksStore((s) => s.tasks)
  const [seed, setSeed] = useState(() => dailySeed(todayKey()))

  const cards = useMemo(
    () => generateInsights(entries, tasks, language, seed),
    [entries, tasks, language, seed]
  )

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h1>{t.ai.title}</h1>
        <p className={styles.subtitle}>{t.ai.subtitle}</p>
      </header>

      {cards.length === 0 ? (
        <EmptyState icon="✨" title={t.ai.empty} body={t.ai.emptyBody} />
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={seed}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className={styles.list}
            >
              {cards.map((card) => (
                <Card key={card.id} className={styles.insightCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardIcon}>{card.icon}</span>
                    <span className={styles.cardTitle}>{card.title}</span>
                  </div>
                  <p className={styles.cardBody}>{card.body}</p>
                </Card>
              ))}
            </motion.div>
          </AnimatePresence>

          <motion.button
            type="button"
            className={styles.refreshButton}
            whileTap={{ scale: 0.96 }}
            onClick={() => setSeed((s) => s + 1)}
          >
            {t.ai.refresh}
          </motion.button>
        </>
      )}
    </div>
  )
}
