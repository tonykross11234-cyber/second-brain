import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useEntriesStore } from '../store/useEntriesStore'
import { useProfileStore } from '../store/useProfileStore'
import { useChatStore } from '../store/useChatStore'
import { useFitnessStore } from '../store/useFitnessStore'
import { useNavStore } from '../store/useNavStore'
import { useTranslation } from '../lib/useTranslation'
import { todayKey, calculateStreak, greetingPeriod, formatDateLabel } from '../lib/date-utils'
import { askClaude } from '../lib/anthropic-client'
import { Card } from '../components/Card'
import { Phantom } from '../components/Phantom'
import styles from './HomeScreen.module.css'

export function HomeScreen() {
  const { t, language } = useTranslation()
  const navigate = useNavStore((s) => s.navigate)

  const entries = useEntriesStore((s) => s.entries)
  const name = useProfileStore((s) => s.name)
  const motivation = useChatStore((s) => s.motivation)
  const setMotivation = useChatStore((s) => s.setMotivation)

  const fitnessDays = useFitnessStore((s) => s.days)
  const goals = useFitnessStore((s) => s.goals)

  const [motivationLoading, setMotivationLoading] = useState(false)

  const today = todayKey()
  const todayFitness = fitnessDays.find((d) => d.date === today) ?? { calories: 0, proteinG: 0, waterMl: 0 }
  const streak = calculateStreak(entries)
  const lastEntry = [...entries].sort((a, b) => (a.date < b.date ? 1 : -1))[0]

  const period = greetingPeriod()
  const greetingKey = `greeting${period.charAt(0).toUpperCase()}${period.slice(1)}` as
    | 'greetingMorning'
    | 'greetingAfternoon'
    | 'greetingEvening'
    | 'greetingNight'
  const greeting = t.home[greetingKey]

  useEffect(() => {
    if (motivation?.date === today && motivation?.language === language) return

    const prompt =
      language === 'ru'
        ? `Напиши одну короткую (1–2 предложения) мотивирующую фразу для человека с серией ${streak} дней в дневнике. Тёплый тон, без кавычек, без форматирования.`
        : `Write one short (1–2 sentences) motivational message for someone with a ${streak}-day journal streak. Warm tone, no quotes, no formatting.`

    const system = `Respond only in ${language === 'ru' ? 'Russian' : 'English'}. No quotes, no formatting, plain text only.`

    let cancelled = false
    setMotivationLoading(true)

    askClaude([{ role: 'user', content: prompt }], { system, maxTokens: 80 })
      .then((text) => {
        if (!cancelled) {
          setMotivation({ date: today, text, language })
          setMotivationLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setMotivationLoading(false)
      })

    return () => { cancelled = true }
  }, [language]) // eslint-disable-line react-hooks/exhaustive-deps

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

  function pct(val: number, goal: number) {
    return Math.min(100, goal > 0 ? Math.round((val / goal) * 100) : 0)
  }

  const calPct = pct(todayFitness.calories, goals.calories)
  const protPct = pct(todayFitness.proteinG, goals.proteinG)
  const waterPct = pct(todayFitness.waterMl, goals.waterMl)

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.greeting}>
              {greeting}{name ? `, ${name}` : ''}
            </h1>
            <p className={styles.date}>{dateLabel}</p>
          </div>
          <Phantom size="md" state={streak >= 7 ? 'win' : 'idle'} />
        </div>
      </header>

      <div className={styles.statsRow}>
        <Card className={styles.statCard}>
          <span className={styles.statValue}>{streak}</span>
          <span className={styles.statLabel}>{t.home.streakLabel}</span>
          <span className={styles.statSub}>{t.home.streakSub}</span>
        </Card>
        <Card className={styles.statCard} onClick={() => navigate('journal')}>
          <span className={styles.statValue}>{entries.length}</span>
          <span className={styles.statLabel}>{t.home.entriesLabel}</span>
          <span className={styles.statSub}>{t.home.entriesAllTime}</span>
        </Card>
      </div>

      <Card className={styles.fitnessCard} onClick={() => navigate('fitness')}>
        <span className={styles.sectionLabel}>{t.home.caloriesLabel}</span>
        <div className={styles.progressRow}>
          <span className={styles.progressVal}>{todayFitness.calories}</span>
          <span className={styles.progressGoal}>/ {goals.calories}</span>
        </div>
        <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${calPct}%`, background: 'var(--accent-gradient)' }} /></div>

        <span className={styles.sectionLabel} style={{ marginTop: 12 }}>{t.home.proteinLabel}</span>
        <div className={styles.progressRow}>
          <span className={styles.progressVal}>{todayFitness.proteinG}г</span>
          <span className={styles.progressGoal}>/ {goals.proteinG}г</span>
        </div>
        <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${protPct}%`, background: 'linear-gradient(135deg, #34d399, #06b6d4)' }} /></div>

        <span className={styles.sectionLabel} style={{ marginTop: 12 }}>{t.home.waterLabel}</span>
        <div className={styles.progressRow}>
          <span className={styles.progressVal}>{todayFitness.waterMl}мл</span>
          <span className={styles.progressGoal}>/ {goals.waterMl}мл</span>
        </div>
        <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${waterPct}%`, background: 'linear-gradient(135deg, #38bdf8, #818cf8)' }} /></div>
      </Card>

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
            <p className={styles.entryPreview}>{lastEntry.did || lastEntry.thoughts || lastEntry.plans}</p>
          </>
        ) : (
          <p className={styles.emptyEntry}>{t.home.lastEntryEmpty}</p>
        )}
      </Card>

      <motion.button
        type="button"
        className={styles.askAiButton}
        whileTap={{ scale: 0.96 }}
        onClick={() => navigate('chat')}
      >
        {t.home.askAiAboutDay}
      </motion.button>
    </div>
  )
}
