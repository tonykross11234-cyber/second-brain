import { motion } from 'framer-motion'
import styles from './PinPad.module.css'

interface PinPadProps {
  title: string
  subtitle?: string
  length: number
  maxLength?: number
  error?: boolean
  errorText?: string
  onDigit: (digit: string) => void
  onDelete: () => void
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del']

export function PinPad({
  title,
  subtitle,
  length,
  maxLength = 4,
  error,
  errorText,
  onDigit,
  onDelete,
}: PinPadProps) {
  return (
    <div className={styles.pad}>
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

      <motion.div
        className={styles.dots}
        animate={error ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {Array.from({ length: maxLength }).map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i < length ? styles.filled : ''} ${error ? styles.dotError : ''}`}
          />
        ))}
      </motion.div>

      <p className={styles.errorText}>{error && errorText ? errorText : ' '}</p>

      <div className={styles.keys}>
        {KEYS.map((key, i) =>
          key === '' ? (
            <span key={i} className={styles.keySpacer} />
          ) : key === 'del' ? (
            <button key={i} type="button" className={styles.key} onClick={onDelete} aria-label="delete">
              ⌫
            </button>
          ) : (
            <motion.button
              key={i}
              type="button"
              className={styles.key}
              whileTap={{ scale: 0.92 }}
              onClick={() => onDigit(key)}
            >
              {key}
            </motion.button>
          )
        )}
      </div>
    </div>
  )
}
