import { useState } from 'react'
import { motion } from 'framer-motion'
import { useProfileStore } from '../store/useProfileStore'
import { useSettingsStore } from '../store/useSettingsStore'
import { useFitnessStore } from '../store/useFitnessStore'
import { useTranslation } from '../lib/useTranslation'
import type { Theme, Language } from '../lib/types'
import { Card } from '../components/Card'
import { PinSetupFlow } from '../components/PinSetupFlow'
import styles from './ProfileScreen.module.css'

type GoalField = 'calories' | 'proteinG' | 'waterMl'

export function ProfileScreen() {
  const { t } = useTranslation()
  const {
    name, weightKg, heightCm, age,
    pinEnabled,
    setName, setBiometrics, enablePin, disablePin,
  } = useProfileStore()

  const theme = useSettingsStore((s) => s.theme)
  const language = useSettingsStore((s) => s.language)
  const setTheme = useSettingsStore((s) => s.setTheme)
  const setLanguage = useSettingsStore((s) => s.setLanguage)

  const goals = useFitnessStore((s) => s.goals)
  const setGoals = useFitnessStore((s) => s.setGoals)

  const [showPinSetup, setShowPinSetup] = useState(false)
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

  function handleWeightChange(raw: string) {
    const v = raw === '' ? null : parseFloat(raw)
    setBiometrics({ weightKg: v != null && !isNaN(v) ? v : null })
  }

  function handleHeightChange(raw: string) {
    const v = raw === '' ? null : parseFloat(raw)
    setBiometrics({ heightCm: v != null && !isNaN(v) ? v : null })
  }

  function handleAgeChange(raw: string) {
    const v = raw === '' ? null : parseInt(raw, 10)
    setBiometrics({ age: v != null && !isNaN(v) ? v : null })
  }

  const initials = name
    ? name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <div className={styles.screen}>

      {/* 1. TOP AVATAR SECTION */}
      <div className={styles.avatarSection}>
        <div className={styles.avatarCircle}>
          <span className={styles.avatarInitials}>{initials}</span>
        </div>
        {name ? (
          <p className={styles.avatarName}>{name}</p>
        ) : (
          <p className={styles.avatarNameEmpty}>{t.profile.nameEmpty}</p>
        )}
        <p className={styles.avatarSub}>{t.profile.memberSince}</p>
      </div>

      {/* 2. NAME CARD */}
      <Card className={styles.card}>
        <span className={styles.sectionLabel}>{t.profile.sectionProfile}</span>
        <div className={styles.fieldRow}>
          <span className={styles.fieldLabel}>{t.profile.nameLabel}</span>
          <input
            className={styles.textInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.profile.namePlaceholder}
          />
        </div>
      </Card>

      {/* 3. BIOMETRICS CARD */}
      <Card className={styles.card}>
        <span className={styles.sectionLabel}>{t.profile.sectionBiometrics}</span>

        <div className={styles.fieldRow}>
          <span className={styles.fieldLabel}>{t.profile.weight}</span>
          <div className={styles.bioRight}>
            <input
              type="number"
              className={styles.numberInput}
              value={weightKg ?? ''}
              onChange={(e) => handleWeightChange(e.target.value)}
              placeholder="—"
              min={0}
              max={300}
            />
            <span className={styles.unit}>{t.profile.weightUnit}</span>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.fieldRow}>
          <span className={styles.fieldLabel}>{t.profile.height}</span>
          <div className={styles.bioRight}>
            <input
              type="number"
              className={styles.numberInput}
              value={heightCm ?? ''}
              onChange={(e) => handleHeightChange(e.target.value)}
              placeholder="—"
              min={0}
              max={300}
            />
            <span className={styles.unit}>{t.profile.heightUnit}</span>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.fieldRow}>
          <span className={styles.fieldLabel}>{t.profile.age}</span>
          <div className={styles.bioRight}>
            <input
              type="number"
              className={styles.numberInput}
              value={age ?? ''}
              onChange={(e) => handleAgeChange(e.target.value)}
              placeholder="—"
              min={0}
              max={120}
            />
            <span className={styles.unit}>{t.profile.ageUnit}</span>
          </div>
        </div>
      </Card>

      {/* 4. GOALS CARD */}
      <Card className={styles.card}>
        <span className={styles.sectionLabel}>{t.profile.sectionGoals}</span>

        <div className={styles.fieldRow}>
          <span className={styles.fieldLabel}>{t.fitness.goalCalories}</span>
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
              <span className={styles.unit}>{t.fitness.kcal}</span>
            </div>
          ) : (
            <button type="button" className={styles.goalValBtn}
              onClick={() => startEdit('calories', goals.calories)}>
              {goals.calories} {t.fitness.kcal}
            </button>
          )}
        </div>

        <div className={styles.divider} />

        <div className={styles.fieldRow}>
          <span className={styles.fieldLabel}>{t.fitness.goalProtein}</span>
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
              <span className={styles.unit}>{t.fitness.g}</span>
            </div>
          ) : (
            <button type="button" className={styles.goalValBtn}
              onClick={() => startEdit('proteinG', goals.proteinG)}>
              {goals.proteinG} {t.fitness.g}
            </button>
          )}
        </div>

        <div className={styles.divider} />

        <div className={styles.fieldRow}>
          <span className={styles.fieldLabel}>{t.fitness.goalWater}</span>
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
              <span className={styles.unit}>{t.fitness.ml}</span>
            </div>
          ) : (
            <button type="button" className={styles.goalValBtn}
              onClick={() => startEdit('waterMl', goals.waterMl)}>
              {goals.waterMl} {t.fitness.ml}
            </button>
          )}
        </div>
      </Card>

      {/* 5. SECURITY CARD */}
      <Card className={styles.card}>
        <span className={styles.sectionLabel}>{t.pin.sectionTitle}</span>
        <div className={styles.pinRow}>
          <div className={styles.pinInfo}>
            <span className={styles.pinLabel}>{t.pin.enabledLabel}</span>
            <span className={`${styles.pinBadge} ${pinEnabled ? styles.pinBadgeOn : styles.pinBadgeOff}`}>
              {pinEnabled ? t.pin.enabledOn : t.pin.enabledOff}
            </span>
          </div>
          <motion.button
            type="button"
            className={`${styles.pinToggle} ${pinEnabled ? styles.pinToggleOff : styles.pinToggleOn}`}
            whileTap={{ scale: 0.95 }}
            onClick={() => pinEnabled ? disablePin() : setShowPinSetup(true)}
          >
            {pinEnabled ? t.common.cancel : t.pin.offerSetup}
          </motion.button>
        </div>
        <p className={styles.disclaimer}>{t.pin.disclaimer}</p>
      </Card>

      {/* 5. SETTINGS CARD */}
      <Card className={styles.card}>
        <span className={styles.sectionLabel}>{t.settings.appearance}</span>

        <div className={styles.settingsRow}>
          <span className={styles.fieldLabel}>{t.settings.theme}</span>
          <div className={styles.segmented}>
            {([['dark', t.settings.themeDark], ['light', t.settings.themeLight]] as [Theme, string][]).map(([val, label]) => (
              <button
                key={val}
                type="button"
                className={`${styles.segOption} ${theme === val ? styles.segActive : ''}`}
                onClick={() => setTheme(val)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.settingsRow}>
          <span className={styles.fieldLabel}>{t.settings.language}</span>
          <div className={styles.segmented}>
            {([['ru', 'RU'], ['en', 'EN']] as [Language, string][]).map(([val, label]) => (
              <button
                key={val}
                type="button"
                className={`${styles.segOption} ${language === val ? styles.segActive : ''}`}
                onClick={() => setLanguage(val)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* 6. PIN SETUP OVERLAY */}
      {showPinSetup && (
        <div className={styles.overlay}>
          <PinSetupFlow
            onComplete={(pin) => {
              enablePin(pin)
              setShowPinSetup(false)
            }}
            onCancel={() => setShowPinSetup(false)}
          />
        </div>
      )}
    </div>
  )
}
