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
import { FlameIcon } from '../components/FlameIcon'
import { Bell, Dumbbell, MessageCircle, ChevronRight } from '../lib/icons'
import styles from './HomeScreen.module.css'

// ── Week helpers ──────────────────────────────────────────────────────────────

function getWeekDays(todayStr: string): string[] {
  const [y, m, d] = todayStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const dow = date.getDay()
  const mondayOffset = dow === 0 ? -6 : 1 - dow
  const mon = new Date(date)
  mon.setDate(date.getDate() + mondayOffset)
  return Array.from({ length: 7 }, (_, i) => {
    const dd = new Date(mon)
    dd.setDate(mon.getDate() + i)
    return `${dd.getFullYear()}-${String(dd.getMonth() + 1).padStart(2, '0')}-${String(dd.getDate()).padStart(2, '0')}`
  })
}

const DAY_RU = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
const DAY_EN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function getDayLetter(dateKey: string, lang: string): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  return (lang === 'ru' ? DAY_RU : DAY_EN)[new Date(y, m - 1, d).getDay()]
}

function getDayNum(dateKey: string): string {
  return dateKey.split('-')[2].replace(/^0/, '')
}

// ── SVG components ─────────────────────────────────────────────────────────────

function CalorieRing({ calories, goal }: { calories: number; goal: number }) {
  const R = 70
  const C = 2 * Math.PI * R
  const pct = Math.min(1, goal > 0 ? calories / goal : 0)
  return (
    <svg viewBox="0 0 160 160" width="160" height="160">
      <defs>
        <linearGradient id="calGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="70" fill="none" stroke="var(--ring-track)" strokeWidth="10" />
      <circle
        cx="80"
        cy="80"
        r="70"
        fill="none"
        stroke="url(#calGrad)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${pct * C} ${C}`}
        transform="rotate(-90 80 80)"
        style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
      />
      <text x="80" y="76" textAnchor="middle" fill="var(--ring-text)" fontSize="28" fontWeight="800" fontFamily="system-ui">
        {calories}
      </text>
      <text x="80" y="94" textAnchor="middle" fill="var(--ring-sub)" fontSize="12" fontFamily="system-ui">
        {'/ ' + goal}
      </text>
      <text x="80" y="109" textAnchor="middle" fill="#06b6d4" fontSize="11" fontFamily="system-ui">
        {pct === 0 ? 'kcal' : Math.round(pct * 100) + '%'}
      </text>
    </svg>
  )
}

