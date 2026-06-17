import { useState } from 'react'
import { PinPad } from './PinPad'
import { useTranslation } from '../lib/useTranslation'
import styles from './PinSetupFlow.module.css'

interface PinSetupFlowProps {
  onComplete: (pin: string) => void
  onCancel: () => void
}

export function PinSetupFlow({ onComplete, onCancel }: PinSetupFlowProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState<'enter' | 'confirm'>('enter')
  const [firstPin, setFirstPin] = useState('')
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  function handleDigit(digit: string) {
    if (value.length >= 4 || error) return
    const next = value + digit
    setValue(next)
    if (next.length < 4) return

    if (step === 'enter') {
      setFirstPin(next)
      setTimeout(() => {
        setStep('confirm')
        setValue('')
      }, 150)
      return
    }

    if (next === firstPin) {
      onComplete(next)
    } else {
      setError(true)
      setTimeout(() => {
        setError(false)
        setValue('')
        setFirstPin('')
        setStep('enter')
      }, 700)
    }
  }

  function handleDelete() {
    setValue((v) => v.slice(0, -1))
  }

  return (
    <div className={styles.wrap}>
      <PinPad
        title={step === 'enter' ? t.pin.enterTitle : t.pin.confirmTitle}
        length={value.length}
        error={error}
        errorText={t.pin.mismatch}
        onDigit={handleDigit}
        onDelete={handleDelete}
      />
      <button type="button" className={styles.cancel} onClick={onCancel}>
        {t.pin.cancel}
      </button>
    </div>
  )
}
