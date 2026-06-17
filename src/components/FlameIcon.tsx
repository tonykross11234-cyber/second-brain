import styles from './FlameIcon.module.css'

export function FlameIcon() {
  return (
    <svg
      className={styles.flame}
      width="18"
      height="24"
      viewBox="0 0 18 24"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="flameGrad" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#f97316"/>
          <stop offset="100%" stopColor="#fbbf24"/>
        </linearGradient>
      </defs>
      {/* outer flame */}
      <path
        fill="url(#flameGrad)"
        d="M9 1C9 1 16 8 15.5 14C15 18.5 12.5 21 9 22C5.5 21 3 18.5 2.5 14C2 8 9 1 9 1Z"
      />
      {/* inner core highlight */}
      <path
        fill="white"
        opacity="0.28"
        d="M9 9C9 9 12.5 13 12 16C11.5 18 10.2 19.5 9 20C7.8 19.5 6.5 18 6 16C5.5 13 9 9 9 9Z"
      />
    </svg>
  )
}
