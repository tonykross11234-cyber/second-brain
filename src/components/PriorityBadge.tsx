import type { Priority } from '../lib/types'
import { useTranslation } from '../lib/useTranslation'
import styles from './PriorityBadge.module.css'

interface PriorityBadgeProps {
  priority: Priority
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { t } = useTranslation()
  const label =
    priority === 'high'
      ? t.tasks.priorityHigh
      : priority === 'medium'
        ? t.tasks.priorityMedium
        : t.tasks.priorityLow

  return <span className={`${styles.badge} ${styles[priority]}`}>{label}</span>
}
