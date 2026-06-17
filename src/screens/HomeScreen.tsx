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
import { Ghost } from '../components/Ghost'
import { FlameIcon } from '../components/FlameIcon'
import {
  Bell,
  BookOpen,
  Dumbbell,
  CheckSquare,
  Clock,
  Flame,
  Zap,
  Droplets,
  MessageCircle,
  ChevronRight,
} from '../lib/icons'
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
  const todayFitness = fitnessDays.find((d) => d.date === today) ?? {
    calories: 0,
    proteinG: 0,
    waterMl: 0,
  }
  const streak = calculateStreak(entries)
  const lastEntry = [...entries].sort((a, b) => (a.date < b.date ? 1 : -1))[0]

  const period = greetingPeriod()
  const greetingKey = `greeting${period.charAt(0).toUpperCase()}${period.slice(1)}` as
    | 'greetingMorning'
    | 'greetingAfternoon'
    | 'greetingEvening'
    | 'greetingNight'
  const greeting = t.home[greetingKey]

  const initials = name
    ? name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  const dateLabel = new Date().toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

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

    return () => {
      cancelled = true
    }
  }, [language]) // eslint-disable-line react-hooks/exhaustive-deps

  const motivationText = motivationLoading
    ? t.home.motivationLoading
    : motivation?.date === today
      ? motivation.text
      : t.home.motivationFallback

  function pct(val: number, goal: number) {
    return Math.min(100, goal > 0 ? Math.round((val / goal) * 100) : 0)
  }

  const calPct = pct(todayFitness.calories, goals.calories)
  const protPct = pct(todayFitness.proteinG, goals.proteinG)
  const waterPct = pct(todayFitness.waterMl, goals.waterMl)

  const quickActions = [
    {
      label: language === 'ru' ? 'Дневник' : 'Journal',
      icon: <BookOpen size={22} color="#7c3aed" />,
      color: '#7c3aed',
      bg: 'rgba(124,58,237,0.10)',
      tab: 'journal' as const,
    },
    {
      label: language === 'ru' ? 'Фитнес' : 'Fitness',
      icon: <Dumbbell size={22} color="#06b6d4" />,
      color: '#06b6d4',
      bg: 'rgba(6,182,212,0.10)',
      tab: 'fitness' as const,
    },
    {
      label: language === 'ru' ? 'Задачи' : 'Tasks',
      icon: <CheckSquare size={22} color="#10b981" />,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.10)',
      tab: 'journal' as const,
    },
    {
      label: language === 'ru' ? 'История' : 'History',
      icon: <Clock size={22} color="#f59e0b" />,
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.10)',
      tab: 'journal' as const,
    },
  ]

  const progressRows = [
    {
      icon: <Flame size={20} color="#f97316" />,
      label: t.home.caloriesLabel,
      value: todayFitness.calories,
      goal: goals.calories,
      unit: language === 'ru' ? 'ккал' : 'kcal',
      pct: calPct,
      gradient: 'linear-gradient(90deg, #f97316, #fbbf24)',
    },
    {
      icon: <Zap size={20} color="#7c3aed" />,
      label: t.home.proteinLabel,
      value: todayFitness.proteinG,
      goal: goals.proteinG,
      unit: language === 'ru' ? 'г' : 'g',
      pct: protPct,
      gradient: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
    },
    {
      icon: <Droplets size={20} color="#06b6d4" />,
      label: t.home.waterLabel,
      value: todayFitness.waterMl,
      goal: goals.waterMl,
      unit: language === 'ru' ? 'мл' : 'ml',
      pct: waterPct,
      gradient: 'linear-gradient(90deg, #06b6d4, #38bdf8)',
    },
  ]

  return (
    <div className={styles.screen}>
      {/* 1. HEADER */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.headerText}>
            <div className={styles.greeting}>
              {greeting}
              {name ? `, ${name}` : ''}
            </div>
            <div className={styles.date}>{dateLabel}</div>
          </div>
        </div>
        <Bell size={20} color="rgba(255,255,255,0.4)" />
      </header>

      {/* 2. HERO STREAK CARD */}
      <div className={styles.heroCard}>
        <div className={styles.auroraOrb} />
        <div className={styles.heroLeft}>
          <div className={styles.heroFlameRow}>
            <FlameIcon />
            <span className={styles.streakNumber}>{streak}</span>
          </div>
          <div className={styles.streakSub}>{t.home.streakSub}</div>
          <div className={styles.streakLabel}>{t.home.streakLabel}</div>
        </div>
        <div className={styles.heroPhantom}>
          <Ghost state={streak >= 7 ? 'win' : 'idle'} size="sm" />
        </div>
      </div>

      {/* 3. QUICK ACTIONS */}
      <div className={styles.quickActions}>
        {quickActions.map((a) => (
          <button
            key={a.label}
            type="button"
            className={styles.quickBtn}
            style={{ background: a.bg }}
            onClick={() => navigate(a.tab)}
          >
            {a.icon}
            <span className={styles.quickLabel} style={{ color: a.color }}>
              {a.label}
            </span>
          </button>
        ))}
      </div>

      {/* 4. PROGRESS CARD */}
      <Card className={styles.progressCard} onClick={() => navigate('fitness')}>
        <span className={styles.sectionLabel}>
          {language === 'ru' ? 'ПРОГРЕСС ДНЯ' : 'TODAY'}
        </span>
        <div className={styles.progressRows}>
          {progressRows.map((row) => (
            <div key={row.label} className={styles.progressItem}>
              <div className={styles.progressItemHeader}>
                {row.icon}
                <span className={styles.progressItemName}>{row.label}</span>
                <span className={styles.progressItemValue}>
                  {row.value} / {row.goal} {row.unit}
                </span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${row.pct}%`, background: row.gradient }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 5. AI INSIGHT CARD */}
      <Card className={styles.insightCard}>
        <div className={styles.insightHeader}>
          <span className={styles.pulseDot} />
          <span className={styles.phantomLabel}>PHANTOM</span>
        </div>
        <p className={`${styles.motivationText} ${motivationLoading ? styles.loading : ''}`}>
          {motivationText}
        </p>
      </Card>

      {/* 6. CTA BUTTON */}
      <motion.button
        type="button"
        className={styles.ctaButton}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate('chat')}
      >
        <MessageCircle size={18} color="#fff" />
        <span>{language === 'ru' ? 'Спросить Phantom' : 'Ask Phantom'}</span>
      </motion.button>

      {/* 7. LAST ENTRY CARD */}
      <Card className={styles.lastEntryCard} onClick={() => navigate('journal')}>
        <span className={styles.sectionLabel}>
          {language === 'ru' ? 'ПОСЛЕДНЯЯ ЗАПИСЬ' : 'LAST ENTRY'}
        </span>
        {lastEntry ? (
          <div className={styles.lastEntryContent}>
            <div className={styles.lastEntryMeta}>
              <div>
                <p className={styles.entryDate}>{formatDateLabel(lastEntry.date, language)}</p>
                <p className={styles.entryPreview}>
                  {lastEntry.did || lastEntry.thoughts || lastEntry.plans}
                </p>
              </div>
              <ChevronRight size={16} color="rgba(255,255,255,0.25)" />
            </div>
          </div>
        ) : (
          <p className={styles.emptyEntry}>
            {language === 'ru'
              ? 'Начни записывать — это займёт 1 минуту'
              : 'Start writing — it only takes 1 minute'}
          </p>
        )}
      </Card>
    </div>
  )
}
