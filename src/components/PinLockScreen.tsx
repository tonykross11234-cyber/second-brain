import { useState } from 'react'
import { motion } from 'framer-motion'
import { PinPad } from './PinPad'
import { PinSetupFlow } from './PinSetupFlow'
import { useProfileStore } from '../store/useProfileStore'
import { useTranslation } from '../lib/useTranslation'
import { resetAllData } from '../lib/reset-data'
import styles from './PinLockScreen.module.css'

interface PinLockScreenProps {
  onUnlock: () => void
}

type Mode = 'offer' | 'setup' | 'unlock'

export function PinLockScreen({ onUnlock }: PinLockScreenProps) {
  const { t } = useTranslation()
  const pinEnabled = useProfileStore((s) => s.pinEnabled)
  const pinCode = useProfileStore((s) => s.pinCode)
  const enablePin = useProfileStore((s) => s.enablePin)
  const markPinSetupOffered = useProfileStore((s) => s.markPinSetupOffered)

  const [mode, setMode] = useState<Mode>(pinEnabled ? 'unlock' : 'offer')
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  function handleDigit(digit: string) {
    if (value.length >= 4 || error) return
    const next = value + digit
    setValue(next)
    if (next.length < 4) return
    if (next === pinCode) {
      onUnlock()
    } else {
      setError(true)
      setTimeout(() => {
        setError(false)
        setValue('')
      }, 700)
    }
  }

  function handleDelete() {
    setValue((v) => v.slice(0, -1))
  }

  function handleForgot() {
    if (window.confirm(t.pin.forgotPinConfirm)) {
      resetAllData()
      onUnlock()
    }
  }

  if (mode === 'offer') {
    return (
      <div className={styles.screen}>
        <div className={styles.offerCard}>
          <h2 className={styles.offerTitle}>{t.pin.offerTitle}</h2>
          <p className={styles.offerBody}>{t.pin.offerBody}</p>
          <p className={styles.disclaimer}>{t.pin.disclaimer}</p>
          <div className={styles.offerButtons}>
            <motion.button
              type="button"
              className={styles.primaryButton}
              whileTap={{ scale: 0.96 }}
              onClick={() => setMode('setup')}
            >
              {t.pin.offerSetup}
            </motion.button>
            <button
              type="button"
              className={styles.skipButton}
              onClick={() => {
                markPinSetupOffered()
                onUnlock()
              }}
            >
              {t.pin.offerSkip}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'setup') {
    return (
      <div className={styles.screen}>
        <PinSetupFlow
          onComplete={(pin) => {
            enablePin(pin)
            onUnlock()
          }}
          onCancel={() => {
            markPinSetupOffered()
            onUnlock()
          }}
        />
      </div>
    )
  }

  return (
    <div className={styles.screen}>
      <PinPad
        title={t.pin.unlockTitle}
        length={value.length}
        error={error}
        errorText={t.pin.wrongPin}
        onDigit={handleDigit}
        onDelete={handleDelete}
      />
      <button type="button" className={styles.forgotLink} onClick={handleForgot}>
        {t.pin.forgotPin}
      </button>
    </div>
  )
}
