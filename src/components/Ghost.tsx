import { useId } from 'react'
import styles from './Ghost.module.css'

export type GhostState = 'idle' | 'workout' | 'win' | 'thinking' | 'sleep' | 'surprised' | 'sad'

interface GhostProps {
  state?: GhostState
  size?: 'sm' | 'md' | 'lg'
  phrase?: string
}

const PX = { sm: 60, md: 92, lg: 132 } as const

/* Ghost body path — viewBox 0 0 80 100
   Rounded head, straight sides, three scallop bumps at the bottom */
const BODY = [
  'M 40 8',
  'C 63 8 71 24 71 42',
  'L 71 72',
  'Q 63 85 55 72',
  'Q 47 85 40 72',
  'Q 33 85 25 72',
  'L 9 72',
  'C 9 24 17 8 40 8 Z',
].join(' ')

type Cfg = {
  bodyColor: string   // semi-opaque fill
  innerColor: string  // lighter highlight at top
  glowColor: string   // drop-shadow color
  strokeColor: string
  animClass: string
}

const CFG: Record<GhostState, Cfg> = {
  idle:      { bodyColor: 'rgba(210,240,255,0.92)', innerColor: 'rgba(255,255,255,0.70)', glowColor: 'rgba(6,182,212,0.5)',   strokeColor: 'rgba(6,182,212,0.35)',   animClass: styles.animFloat    },
  workout:   { bodyColor: 'rgba(255,232,212,0.92)', innerColor: 'rgba(255,255,255,0.65)', glowColor: 'rgba(249,115,22,0.5)',  strokeColor: 'rgba(249,115,22,0.35)',  animClass: styles.animBounce   },
  win:       { bodyColor: 'rgba(255,248,200,0.95)', innerColor: 'rgba(255,255,255,0.72)', glowColor: 'rgba(251,191,36,0.55)', strokeColor: 'rgba(251,191,36,0.40)',  animClass: styles.animBounce   },
  thinking:  { bodyColor: 'rgba(232,218,255,0.92)', innerColor: 'rgba(255,255,255,0.65)', glowColor: 'rgba(124,58,237,0.45)', strokeColor: 'rgba(124,58,237,0.35)', animClass: styles.animSlow     },
  sleep:     { bodyColor: 'rgba(208,220,255,0.90)', innerColor: 'rgba(255,255,255,0.60)', glowColor: 'rgba(99,102,241,0.4)', strokeColor: 'rgba(99,102,241,0.30)',  animClass: styles.animSlow     },
  surprised: { bodyColor: 'rgba(212,244,255,0.95)', innerColor: 'rgba(255,255,255,0.72)', glowColor: 'rgba(14,165,233,0.55)', strokeColor: 'rgba(14,165,233,0.40)', animClass: styles.animShake    },
  sad:       { bodyColor: 'rgba(198,214,230,0.88)', innerColor: 'rgba(255,255,255,0.55)', glowColor: 'rgba(100,116,139,0.4)', strokeColor: 'rgba(100,116,139,0.3)', animClass: styles.animFloat    },
}

/* Eye anchor positions */
const EL = { cx: 29, cy: 38 }
const ER = { cx: 51, cy: 38 }
const EYE = '#1e293b'

