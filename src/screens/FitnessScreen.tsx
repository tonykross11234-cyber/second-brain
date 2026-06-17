import { motion } from 'framer-motion'
import { useFitnessStore } from '../store/useFitnessStore'
import { useTranslation } from '../lib/useTranslation'
import { todayKey } from '../lib/date-utils'
import { Card } from '../components/Card'
import styles from './FitnessScreen.module.css'

export function FitnessScreen() {
  const { t } = useTranslation()
  const fitnessDays = useFitnessStore((s) => s.days)
  const goals = useFitnessStore((s) => s.goals)
  const addToday = useFitnessStore((s) => s.addToday)

  const today = fitnessDays.find((d) => d.date === todayKey()) ?? { calories: 0, proteinG: 0, waterMl: 0 }

  function pct(val: number, goal: number) {
    return Math.min(100, goal > 0 ? Math.round((val / goal) * 100) : 0)
  }

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h1>{t.fitness.title}</h1>
      </header>

      <div className={styles.statsGrid}>
        <Card className={`${styles.statCard} ${styles.calCard}`}>
          <span className={styles.statVal}>{today.calories}</span>
          <span className={styles.statUnit}>{t.fitness.kcal}</span>
          <span className={styles.statName}>{t.fitness.caloriesLabel}</span>
          <div className={styles.miniBar}>
            <div className={styles.miniFill} style={{ width: `${pct(today.calories, goals.calories)}%`, background: 'var(--accent-gradient)' }} />
          </div>
        </Card>
        <Card className={`${styles.statCard} ${styles.protCard}`}>
          <span className={styles.statVal}>{today.proteinG}</span>
          <span className={styles.statUnit}>{t.fitness.g}</span>
          <span className={styles.statName}>{t.fitness.proteinLabel}</span>
          <div className={styles.miniBar}>
            <div className={styles.miniFill} style={{ width: `${pct(today.proteinG, goals.proteinG)}%`, background: 'linear-gradient(135deg, #34d399, #06b6d4)' }} />
          </div>
        </Card>
        <Card className={`${styles.statCard} ${styles.waterCard}`}>
          <span className={styles.statVal}>{today.waterMl}</span>
          <span className={styles.statUnit}>{t.fitness.ml}</span>
          <span className={styles.statName}>{t.fitness.waterLabel}</span>
          <div className={styles.miniBar}>
            <div className={styles.miniFill} style={{ width: `${pct(today.waterMl, goals.waterMl)}%`, background: 'linear-gradient(135deg, #38bdf8, #818cf8)' }} />
          </div>
        </Card>
      </div>

      <Card className={styles.quickSection}>
        <span className={styles.sectionLabel}>{t.fitness.quickAdd} — {t.fitness.caloriesLabel}</span>
        <div className={styles.btnRow}>
          {[100, 200, 300, 500].map((n) => (
            <motion.button
              key={n}
              type="button"
              className={styles.quickBtn}
              whileTap={{ scale: 0.92 }}
              onClick={() => addToday({ calories: n })}
            >
              +{n}
            </motion.button>
          ))}
        </div>
      </Card>

      <Card className={styles.quickSection}>
        <span className={styles.sectionLabel}>{t.fitness.quickAdd} — {t.fitness.proteinLabel}</span>
        <div className={styles.btnRow}>
          {[10, 20, 30, 50].map((n) => (
            <motion.button
              key={n}
              type="button"
              className={`${styles.quickBtn} ${styles.quickBtnGreen}`}
              whileTap={{ scale: 0.92 }}
              onClick={() => addToday({ proteinG: n })}
            >
              +{n}{t.fitness.g}
            </motion.button>
          ))}
        </div>
      </Card>

      <Card className={styles.quickSection}>
        <span className={styles.sectionLabel}>{t.fitness.quickAdd} — {t.fitness.waterLabel}</span>
        <div className={styles.btnRow}>
          {[150, 250, 500, 750].map((n) => (
            <motion.button
              key={n}
              type="button"
              className={`${styles.quickBtn} ${styles.quickBtnBlue}`}
              whileTap={{ scale: 0.92 }}
              onClick={() => addToday({ waterMl: n })}
            >
              +{n}{t.fitness.ml}
            </motion.button>
          ))}
        </div>
      </Card>

      <Card className={styles.goalsSection}>
        <span className={styles.sectionLabel}>{t.fitness.goalsLabel}</span>
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
    </div>
  )
}
