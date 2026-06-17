import { useId } from 'react'
import styles from './Ghost.module.css'

export type GhostState = 'idle' | 'workout' | 'win' | 'thinking' | 'sleep' | 'surprised' | 'sad'

interface GhostProps {
  state?: GhostState
  size?: 'sm' | 'md' | 'lg'
  phrase?: string
}

const PX = { sm: 60, md: 90, lg: 130 } as const

/*
 * Ghost body — viewBox 0 0 100 110
 *
 * Head: semicircle from (17,50) to (83,50) going UPWARD (sweep=0, right→left)
 * Sides: straight down to y=86
 * Bottom: three downward bumps, each r=11, width=22
 *         going LEFT with sweep=0 → bumps go downward
 *
 * 17 ─────────────────────────── 83
 *              (head arc, upward)
 * 17 │                           │ 83
 * y=86 ╲──────────────────────── /
 *        bump1   bump2   bump3
 *       83→61   61→39   39→17
 */
const BODY = [
  'M 17 50',
  'A 33 33 0 0 0 83 50',  // upper semicircle (sweep=0 = upward when going right)
  'L 83 86',
  'A 11 11 0 0 0 61 86',  // right bump  (sweep=0 = downward when going left)
  'A 11 11 0 0 0 39 86',  // center bump
  'A 11 11 0 0 0 17 86',  // left bump
  'Z',
].join(' ')

type Cfg = { body: string; inner: string; glow: string; stroke: string; anim: string }

const CFG: Record<GhostState, Cfg> = {
  idle:      { body: 'rgba(200,235,255,0.92)', inner: 'rgba(255,255,255,0.80)', glow: 'rgba(6,182,212,0.55)',   stroke: 'rgba(6,182,212,0.40)',   anim: styles.animFloat  },
  workout:   { body: 'rgba(255,225,200,0.92)', inner: 'rgba(255,255,255,0.78)', glow: 'rgba(249,115,22,0.55)',  stroke: 'rgba(249,115,22,0.40)',  anim: styles.animBounce },
  win:       { body: 'rgba(255,245,190,0.95)', inner: 'rgba(255,255,255,0.82)', glow: 'rgba(251,191,36,0.60)',  stroke: 'rgba(251,191,36,0.45)',  anim: styles.animBounce },
  thinking:  { body: 'rgba(225,210,255,0.92)', inner: 'rgba(255,255,255,0.76)', glow: 'rgba(124,58,237,0.50)',  stroke: 'rgba(124,58,237,0.38)', anim: styles.animSlow   },
  sleep:     { body: 'rgba(205,218,255,0.90)', inner: 'rgba(255,255,255,0.72)', glow: 'rgba(99,102,241,0.45)', stroke: 'rgba(99,102,241,0.35)',  anim: styles.animSlow   },
  surprised: { body: 'rgba(200,242,255,0.95)', inner: 'rgba(255,255,255,0.82)', glow: 'rgba(14,165,233,0.58)', stroke: 'rgba(14,165,233,0.42)',  anim: styles.animShake  },
  sad:       { body: 'rgba(195,210,228,0.88)', inner: 'rgba(255,255,255,0.66)', glow: 'rgba(100,116,139,0.40)', stroke: 'rgba(100,116,139,0.30)', anim: styles.animFloat  },
}

/* Eye centres */
const EL = { cx: 38, cy: 34 }
const ER = { cx: 62, cy: 34 }
const INK = '#1e293b'

function Eyes({ state }: { state: GhostState }) {
  switch (state) {
    case 'idle':
      return (
        <g>
          <circle {...EL} r={6} fill={INK} />
          <circle {...ER} r={6} fill={INK} />
          {/* shine */}
          <circle cx={EL.cx + 2} cy={EL.cy - 2} r={2} fill="white" />
          <circle cx={ER.cx + 2} cy={ER.cy - 2} r={2} fill="white" />
        </g>
      )

    case 'workout':
      return (
        <g>
          <ellipse {...EL} rx={6} ry={3.5} fill={INK} />
          <ellipse {...ER} rx={6} ry={3.5} fill={INK} />
          {/* angry inward brows */}
          <path d={`M ${EL.cx-6} ${EL.cy-7} L ${EL.cx+6} ${EL.cy-5}`}
            stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <path d={`M ${ER.cx-6} ${ER.cy-5} L ${ER.cx+6} ${ER.cy-7}`}
            stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
        </g>
      )

    case 'win': {
      const star = (cx: number, cy: number) =>
        `M ${cx} ${cy-6.5} L ${cx+1.5} ${cy-1.5} L ${cx+6.5} ${cy} ` +
        `L ${cx+1.5} ${cy+1.5} L ${cx} ${cy+6.5} L ${cx-1.5} ${cy+1.5} ` +
        `L ${cx-6.5} ${cy} L ${cx-1.5} ${cy-1.5} Z`
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
          <circle {...EL} r={6} fill={INK} />
          <circle {...ER} r={6} fill={INK} />
          {/* pupils up-right (looking up) */}
          <circle cx={EL.cx + 1.5} cy={EL.cy - 2.5} r={2.2} fill="white" />
          <circle cx={ER.cx + 1.5} cy={ER.cy - 2.5} r={2.2} fill="white" />
        </g>
      )

    case 'sleep':
      /* closed arc lines */
      return (
        <g stroke={INK} strokeWidth={3} strokeLinecap="round" fill="none">
          <path d={`M ${EL.cx-6} ${EL.cy+1} Q ${EL.cx} ${EL.cy-5} ${EL.cx+6} ${EL.cy+1}`} />
          <path d={`M ${ER.cx-6} ${ER.cy+1} Q ${ER.cx} ${ER.cy-5} ${ER.cx+6} ${ER.cy+1}`} />
        </g>
      )

    case 'surprised':
      return (
        <g>
          <circle {...EL} r={8} fill={INK} />
          <circle {...ER} r={8} fill={INK} />
          <circle cx={EL.cx + 2.5} cy={EL.cy - 2.5} r={2.5} fill="white" />
          <circle cx={ER.cx + 2.5} cy={ER.cy - 2.5} r={2.5} fill="white" />
        </g>
      )

    case 'sad':
      return (
        <g>
          <circle cx={EL.cx} cy={EL.cy + 1} r={5.5} fill={INK} />
          <circle cx={ER.cx} cy={ER.cy + 1} r={5.5} fill={INK} />
          {/* sad outward brows */}
          <path d={`M ${EL.cx-6} ${EL.cy-6} L ${EL.cx+5} ${EL.cy-4}`}
            stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <path d={`M ${ER.cx-5} ${ER.cy-4} L ${ER.cx+6} ${ER.cy-6}`}
            stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
        </g>
      )
  }
}

