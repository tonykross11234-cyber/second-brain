import type { ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div className={`${styles.card} ${className ?? ''}`} onClick={onClick} role={onClick ? 'button' : undefined}>
      {children}
    </div>
  )
}