function MiniRing({
  value,
  goal,
  color,
  size = 70,
}: {
  value: number
  goal: number
  color: string
  size?: number
}) {
  const R = 28
  const C = 2 * Math.PI * R
  const pct = Math.min(1, goal > 0 ? value / goal : 0)
  const cx = size / 2
  const cy = size / 2
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--ring-track)" strokeWidth="6" />
      <circle
        cx={cx}
        cy={cy}
        r={R}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${pct * C} ${C}`}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
      />
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fill="var(--ring-text)"
        fontSize="13"
        fontWeight="700"
        fontFamily="system-ui"
      >
        {Math.round(pct * 100) + '%'}
      </text>
    </svg>
  )
}

function StreakFlame() {
  return (
    <svg viewBox="0 0 24 24" width="48" height="48">
      <defs>
        <linearGradient id="sfGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      <path
        fill="url(#sfGrad)"
        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
      />
    </svg>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────

export function HomeScreen() {
  const { t, language } = useTranslation()
  const navigate = useNavStore((s) => s.navigate)

  const entries = useEntriesStore((s) => s.entries)
  const name = useProfileStore((s) => s.name)
  const motivation = useChatStore((s) => s.motivation)
  const setMotivation = useChatStore((s) => s.setMotivation)

  const fitnessDays = useFitnessStore((s) => s.days)
  const goals = useFitnessStore((s) => s.goals)
  const addWorkout = useFitnessStore((s) => s.addWorkout)

  const [motivationLoading, setMotivationLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(() => todayKey())

  const today = todayKey()
  const weekDays = getWeekDays(today)

  const selectedFitness = fitnessDays.find((d) => d.date === selectedDate) ?? {
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

      {/* 2. WEEK STRIP */}
      <div className={styles.weekStrip}>
        {weekDays.map((day) => {
          const isToday = day === today
          const isSelected = day === selectedDate
          const hasFitnessData = fitnessDays.some(
            (fd) => fd.date === day && (fd.calories > 0 || fd.proteinG > 0 || fd.waterMl > 0)
          )
          return (
            <button
              key={day}
              type="button"
              className={`${styles.weekDay} ${isSelected && !isToday ? styles.weekDaySelected : ''}`}
              onClick={() => setSelectedDate(day)}
            >
              <span className={styles.weekDayLetter}>{getDayLetter(day, language)}</span>
              {isToday ? (
                <motion.span
                  className={`${styles.weekDayNum} ${styles.weekDayNumActive}`}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                >
                  {getDayNum(day)}
                </motion.span>
              ) : (
                <span className={styles.weekDayNum}>{getDayNum(day)}</span>
              )}
              {hasFitnessData ? <span className={styles.weekDot} /> : <span className={styles.weekDotPlaceholder} />}
            </button>
          )
        })}
      </div>

      {/* 3. HERO SECTION */}
      <div className={styles.heroSection}>
        <div className={styles.heroSide}>
          <div className={styles.heroSideIcon}>
            <FlameIcon />
          </div>
          <span className={styles.heroSideLabel}>{t.home.caloriesLabel}</span>
        </div>

        <div className={styles.heroCenter}>
          <CalorieRing calories={selectedFitness.calories} goal={goals.calories} />
        </div>

        <div className={styles.heroSide}>
          <div className={styles.heroSideIcon}>
            <Dumbbell size={22} color="#06b6d4" />
          </div>
          <span className={styles.heroSideLabel}>{t.home.workoutLabel}</span>
          <motion.button
            type="button"
            className={styles.workoutBtn}
            whileTap={{ scale: 0.88 }}
            onClick={addWorkout}
            aria-label="log workout"
          >
            +
          </motion.button>
        </div>
      </div>

      {/* 4. HORIZONTAL SCROLLABLE WIDGETS */}
      <div className={styles.widgetsRow}>
        {/* Protein */}
        <div className={styles.widget}>
          <span className={styles.widgetTitle}>{t.home.proteinLabel}</span>
          <MiniRing value={selectedFitness.proteinG} goal={goals.proteinG} color="#a78bfa" />
          <span className={styles.widgetValue}>
            {selectedFitness.proteinG}{t.fitness.g}
          </span>
        </div>

        {/* Water */}
        <div className={styles.widget}>
          <span className={styles.widgetTitle}>{t.home.waterLabel}</span>
          <MiniRing value={selectedFitness.waterMl} goal={goals.waterMl} color="#06b6d4" />
          <span className={styles.widgetValue}>
            {selectedFitness.waterMl}{t.fitness.ml}
          </span>
        </div>

        {/* Streak */}
        <div className={styles.widget}>
          <span className={styles.widgetTitle}>{t.home.streakLabel}</span>
          <StreakFlame />
          <span className={styles.streakBigNum}>{streak}</span>
          <span className={styles.widgetValue}>{t.home.streakSub}</span>
        </div>
      </div>

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
        <span>{t.home.askPhantom}</span>
      </motion.button>

      {/* 7. LAST ENTRY CARD */}
      <Card className={styles.lastEntryCard} onClick={() => navigate('journal')}>
        <span className={styles.sectionLabel}>{t.home.lastEntrySection}</span>
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
          <p className={styles.emptyEntry}>{t.home.emptyEntry}</p>
        )}
      </Card>
    </div>
  )
}