function Mouth({ state }: { state: GhostState }) {
  const cx = 50, cy = 52
  switch (state) {
    case 'idle':
      return <path d={`M ${cx-10} ${cy} Q ${cx} ${cy+9} ${cx+10} ${cy}`}
        stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
    case 'workout':
      return <path d={`M ${cx-9} ${cy} L ${cx+9} ${cy}`}
        stroke={INK} strokeWidth={3} strokeLinecap="round" />
    case 'win':
      return <path d={`M ${cx-13} ${cy} Q ${cx} ${cy+13} ${cx+13} ${cy}`}
        stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
    case 'thinking':
      return <path d={`M ${cx-7} ${cy+4} Q ${cx} ${cy} ${cx+7} ${cy+4}`}
        stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round" />
    case 'sleep':
      return <path d={`M ${cx-6} ${cy+3} Q ${cx} ${cy+7} ${cx+6} ${cy+3}`}
        stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round" />
    case 'surprised':
      return <ellipse cx={cx} cy={cy + 5} rx={6} ry={8} fill={INK} />
    case 'sad':
      return <path d={`M ${cx-10} ${cy+7} Q ${cx} ${cy-1} ${cx+10} ${cy+7}`}
        stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
  }
}

function Extras({ state }: { state: GhostState }) {
  switch (state) {
    case 'workout':
      /* sweat drop, top-right */
      return (
        <path d="M 82 20 L 80 26 Q 77 31 80 34 A 4 4 0 0 0 87 30 Q 87 25 82 20 Z"
          fill="rgba(96,165,250,0.82)" />
      )

    case 'win':
      /* sparkle stars around the ghost */
      return (
        <g fill="#fbbf24">
          <path d="M 8 22 L 9.4 18 L 10.8 22 L 14.8 23.4 L 10.8 24.8 L 9.4 28.8 L 8 24.8 L 4 23.4 Z" />
          <path d="M 88 15 L 89 12 L 90 15 L 93 16 L 90 17 L 89 20 L 88 17 L 85 16 Z" />
          <path d="M 85 68 L 86 65 L 87 68 L 90 69 L 87 70 L 86 73 L 85 70 L 82 69 Z" />
        </g>
      )

    case 'thinking':
      /* thought bubble chain, top-right */
      return (
        <g fill="rgba(124,58,237,0.50)">
          <circle cx={72} cy={22} r={3.5} />
          <circle cx={79} cy={14} r={5} />
          <circle cx={88} cy={6}  r={3.5} />
        </g>
      )

    case 'sleep':
      /* ZZZ rising top-right */
      return (
        <g fill="rgba(99,102,241,0.70)" fontSize={0} fontFamily="system-ui,sans-serif" fontWeight={700}>
          <text x={74} y={28}  fontSize={8}>Z</text>
          <text x={80} y={19}  fontSize={10}>Z</text>
          <text x={87} y={10}  fontSize={12}>Z</text>
        </g>
      )

    case 'sad':
      /* teardrop under left eye */
      return (
        <path d="M 38 47 L 36 54 Q 33 58 36 61 A 3.5 3.5 0 0 0 41 58 Q 42 53 38 47 Z"
          fill="rgba(96,165,250,0.78)" />
      )

    default:
      return null
  }
}

export function Ghost({ state = 'idle', size = 'md', phrase }: GhostProps) {
  /* useId can return strings like ":r3:" — sanitise for use in SVG url() */
  const raw = useId()
  const uid = raw.replace(/[^a-z0-9]/gi, '')
  const gradId = `gg${uid}`

  const px   = PX[size]
  const cfg  = CFG[state]

  return (
    <div className={styles.wrap}>
      <div
        className={cfg.anim}
        style={{ filter: `drop-shadow(0 0 10px ${cfg.glow})` }}
      >
        <svg
          viewBox="0 0 100 110"
          width={px}
          height={px * 1.22}
          overflow="visible"
          aria-hidden
        >
          <defs>
            {/*
              objectBoundingBox (default) — cx/cy/r are % of the element's bounding box.
              No gradientUnits needed. Percentages work correctly here.
            */}
            <radialGradient id={gradId} cx="38%" cy="28%" r="68%">
              <stop offset="0%"   stopColor={cfg.inner} />
              <stop offset="100%" stopColor={cfg.body}  />
            </radialGradient>
          </defs>

          {/* Ghost body */}
          <path d={BODY} fill={`url(#${gradId})`} stroke={cfg.stroke} strokeWidth={1.5} />

          {/* Face */}
          <Eyes  state={state} />
          <Mouth state={state} />
          <Extras state={state} />
        </svg>
      </div>

      {phrase && <div className={styles.bubble}>{phrase}</div>}
    </div>
  )
}