function Eyes({ state }: { state: GhostState }) {
  switch (state) {
    case 'idle':
      return (
        <g>
          <circle {...EL} r={4.5} fill={EYE} />
          <circle {...ER} r={4.5} fill={EYE} />
          <circle cx={EL.cx + 1.5} cy={EL.cy - 1.5} r={1.6} fill="white" />
          <circle cx={ER.cx + 1.5} cy={ER.cy - 1.5} r={1.6} fill="white" />
        </g>
      )

    case 'workout':
      return (
        <g>
          <ellipse {...EL} rx={4.5} ry={2.8} fill={EYE} />
          <ellipse {...ER} rx={4.5} ry={2.8} fill={EYE} />
          {/* angry brows */}
          <path d={`M ${EL.cx-5} ${EL.cy-5.5} L ${EL.cx+5} ${EL.cy-3.5}`}
            stroke={EYE} strokeWidth={2} strokeLinecap="round" fill="none" />
          <path d={`M ${ER.cx-5} ${ER.cy-3.5} L ${ER.cx+5} ${ER.cy-5.5}`}
            stroke={EYE} strokeWidth={2} strokeLinecap="round" fill="none" />
        </g>
      )

    case 'win': {
      /* Star-shaped eyes */
      const star = (cx: number, cy: number) =>
        `M ${cx} ${cy-5} L ${cx+1.2} ${cy-1.2} L ${cx+5} ${cy} L ${cx+1.2} ${cy+1.2} ` +
        `L ${cx} ${cy+5} L ${cx-1.2} ${cy+1.2} L ${cx-5} ${cy} L ${cx-1.2} ${cy-1.2} Z`
      return (
        <g>
          <path d={star(EL.cx, EL.cy)} fill="#f59e0b" />
          <path d={star(ER.cx, ER.cy)} fill="#f59e0b" />
        </g>
      )
    }

    case 'thinking':
      return (
        <g>
          <circle {...EL} r={4.5} fill={EYE} />
          <circle {...ER} r={4.5} fill={EYE} />
          {/* pupils shifted up-right — "looking up" */}
          <circle cx={EL.cx + 1} cy={EL.cy - 2} r={2} fill="white" />
          <circle cx={ER.cx + 1} cy={ER.cy - 2} r={2} fill="white" />
        </g>
      )

    case 'sleep':
      return (
        <g stroke={EYE} strokeWidth={2.5} strokeLinecap="round" fill="none">
          <path d={`M ${EL.cx-5} ${EL.cy+1} Q ${EL.cx} ${EL.cy-3.5} ${EL.cx+5} ${EL.cy+1}`} />
          <path d={`M ${ER.cx-5} ${ER.cy+1} Q ${ER.cx} ${ER.cy-3.5} ${ER.cx+5} ${ER.cy+1}`} />
        </g>
      )

    case 'surprised':
      return (
        <g>
          <circle {...EL} r={7} fill={EYE} />
          <circle {...ER} r={7} fill={EYE} />
          <circle cx={EL.cx + 2} cy={EL.cy - 2} r={2.2} fill="white" />
          <circle cx={ER.cx + 2} cy={ER.cy - 2} r={2.2} fill="white" />
        </g>
      )

    case 'sad':
      return (
        <g>
          <circle cx={EL.cx} cy={EL.cy + 1} r={4} fill={EYE} />
          <circle cx={ER.cx} cy={ER.cy + 1} r={4} fill={EYE} />
          {/* droopy brows */}
          <path d={`M ${EL.cx-5} ${EL.cy-5} L ${EL.cx+4} ${EL.cy-3}`}
            stroke={EYE} strokeWidth={2} strokeLinecap="round" fill="none" />
          <path d={`M ${ER.cx-4} ${ER.cy-3} L ${ER.cx+5} ${ER.cy-5}`}
            stroke={EYE} strokeWidth={2} strokeLinecap="round" fill="none" />
        </g>
      )
  }
}

function Mouth({ state }: { state: GhostState }) {
  const x = 40
  const y = 53
  switch (state) {
    case 'idle':
      return <path d={`M ${x-9} ${y} Q ${x} ${y+7} ${x+9} ${y}`}
        stroke={EYE} strokeWidth={2} fill="none" strokeLinecap="round" />
    case 'workout':
      return <path d={`M ${x-8} ${y} L ${x+8} ${y}`}
        stroke={EYE} strokeWidth={2.5} strokeLinecap="round" />
    case 'win':
      return <path d={`M ${x-12} ${y} Q ${x} ${y+11} ${x+12} ${y}`}
        stroke={EYE} strokeWidth={2.5} fill="none" strokeLinecap="round" />
    case 'thinking':
      return <path d={`M ${x-7} ${y+3} Q ${x} ${y-1} ${x+7} ${y+3}`}
        stroke={EYE} strokeWidth={2} fill="none" strokeLinecap="round" />
    case 'sleep':
      return <path d={`M ${x-5} ${y+3} Q ${x} ${y+6} ${x+5} ${y+3}`}
        stroke={EYE} strokeWidth={1.5} fill="none" strokeLinecap="round" />
    case 'surprised':
      return <ellipse cx={x} cy={y+4} rx={5.5} ry={7} fill={EYE} />
    case 'sad':
      return <path d={`M ${x-9} ${y+6} Q ${x} ${y-2} ${x+9} ${y+6}`}
        stroke={EYE} strokeWidth={2} fill="none" strokeLinecap="round" />
  }
}

