import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useEntriesStore } from '../store/useEntriesStore'
import { useTasksStore } from '../store/useTasksStore'
import { useProfileStore } from '../store/useProfileStore'
import { useChatStore } from '../store/useChatStore'
import { useNavStore } from '../store/useNavStore'
import { useTranslation } from '../lib/useTranslation'
import { todayKey, calculateStreak, greetingPeriod, formatDateLabel, isToday } from '../lib/date-utils'
import { askClaude } from '../lib/anthropic-client'
import { Card } from '../components/Card'
import styles from './HomeScreen.module.css'

export function HomeScreen() {
  const { t, language } = useTranslation()
  const navigate = useNavStore((s) => s.navigate)

  const entries = useEntriesStore((s) => s.entries)
  const tasks = useTasksStore((s) => s.tasks)
  const name = useProfileStore((s) => s.name)
  const motivation = useChatStore((s) => s.motivation)
  const setMotivation = useChatStore((s) => s.setMotivation)

  const [motivationLoading, setMotivationLoading] = useState(false)

  const today = todayKey()
  const streak = calculateStreak(entries)
  const activeTasks = tasks.filter((task) => !task.done)
  const doneTodayCount = tasks.filter((task) => task.done && task.completedAt != null && isToday(task.completedAt)).length
  const lastEntry = [...entries].sort((a, b) => (a.date < b.date ? 1 : -1))[0]

  const period = greetingPeriod()
  const greetingKey = `greeting${period.charAt(0).toUpperCase()}${period.slice(1)}` as
    | 'greetingMorning'
    | 'greetingAfternoon'
    | 'greetingEvening'
    | 'greetingNight'
  const greeting = t.home[greetingKey]

  useEffect(() => {
    if (motivation?.date === today) return

    const prompt =
      language === 'ru'
        ? `Напиши одну короткую (1–2 предложения) мотивирующую фразу для человека с серией ${streak} ${streak === 1 ? 'день' : 'дней'} в дневнике. Тёплый тон, без кавычек, без форматирования.`
        : `Write one short (1–2 sentences) motivational message for someone with a ${streak}-day journal streak. Warm tone, no quotes, no formatting.`

    let cancelled = false
    setMotivationLoading(true)

    askClaude([{ role: 'user', content: prompt }], { maxTokens: 80 })
      .then((text) => {
        if (!cancelled) {
          setMotivation({ date: today, text })
          setMotivationLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setMotivationLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const motivationText = motivationLoading
    ? t.home.motivationLoading
    : motivation?.date === today
      ? motivation.text
      : t.home.motivationFallback

  const dateLabel = new Date().toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h1 className={styles.greeting}>
          {greeting}{name ? `, ${name}` : ''}
        </h1>
        <p className={styles.date}>{dateLabel}</p>
      </header>

      <div className={styles.statsRow}>
        <Card className={styles.statCard}>
          <span className={styles.statValue}>{streak}</span>
          <span className={styles.statLabel}>{t.home.streakLabel}</span>
          <span className={styles.statSub}>{t.home.streakDays(streak)}</span>
        </Card>
        <Card className={styles.statCard}>
          <span className={styles.statValue}>{activeTasks.length}</span>
          <span className={styles.statLabel}>{t.home.tasksLabel}</span>
          <span className={styles.statSub}>{t.home.tasksActive(activeTasks.length)}</span>
          {doneTodayCount > 0 && (
            <span className={styles.statDone}>{t.home.tasksDoneToday(doneTodayCount)}</span>
          )}
        </Card>
      </div>

      <Card className={styles.motivationCard}>
        <span className={styles.sectionLabel}>{t.home.motivationLabel}</span>
        <p className={`${styles.motivationText} ${motivationLoading ? styles.loading : ''}`}>
          {motivationText}
        </p>
      </Card>

      <Card className={styles.lastEntryCard} onClick={() => navigate('journal')}>
        <span className={styles.sectionLabel}>{t.home.lastEntryLabel}</span>
        {lastEntry ? (
          <>
            <p className={styles.entryDate}>{formatDateLabel(lastEntry.date, language)}</p>
            <p className={styles.entryPreview}>
              {lastEntry.did || lastEntry.thoughts || lastEntry.plans}
            </p>
          </>
        ) : (
          <p className={styles.emptyEntry}>{t.home.lastEntryEmpty}</p>
        )}
      </Card>

      <div className={styles.actions}>
        <motion.button
          type="button"
          className={styles.actionButton}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('journal')}
        >
          ✏️ {t.home.quickWriteEntry}
        </motion.button>
        <motion.button
          type="button"
          className={styles.actionButton}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('profile')}
        >
          ✅ {t.home.quickAddTask}
        </motion.button>
        <motion.button
          type="button"
          className={`${styles.actionButton} ${styles.actionAccent}`}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('chat')}
        >
          💬 {t.home.quickAskAI}
        </motion.button>
      </div>
    </div>
  )
}
