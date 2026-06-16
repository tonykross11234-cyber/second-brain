import { useState } from 'react'
import { motion } from 'framer-motion'
import { useEntriesStore } from '../store/useEntriesStore'
import { useTranslation } from '../lib/useTranslation'
import { todayKey, formatDateLabel } from '../lib/date-utils'
import { Card } from '../components/Card'
import styles from './TodayScreen.module.css'

export function TodayScreen() {
  const { t, language } = useTranslation()
  const date = todayKey()
  const entry = useEntriesStore((s) => s.entries.find((e) => e.date === date))
  const upsertToday = useEntriesStore((s) => s.upsertToday)

  const [did, setDid] = useState(entry?.did ?? '')
  const [plans, setPlans] = useState(entry?.plans ?? '')
  const [thoughts, setThoughts] = useState(entry?.thoughts ?? '')
  const [justSaved, setJustSaved] = useState(false)

  function handleSave() {
    upsertToday(date, { did, plans, thoughts })
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2000)
  }

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h1>{t.today.title}</h1>
        <p className={styles.date}>{formatDateLabel(date, language)}</p>
      </header>

      <Card className={styles.fieldCard}>
        <label className={styles.label} htmlFor="field-did">
          {t.today.did}
        </label>
        <textarea
          id="field-did"
          className={styles.textarea}
          value={did}
          onChange={(e) => setDid(e.target.value)}
          placeholder={t.today.didPlaceholder}
          rows={3}
        />
      </Card>

      <Card className={styles.fieldCard}>
        <label className={styles.label} htmlFor="field-plans">
          {t.today.plans}
        </label>
        <textarea
          id="field-plans"
          className={styles.textarea}
          value={plans}
          onChange={(e) => setPlans(e.target.value)}
          placeholder={t.today.plansPlaceholder}
          rows={3}
        />
      </Card>

      <Card className={styles.fieldCard}>
        <label className={styles.label} htmlFor="field-thoughts">
          {t.today.thoughts}
        </label>
        <textarea
          id="field-thoughts"
          className={styles.textarea}
          value={thoughts}
          onChange={(e) => setThoughts(e.target.value)}
          placeholder={t.today.thoughtsPlaceholder}
          rows={3}
        />
      </Card>

      <motion.button
        type="button"
        className={styles.saveButton}
        whileTap={{ scale: 0.96 }}
        onClick={handleSave}
      >
        {justSaved ? `${t.today.saved} ✓` : t.today.save}
      </motion.button>
    </div>
  )
}
