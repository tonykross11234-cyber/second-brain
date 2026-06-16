import styles from './EmptyState.module.css'

interface EmptyStateProps {
  icon: string
  title: string
  body?: string
}

export function EmptyState({ icon, title, body }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      {body && <p className={styles.body}>{body}</p>}
    </div>
  )
}
