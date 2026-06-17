import { useState } from 'react'
import { motion } from 'framer-motion'
import { useFitnessStore } from '../store/useFitnessStore'
import { useNavStore } from '../store/useNavStore'
import { useTranslation } from '../lib/useTranslation'
import { todayKey } from '../lib/date-utils'
import { Card } from '../components/Card'
import { MessageCircle, Target } from '../lib/icons'
import styles from './FitnessScreen.module.css'

type GoalField = 'calories' | 'proteinG' | 'waterMl'

function pct(val: number, goal: number): number {
  return Math.min(100, goal > 0 ? Math.round((val / goal) * 100) : 0)
}

export function FitnessScreen() {
  const { t } = useTranslation()
  const fitnessDays = useFitnessStore((s) => s.days)
  const goals = useFitnessStore((s) => s.goals)
  const addToday = useFitnessStore((s) => s.addToday)
  const setGoals = useFitnessStore((s) => s.setGoals)
  const navigate = useNavStore((s) => s.navigate)

  const [editingGoal, setEditingGoal] = useState<GoalField | null>(null)
  const [draftValue, setDraftValue] = useState('')

  function startEdit(field: GoalField, current: number) {
    setEditingGoal(field)
    setDraftValue(String(current))
  }

  function commitEdit() {
    if (!editingGoal) return
    const v = parseInt(draftValue, 10)
    if (!isNaN(v) && v > 0) setGoals({ [editingGoal]: v })
    setEditingGoal(null)
  }

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
          <span className={styles.statVal}>{today.calories}</span>
          <span className={styles.statGoal}>/ {goals.calories} {t.fitness.kcal}</span>
          <div className={styles.miniBar}>
            <div
              className={styles.miniFill}
              style={{
                width: `${pct(today.calories, goals.calories)}%`,
                background: 'linear-gradient(90deg, #f97316, #fbbf24)',
              }}
            />
          </div>
        </div>

        {/* Protein */}
        <div className={styles.statCard}>
          <span className={styles.statVal}>{today.proteinG}</span>
          <span className={styles.statGoal}>/ {goals.proteinG} {t.fitness.g}</span>
          <div className={styles.miniBar}>
            <div
              className={styles.miniFill}
              style={{
                width: `${pct(today.proteinG, goals.proteinG)}%`,
                background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
              }}
            />
          </div>
        </div>

        {/* Water */}
        <div className={styles.statCard}>
          <span className={styles.statVal}>{today.waterMl}</span>
          <span className={styles.statGoal}>/ {goals.waterMl} {t.fitness.ml}</span>
          <div className={styles.miniBar}>
            <div
              className={styles.miniFill}
              style={{
                width: `${pct(today.waterMl, goals.waterMl)}%`,
                background: 'linear-gradient(90deg, #06b6d4, #38bdf8)',
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
          {editingGoal === 'calories' ? (
            <div className={styles.goalEditRow}>
              <input
                type="number" min={1} autoFocus
                className={styles.goalInput}
                value={draftValue}
                onChange={(e) => setDraftValue(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => e.key === 'Enter' && commitEdit()}
              />
              <span className={styles.goalUnit}>{t.fitness.kcal}</span>
            </div>
          ) : (
            <button type="button" className={styles.goalValBtn}
              onClick={() => startEdit('calories', goals.calories)}>
              {goals.calories} {t.fitness.kcal}
            </button>
          )}
        </div>

        <div className={styles.divider} />

        <div className={styles.goalRow}>
          <span className={styles.goalName}>{t.fitness.goalProtein}</span>
          {editingGoal === 'proteinG' ? (
            <div className={styles.goalEditRow}>
              <input
                type="number" min={1} autoFocus
                className={styles.goalInput}
                value={draftValue}
                onChange={(e) => setDraftValue(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => e.key === 'Enter' && commitEdit()}
              />
              <span className={styles.goalUnit}>{t.fitness.g}</span>
            </div>
          ) : (
            <button type="button" className={styles.goalValBtn}
              onClick={() => startEdit('proteinG', goals.proteinG)}>
              {goals.proteinG} {t.fitness.g}
            </button>
          )}
        </div>

        <div className={styles.divider} />

        <div className={styles.goalRow}>
          <span className={styles.goalName}>{t.fitness.goalWater}</span>
          {editingGoal === 'waterMl' ? (
            <div className={styles.goalEditRow}>
              <input
                type="number" min={1} autoFocus
                className={styles.goalInput}
                value={draftValue}
                onChange={(e) => setDraftValue(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => e.key === 'Enter' && commitEdit()}
              />
              <span className={styles.goalUnit}>{t.fitness.ml}</span>
            </div>
          ) : (
            <button type="button" className={styles.goalValBtn}
              onClick={() => startEdit('waterMl', goals.waterMl)}>
              {goals.waterMl} {t.fitness.ml}
            </button>
          )}
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
        <span>{t.fitness.ctaLabel}</span>
      </motion.button>
    </div>
  )
}