function Extras({ state }: { state: GhostState }) {
  switch (state) {
    case 'workout':
      /* sweat drop */
      return <path d="M 71 22 Q 68 28 68 32 A 3.5 3.5 0 0 0 75 32 Q 75 27 71 22 Z" fill="rgba(96,165,250,0.85)" />

    case 'win':
      /* sparkle stars */
      return (
        <g fill="#fbbf24" opacity={0.9}>
          <path d="M 9 18 L 10.2 14.8 L 11.4 18 L 14.6 19.2 L 11.4 20.4 L 10.2 23.6 L 9 20.4 L 5.8 19.2 Z" />
          <path d="M 68 11 L 69 8.2 L 70 11 L 72.8 12 L 70 13 L 69 15.8 L 68 13 L 65.2 12 Z" />
          <path d="M 73 62 L 74 59.5 L 75 62 L 77.5 63 L 75 64 L 74 66.5 L 73 64 L 70.5 63 Z" />
        </g>
      )

    case 'thinking':
      /* thought bubbles */
      return (
        <g fill="rgba(124,58,237,0.45)">
          <circle cx={65} cy={19} r={3} />
          <circle cx={71} cy={12} r={4.5} />
          <circle cx={78} cy={5} r={3.2} />
        </g>
      )

    case 'sleep':
      /* ZZZ — using SVG text for simplicity */
      return (
        <g fill="rgba(99,102,241,0.65)" fontFamily="system-ui,sans-serif" fontWeight={700}>
          <text x={67} y={30} fontSize={7}>Z</text>
          <text x={71} y={21} fontSize={9}>Z</text>
          <text x={76} y={13} fontSize={11}>Z</text>
        </g>
      )

    case 'sad':
      /* single teardrop */
      return <path d="M 29 49 L 27 55 Q 24 59 27 62 A 3 3 0 0 0 32 59 Q 32 54 29 49 Z" fill="rgba(96,165,250,0.80)" />

    default:
      return null
  }
}

export function Ghost({ state = 'idle', size = 'md', phrase }: GhostProps) {
  const uid = useId()
  const px = PX[size]
  const cfg = CFG[state]

  /* Gradient id unique per React tree instance */
  const gradId = `ghost-g-${uid}`

  return (
    <div className={styles.wrap}>
      <div
        className={cfg.animClass}
        style={{ filter: `drop-shadow(0 0 9px ${cfg.glowColor})` }}
      >
        <svg
          viewBox="0 0 80 100"
          width={px}
          height={px * 1.25}
          overflow="visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id={gradId} cx="38%" cy="22%" r="72%" gradientUnits="userSpaceOnUse"
              x1="0" y1="0" x2="80" y2="100">
              <stop offset="0%" stopColor={cfg.innerColor} />
              <stop offset="100%" stopColor={cfg.bodyColor} />
            </radialGradient>
          </defs>

          {/* Ghost body */}
          <path
            d={BODY}
            fill={`url(#${gradId})`}
            stroke={cfg.strokeColor}
            strokeWidth={1.5}
          />

          {/* Face */}
          <Eyes state={state} />
          <Mouth state={state} />
          <Extras state={state} />
        </svg>
      </div>

      {phrase && (
        <div className={styles.bubble}>{phrase}</div>
      )}
    </div>
  )
}
