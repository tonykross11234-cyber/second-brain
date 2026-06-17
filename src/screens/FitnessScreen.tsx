import { motion } from 'framer-motion'
import { useFitnessStore } from '../store/useFitnessStore'
import { useNavStore } from '../store/useNavStore'
import { useTranslation } from '../lib/useTranslation'
import { todayKey } from '../lib/date-utils'
import { Card } from '../components/Card'
import { Flame, Zap, Droplets, MessageCircle, Target } from '../lib/icons'
import styles from './FitnessScreen.module.css'

function pct(val: number, goal: number): number {
  return Math.min(100, goal > 0 ? Math.round((val / goal) * 100) : 0)
}

export function FitnessScreen() {
  const { t } = useTranslation()
  const fitnessDays = useFitnessStore((s) => s.days)
  const goals = useFitnessStore((s) => s.goals)
  const addToday = useFitnessStore((s) => s.addToday)
  const navigate = useNavStore((s) => s.navigate)

  const today = fitnessDays.find((d) => d.date === todayKey()) ?? {
    calories: 0,
    proteinG: 0,
    waterMl: 0,
  }

  return (
    <div className={styles.screen}>
      {/* 1. HEADER ROW */}
      <div className={styles.header}>
        <h1 className={styles.title}>{t.fitness.title}</h1>
      </div>

      {/* 2. STATS GRID */}
      <div className={styles.statsGrid}>
        {/* Calories */}
        <div className={styles.statCard}>
          <Flame size={20} style={{ color: '#f97316' }} />
          <span className={`${styles.statVal} ${styles.statValCal}`}>
            {today.calories}
          </span>
          <span className={styles.statUnit}>{t.fitness.kcal}</span>
          <span className={styles.statLabel}>{t.fitness.caloriesLabel}</span>
          <div className={styles.miniBar}>
            <div
              className={styles.miniFill}
              style={{
                width: `${pct(today.calories, goals.calories)}%`,
                background: 'linear-gradient(135deg, #f97316, #fbbf24)',
              }}
            />
          </div>
        </div>

        {/* Protein */}
        <div className={styles.statCard}>
          <Zap size={20} style={{ color: '#7c3aed' }} />
          <span className={`${styles.statVal} ${styles.statValProt}`}>
            {today.proteinG}
          </span>
          <span className={styles.statUnit}>{t.fitness.g}</span>
          <span className={styles.statLabel}>{t.fitness.proteinLabel}</span>
          <div className={styles.miniBar}>
            <div
              className={styles.miniFill}
              style={{
                width: `${pct(today.proteinG, goals.proteinG)}%`,
                background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
              }}
            />
          </div>
        </div>

        {/* Water */}
        <div className={styles.statCard}>
          <Droplets size={20} style={{ color: '#06b6d4' }} />
          <span className={`${styles.statVal} ${styles.statValWater}`}>
            {today.waterMl}
          </span>
          <span className={styles.statUnit}>{t.fitness.ml}</span>
          <span className={styles.statLabel}>{t.fitness.waterLabel}</span>
          <div className={styles.miniBar}>
            <div
              className={styles.miniFill}
              style={{
                width: `${pct(today.waterMl, goals.waterMl)}%`,
                background: 'linear-gradient(135deg, #06b6d4, #38bdf8)',
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. QUICK ADD — Calories */}
      <Card className={styles.quickCard}>
        <span className={`${styles.sectionLabel} ${styles.labelCal}`}>
          {t.fitness.caloriesLabel}
        </span>
        <div className={styles.pillRow}>
          {([100, 200, 300, 500] as const).map((n) => (
            <motion.button
              key={n}
              type="button"
              className={`${styles.pill} ${styles.pillCal}`}
              whileTap={{ scale: 0.93 }}
              onClick={() => addToday({ calories: n })}
            >
              +{n}
            </motion.button>
          ))}
        </div>
      </Card>

      {/* 3. QUICK ADD — Protein */}
      <Card className={styles.quickCard}>
        <span className={`${styles.sectionLabel} ${styles.labelProt}`}>
          {t.fitness.proteinLabel}
        </span>
        <div className={styles.pillRow}>
          {([10, 20, 30, 50] as const).map((n) => (
            <motion.button
              key={n}
              type="button"
              className={`${styles.pill} ${styles.pillProt}`}
              whileTap={{ scale: 0.93 }}
              onClick={() => addToday({ proteinG: n })}
            >
              +{n}{t.fitness.g}
            </motion.button>
          ))}
        </div>
      </Card>

      {/* 3. QUICK ADD — Water */}
      <Card className={styles.quickCard}>
        <span className={`${styles.sectionLabel} ${styles.labelWater}`}>
          {t.fitness.waterLabel}
        </span>
        <div className={styles.pillRow}>
          {([150, 250, 500, 750] as const).map((n) => (
            <motion.button
              key={n}
              type="button"
              className={`${styles.pill} ${styles.pillWater}`}
              whileTap={{ scale: 0.93 }}
              onClick={() => addToday({ waterMl: n })}
            >
              +{n}{t.fitness.ml}
            </motion.button>
          ))}
        </div>
      </Card>

      {/* 4. GOALS CARD */}
      <Card className={styles.goalsCard}>
        <div className={styles.goalsTitleRow}>
          <Target size={14} style={{ color: 'var(--accent)' }} />
          <span className={`${styles.sectionLabel} ${styles.labelAccent} ${styles.sectionLabelInline}`}>
            {t.fitness.goalsLabel}
          </span>
        </div>
        <div className={styles.goalRow}>
          <span className={styles.goalName}>{t.fitness.goalCalories}</span>
          <span className={styles.goalVal}>{goals.calories} {t.fitness.kcal}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.goalRow}>
          <span className={styles.goalName}>{t.fitness.goalProtein}</span>
          <span className={styles.goalVal}>{goals.proteinG} {t.fitness.g}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.goalRow}>
          <span className={styles.goalName}>{t.fitness.goalWater}</span>
          <span className={styles.goalVal}>{goals.waterMl} {t.fitness.ml}</span>
        </div>
      </Card>

      {/* 5. CTA BUTTON */}
      <motion.button
        type="button"
        className={styles.ctaBtn}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate('chat')}
      >
        <MessageCircle size={16} />
        <span>Составить план с Phantom</span>
      </motion.button>
    </div>
  )
}
