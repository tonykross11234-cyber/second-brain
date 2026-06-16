import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTasksStore } from '../store/useTasksStore'
import { useTranslation } from '../lib/useTranslation'
import type { Priority } from '../lib/types'
import { Card } from '../components/Card'
import { PriorityBadge } from '../components/PriorityBadge'
import { EmptyState } from '../components/EmptyState'
import styles from './TasksScreen.module.css'

const PRIORITY_ORDER: Priority[] = ['high', 'medium', 'low']

export function TasksScreen() {
  const { t } = useTranslation()
  const tasks = useTasksStore((s) => s.tasks)
  const addTask = useTasksStore((s) => s.addTask)
  const toggleDone = useTasksStore((s) => s.toggleDone)
  const deleteTask = useTasksStore((s) => s.deleteTask)

  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')

  const sorted = useMemo(() => {
    const active = [...tasks]
      .filter((task) => !task.done)
      .sort((a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority))
    const done = [...tasks]
      .filter((task) => task.done)
      .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))
    return [...active, ...done]
  }, [tasks])

  function handleAdd() {
    const trimmed = title.trim()
    if (!trimmed) return
    addTask(trimmed, priority)
    setTitle('')
  }

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h1>{t.tasks.title}</h1>
      </header>

      <Card className={styles.addCard}>
        <input
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t.tasks.addPlaceholder}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <div className={styles.priorityRow}>
          {PRIORITY_ORDER.map((p) => (
            <button
              key={p}
              type="button"
              className={`${styles.priorityOption} ${styles[p]} ${priority === p ? styles.selected : ''}`}
              onClick={() => setPriority(p)}
            >
              {p === 'high' ? t.tasks.priorityHigh : p === 'medium' ? t.tasks.priorityMedium : t.tasks.priorityLow}
            </button>
          ))}
        </div>
        <motion.button
          type="button"
          className={styles.addButton}
          whileTap={{ scale: 0.96 }}
          onClick={handleAdd}
        >
          {t.tasks.add}
        </motion.button>
      </Card>

      {tasks.length === 0 ? (
        <EmptyState icon="✅" title={t.tasks.empty} body={t.tasks.emptyBody} />
      ) : (
        <div className={styles.list}>
          <AnimatePresence initial={false}>
            {sorted.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.18 }}
              >
                <Card className={styles.taskCard}>
                  <button
                    type="button"
                    className={`${styles.checkbox} ${task.done ? styles.checked : ''}`}
                    onClick={() => toggleDone(task.id)}
                    aria-label="toggle done"
                  >
                    {task.done && '✓'}
                  </button>
                  <span className={`${styles.taskTitle} ${task.done ? styles.done : ''}`}>
                    {task.title}
                  </span>
                  <PriorityBadge priority={task.priority} />
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => deleteTask(task.id)}
                    aria-label="delete task"
                  >
                    ×
                  </button>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
