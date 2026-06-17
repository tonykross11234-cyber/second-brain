import { useState } from 'react'
import { motion } from 'framer-motion'
import { useProfileStore } from '../store/useProfileStore'
import { useTranslation } from '../lib/useTranslation'
import { resetAllData } from '../lib/reset-data'
import { Card } from '../components/Card'
import { ThemeToggle } from '../components/ThemeToggle'
import { LanguageToggle } from '../components/LanguageToggle'
import { TasksSection } from '../components/TasksSection'
import { PinSetupFlow } from '../components/PinSetupFlow'
import styles from './ProfileScreen.module.css'

export function ProfileScreen() {
  const { t } = useTranslation()
  const {
    name, weightKg, heightCm, age,
    pinEnabled,
    setName, setBiometrics, enablePin, disablePin,
  } = useProfileStore()

  const [showPinSetup, setShowPinSetup] = useState(false)

  function handleReset() {
    if (window.confirm(t.settings.resetConfirm)) {
      resetAllData()
    }
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

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h1>{t.profile.title}</h1>
      </header>

      {/* Profile card */}
      <Card className={styles.section}>
        <div className={styles.fieldRow}>
          <label className={styles.fieldLabel} htmlFor="p-name">{t.profile.nameLabel}</label>
          <input
            id="p-name"
            className={styles.textInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.profile.namePlaceholder}
          />
        </div>

        <div className={styles.divider} />

        <span className={styles.sectionTitle}>{t.profile.biometrics}</span>
        <div className={styles.biometricsRow}>
          <div className={styles.bioField}>
            <label className={styles.bioLabel} htmlFor="p-weight">{t.profile.weight}</label>
            <div className={styles.bioInput}>
              <input
                id="p-weight"
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
          <div className={styles.bioField}>
            <label className={styles.bioLabel} htmlFor="p-height">{t.profile.height}</label>
            <div className={styles.bioInput}>
              <input
                id="p-height"
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
          <div className={styles.bioField}>
            <label className={styles.bioLabel} htmlFor="p-age">{t.profile.age}</label>
            <div className={styles.bioInput}>
              <input
                id="p-age"
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
        </div>
      </Card>

      {/* PIN card */}
      <Card className={styles.section}>
        <span className={styles.sectionTitle}>{t.pin.sectionTitle}</span>
        <div className={styles.pinRow}>
          <div className={styles.pinInfo}>
            <span className={styles.pinLabel}>{t.pin.enabledLabel}</span>
            <span className={`${styles.pinStatus} ${pinEnabled ? styles.pinOn : styles.pinOff}`}>
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

      {/* Tasks */}
      <span className={styles.standaloneSectionTitle}>{t.profile.tasksSection}</span>
      <TasksSection />

      {/* Settings */}
      <Card className={styles.section}>
        <span className={styles.sectionTitle}>{t.profile.settingsSection}</span>
        <div className={styles.settingsRow}>
          <span className={styles.fieldLabel}>{t.settings.theme}</span>
          <ThemeToggle />
        </div>
        <div className={styles.divider} />
        <div className={styles.settingsRow}>
          <span className={styles.fieldLabel}>{t.settings.language}</span>
          <LanguageToggle />
        </div>
        <div className={styles.divider} />
        <p className={styles.about}>{t.settings.about}</p>
        <button type="button" className={styles.resetButton} onClick={handleReset}>
          {t.settings.resetData}
        </button>
      </Card>

      {/* PIN setup overlay */}
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
