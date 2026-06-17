import { motion } from 'framer-motion'
import styles from './Phantom.module.css'

export type PhantomState = 'idle' | 'workout' | 'win' | 'thinking' | 'sleep' | 'surprised' | 'sad'
type PhantomSize = 'sm' | 'md' | 'lg'

interface PhantomProps {
  state: PhantomState
  size?: PhantomSize
  phrase?: string
}

const PX: Record<PhantomSize, number> = { sm: 60, md: 90, lg: 120 }

const CFG: Record<PhantomState, { color: string; glow: string; phrase: string }> = {
  idle:      { color: '#6d28d9', glow: '#7c3aed', phrase: 'Привет! Я слежу за твоим прогрессом 👻' },
  workout:   { color: '#b45309', glow: '#f97316', phrase: 'Давай! Ещё один подход! 🔥' },
  win:       { color: '#065f46', glow: '#10b981', phrase: 'ПОБЕДА! Ты это заслужил 🎉' },
  thinking:  { color: '#1e40af', glow: '#38bdf8', phrase: 'Анализирую... 🤔' },
  sleep:     { color: '#374151', glow: '#6b7280', phrase: 'Zzzz... разбуди меня тренировкой 😴' },
  surprised: { color: '#92400e', glow: '#fbbf24', phrase: 'ЛИЧНЫЙ РЕКОРД! Не верю своим глазам! 😱' },
  sad:       { color: '#1e3a5f', glow: '#3b82f6', phrase: 'Скучаю по тебе... приходи на тренировку 🫥' },
}

// Ghost body: dome arc (y=0–35) + rectangular sides + wavy bottom.
// Both paths have identical command types so SMIL can interpolate between them.
const W_A = 'M 15 35 A 35 35 0 0 1 85 35 L 85 65 Q 77 76 70 65 Q 62 54 55 65 Q 47 76 40 65 Q 32 54 25 65 Q 19 70 15 65 Z'
const W_B = 'M 15 35 A 35 35 0 0 1 85 35 L 85 65 Q 77 54 70 65 Q 62 76 55 65 Q 47 54 40 65 Q 32 76 25 65 Q 19 60 15 65 Z'

const CONFETTI = [
  { x: 12, y: 14, color: '#a78bfa', d: 0 },
  { x: 30, y:  6, color: '#38bdf8', d: 0.12 },
  { x: 50, y:  2, color: '#fbbf24', d: 0.07 },
  { x: 68, y:  8, color: '#10b981', d: 0.20 },
  { x: 88, y: 12, color: '#f87171', d: 0.09 },
  { x: 22, y:  4, color: '#f97316', d: 0.17 },
  { x: 78, y:  5, color: '#818cf8', d: 0.14 },
]

const ANIMS: Record<PhantomState, Record<string, number[]>> = {
  idle:      { y: [0, -8, 0] },
  thinking:  { y: [0, -8, 0] },
  sad:       { y: [0, -8, 0] },
  sleep:     { y: [0, -5, 0] },
  workout:   { y: [0, -14, 0] },
  win:       { y: [0, -5, 0] },
  surprised: { x: [0, -6, 6, -4, 4, 0] },
}

const DURS: Record<PhantomState, number> = {
  idle: 3, thinking: 3, sad: 3, sleep: 4, workout: 0.6, win: 1, surprised: 0.35,
}

function Eyes({ state, col }: { state: PhantomState; col: string }) {
  const base = (
    <g>
      <ellipse cx="36" cy="44" rx="7" ry="8" fill="white"/>
      <ellipse cx="64" cy="44" rx="7" ry="8" fill="white"/>
      <ellipse cx="37" cy="46" rx="3.5" ry="4" fill="#1a1a2e"/>
      <ellipse cx="65" cy="46" rx="3.5" ry="4" fill="#1a1a2e"/>
      <circle cx="39" cy="42" r="1.2" fill="white"/>
      <circle cx="67" cy="42" r="1.2" fill="white"/>
    </g>
  )
  if (state === 'win') return (
    <g>
      <path d="M 28 47 Q 36 40 44 47" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M 56 47 Q 64 40 72 47" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </g>
  )
  if (state === 'sleep') return (
    <g>
      <path d="M 28 44 Q 36 46 44 44" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M 56 44 Q 64 46 72 44" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </g>
  )
  if (state === 'surprised') return (
    <g>
      <ellipse cx="36" cy="44" rx="9" ry="10" fill="white"/>
      <ellipse cx="64" cy="44" rx="9" ry="10" fill="white"/>
      <circle cx="36" cy="44" r="5" fill="#1a1a2e"/>
      <circle cx="64" cy="44" r="5" fill="#1a1a2e"/>
      <circle cx="38" cy="41" r="1.5" fill="white"/>
      <circle cx="66" cy="41" r="1.5" fill="white"/>
    </g>
  )
  if (state === 'sad') return (
    <g>
      <ellipse cx="36" cy="46" rx="7" ry="8" fill="white"/>
      <ellipse cx="64" cy="46" rx="7" ry="8" fill="white"/>
      <ellipse cx="35" cy="49" rx="3.5" ry="4" fill="#1a1a2e"/>
      <ellipse cx="63" cy="49" rx="3.5" ry="4" fill="#1a1a2e"/>
      <circle cx="37" cy="44" r="1.2" fill="white"/>
      <circle cx="65" cy="44" r="1.2" fill="white"/>
    </g>
  )
  if (state === 'thinking') return (
    <g>
      {base}
      <ellipse cx="36" cy="44" rx="7" ry="0" fill={col}>
        <animate attributeName="ry" values="0;0;8;8;0" keyTimes="0;0.36;0.41;0.45;1" dur="3s" begin="0s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="64" cy="44" rx="7" ry="0" fill={col}>
        <animate attributeName="ry" values="0;0;8;8;0" keyTimes="0;0.36;0.41;0.45;1" dur="3s" begin="1.5s" repeatCount="indefinite"/>
      </ellipse>
    </g>
  )
  return base
}

function Mouth({ state, col }: { state: PhantomState; col: string }) {
  if (state === 'win')
    return <path d="M 33 57 Q 50 70 67 57" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
  if (state === 'sleep')
    return <path d="M 40 58 L 60 58" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  if (state === 'surprised')
    return <ellipse cx="50" cy="62" rx="7" ry="8" fill="white" opacity="0.9"/>
  if (state === 'sad')
    return <path d="M 37 62 Q 50 55 63 62" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
  if (state === 'workout') return (
    <g>
      <path d="M 33 57 Q 50 68 67 57" fill="white"/>
      {[39, 46, 53, 60].map(x => (
        <line key={x} x1={x} y1="57" x2={x} y2="64" stroke={col} strokeWidth="2"/>
      ))}
    </g>
  )
  return <path d="M 38 58 Q 50 65 62 58" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
}

export function Phantom({ state, size = 'md', phrase }: PhantomProps) {
  const px = PX[size]
  const cfg = CFG[state]
  const text = phrase ?? cfg.phrase
  const showBubble = size !== 'sm' || phrase !== undefined
  const waveDur = state === 'sleep' ? '3.5s' : state === 'workout' ? '0.7s' : '2s'

  return (
    <div className={styles.wrap}>
      <motion.div
        animate={ANIMS[state]}
        transition={{
          repeat: Infinity,
          duration: DURS[state],
          ease: 'easeInOut',
          ...(state === 'surprised' ? { repeatDelay: 2.5 } : {}),
        }}
        style={{ width: px, height: px * 1.1, overflow: 'visible' }}
      >
        <svg viewBox="0 0 100 110" width={px} height={px * 1.1} overflow="visible">
          {/* Ambient glow */}
          <ellipse cx="50" cy="48" rx="38" ry="36" fill={cfg.glow} style={{ filter: 'blur(14px)', opacity: 0.45 }}/>
          {/* Animated wavy body */}
          <path fill={cfg.color}>
            <animate attributeName="d" values={`${W_A};${W_B};${W_A}`} dur={waveDur} repeatCount="indefinite"/>
          </path>
          {/* Angry brows — workout */}
          {state === 'workout' && (
            <g>
              <path d="M 27 34 L 44 39" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <path d="M 73 34 L 56 39" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </g>
          )}
          {/* Sad drooping brows */}
          {state === 'sad' && (
            <g>
              <path d="M 28 40 L 43 35" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
              <path d="M 72 40 L 57 35" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
            </g>
          )}
          <Eyes state={state} col={cfg.color}/>
          <Mouth state={state} col={cfg.color}/>
          {/* Win confetti */}
          {state === 'win' && CONFETTI.map((c, i) => (
            <circle key={i} cx={c.x} cy={c.y} r="3" fill={c.color}>
              <animate attributeName="cy" values={`${c.y};${c.y + 45}`} dur="1.3s" begin={`${c.d}s`} repeatCount="indefinite"/>
              <animate attributeName="opacity" values="1;0" dur="1.3s" begin={`${c.d}s`} repeatCount="indefinite"/>
            </circle>
          ))}
          {/* Sleep Zzz */}
          {state === 'sleep' && (
            <text x="76" y="26" fontSize="14" fontWeight="bold" fill="white">
              <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite"/>
              z
            </text>
          )}
        </svg>
      </motion.div>

      {showBubble && (
        <div className={styles.bubble}>{text}</div>
      )}
    </div>
  )
}
