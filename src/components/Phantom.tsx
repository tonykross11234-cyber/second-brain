import styles from './Phantom.module.css'

export type PhantomState = 'idle' | 'workout' | 'win' | 'thinking' | 'sleep' | 'surprised' | 'sad'
type PhantomSize = 'sm' | 'md' | 'lg'

interface PhantomProps {
  state: PhantomState
  size?: PhantomSize
  phrase?: string
}

const PX: Record<PhantomSize, number> = { sm: 80, md: 120, lg: 160 }

const CFG: Record<PhantomState, {
  bodyStop0: string; bodyStop1: string; bodyStop2: string
  glowColor: string; eyeStop0: string; eyeStop1: string
  phrase: string; particles: string
  animClass: string
}> = {
  idle:      { bodyStop0:'#b197fc', bodyStop1:'#7c3aed', bodyStop2:'#1e0a3c', glowColor:'#7c3aed', eyeStop0:'#c4b5fd', eyeStop1:'#7c3aed', phrase:'Слежу за твоим прогрессом', particles:'#a78bfa', animClass:'animFloat' },
  workout:   { bodyStop0:'#fcd34d', bodyStop1:'#b45309', bodyStop2:'#451a03', glowColor:'#f97316', eyeStop0:'#fed7aa', eyeStop1:'#b45309', phrase:'Давай! Ещё один подход!', particles:'#f97316', animClass:'animBounce' },
  win:       { bodyStop0:'#6ee7b7', bodyStop1:'#065f46', bodyStop2:'#022c22', glowColor:'#10b981', eyeStop0:'#a7f3d0', eyeStop1:'#059669', phrase:'Победа! Ты это заслужил', particles:'#10b981', animClass:'animFloat' },
  thinking:  { bodyStop0:'#93c5fd', bodyStop1:'#1e40af', bodyStop2:'#0c1a6b', glowColor:'#38bdf8', eyeStop0:'#bae6fd', eyeStop1:'#0284c7', phrase:'Анализирую...', particles:'#38bdf8', animClass:'animFloat' },
  sleep:     { bodyStop0:'#9ca3af', bodyStop1:'#374151', bodyStop2:'#111827', glowColor:'#6b7280', eyeStop0:'#d1d5db', eyeStop1:'#4b5563', phrase:'Разбуди меня тренировкой', particles:'#6b7280', animClass:'animSlow' },
  surprised: { bodyStop0:'#fde68a', bodyStop1:'#92400e', bodyStop2:'#3b0f00', glowColor:'#fbbf24', eyeStop0:'#fef3c7', eyeStop1:'#d97706', phrase:'Личный рекорд!', particles:'#fbbf24', animClass:'animShake' },
  sad:       { bodyStop0:'#93c5fd', bodyStop1:'#1e3a5f', bodyStop2:'#0c1a3b', glowColor:'#3b82f6', eyeStop0:'#bae6fd', eyeStop1:'#1e40af', phrase:'Скучаю по тебе...', particles:'#3b82f6', animClass:'animSlow' },
}

function Eyes({ state }: { state: PhantomState }) {
  if (state === 'win') return (
    <g>
      <path d="M 44 100 Q 58 88 72 100" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M 88 100 Q 102 88 116 100" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round"/>
    </g>
  )
  if (state === 'sleep') return (
    <g>
      <path d="M 44 96 Q 58 100 72 96" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M 48 90 Q 52 86 56 90" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity={0.4}/>
      <path d="M 88 96 Q 102 100 116 96" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M 92 90 Q 96 86 100 90" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity={0.4}/>
    </g>
  )
  return (
    <g>
      {/* левый глаз */}
      <ellipse cx="58" cy="96" rx="14" ry="16" fill="#0d0020"/>
      <ellipse cx="58" cy="96" rx="12" ry="14" fill="url(#eyeGrad)"/>
      <ellipse cx="59" cy="97" rx="6" ry="7" fill="#0d0020"/>
      <ellipse cx="54" cy="91" rx="4" ry="3" fill="white" opacity={0.9} transform="rotate(-20 54 91)"/>
      <circle cx="63" cy="100" r="1.5" fill="white" opacity={0.5}/>
      {/* правый глаз */}
      <ellipse cx="102" cy="96" rx="14" ry="16" fill="#0d0020"/>
      <ellipse cx="102" cy="96" rx="12" ry="14" fill="url(#eyeGrad)"/>
      <ellipse cx="103" cy="97" rx="6" ry="7" fill="#0d0020"/>
      <ellipse cx="98" cy="91" rx="4" ry="3" fill="white" opacity={0.9} transform="rotate(-20 98 91)"/>
      <circle cx="107" cy="100" r="1.5" fill="white" opacity={0.5}/>
    </g>
  )
}

function Mouth({ state }: { state: PhantomState }) {
  if (state === 'win') return <path d="M 56 120 Q 80 140 104 120" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round"/>
  if (state === 'sleep') return <path d="M 68 124 L 92 124" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  if (state === 'sad') return <path d="M 62 128 Q 80 118 98 128" stroke="#c4b5fd" strokeWidth="3" fill="none" strokeLinecap="round"/>
  if (state === 'workout') return <path d="M 58 122 Q 80 138 102 122" stroke="#fed7aa" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
  if (state === 'surprised') return <ellipse cx="80" cy="126" rx="8" ry="10" fill="white" opacity={0.9}/>
  return <path d="M 62 122 Q 80 134 98 122" stroke="#c4b5fd" strokeWidth="3" fill="none" strokeLinecap="round"/>
}

function Brows({ state }: { state: PhantomState }) {
  if (state === 'workout') return (
    <g>
      <path d="M 42 80 L 68 88" stroke="#f97316" strokeWidth="4" strokeLinecap="round"/>
      <path d="M 118 80 L 92 88" stroke="#f97316" strokeWidth="4" strokeLinecap="round"/>
    </g>
  )
  if (state === 'sad') return (
    <g>
      <path d="M 42 82 L 68 76" stroke="white" strokeWidth="3" strokeLinecap="round" opacity={0.7}/>
      <path d="M 118 82 L 92 76" stroke="white" strokeWidth="3" strokeLinecap="round" opacity={0.7}/>
    </g>
  )
  return null
}

function Extras({ state }: { state: PhantomState }) {
  if (state === 'win') return (
    <g>
      <circle cx="20" cy="55" r="4" fill="#facc15"><animate attributeName="cy" values="55;35;55" dur="1.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0;1" dur="1.2s" repeatCount="indefinite"/></circle>
      <circle cx="140" cy="48" r="3.5" fill="#f43f5e"><animate attributeName="cy" values="48;28;48" dur="1s" repeatCount="indefinite" begin=".3s"/><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" begin=".3s"/></circle>
      <circle cx="80" cy="28" r="3" fill="#38bdf8"><animate attributeName="cy" values="28;10;28" dur="0.9s" repeatCount="indefinite" begin=".6s"/><animate attributeName="opacity" values="1;0;1" dur="0.9s" repeatCount="indefinite" begin=".6s"/></circle>
      <circle cx="30" cy="40" r="2.5" fill="#a78bfa"><animate attributeName="cy" values="40;22;40" dur="1.1s" repeatCount="indefinite" begin=".2s"/><animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite" begin=".2s"/></circle>
      <circle cx="130" cy="70" r="2.5" fill="#4ade80"><animate attributeName="cy" values="70;52;70" dur="1.3s" repeatCount="indefinite" begin=".5s"/><animate attributeName="opacity" values="1;0;1" dur="1.3s" repeatCount="indefinite" begin=".5s"/></circle>
    </g>
  )
  if (state === 'sleep') return (
    <g>
      <text x="118" y="58" fontSize="18" fontWeight="bold" fill="white" fontFamily="system-ui">
        z<animate attributeName="opacity" values=".8;.1;.8" dur="2s" repeatCount="indefinite"/>
      </text>
      <text x="130" y="40" fontSize="13" fill="white" fontFamily="system-ui">
        z<animate attributeName="opacity" values=".5;.0;.5" dur="2s" repeatCount="indefinite" begin=".7s"/>
      </text>
    </g>
  )
  return null
}

const TAIL_A = 'M 32 148 Q 44 136 56 148 Q 68 160 80 148 Q 92 136 104 148 Q 116 160 128 148 L 128 168 Q 116 180 104 168 Q 92 156 80 168 Q 68 180 56 168 Q 44 156 32 168 Z'
const TAIL_B = 'M 32 148 Q 44 160 56 148 Q 68 136 80 148 Q 92 160 104 148 Q 116 136 128 148 L 128 168 Q 116 156 104 168 Q 92 180 80 168 Q 68 156 56 168 Q 44 180 32 168 Z'

export function Phantom({ state, size = 'md', phrase }: PhantomProps) {
  const px = PX[size]
  const cfg = CFG[state]
  const text = phrase ?? cfg.phrase
  const showBubble = size !== 'sm'
  const waveDur = state === 'sleep' ? '4s' : state === 'workout' ? '0.7s' : '2.5s'

  return (
    <div className={`${styles.wrap} ${styles[cfg.animClass]}`}>
      <svg viewBox="0 0 160 200" width={px} height={px * 1.25} overflow="visible">
        <defs>
          <radialGradient id="bodyGrad" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor={cfg.bodyStop0}/>
            <stop offset="35%" stopColor={cfg.bodyStop1}/>
            <stop offset="100%" stopColor={cfg.bodyStop2}/>
          </radialGradient>
          <radialGradient id="outerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={cfg.glowColor} stopOpacity={0.5}/>
            <stop offset="100%" stopColor={cfg.glowColor} stopOpacity={0}/>
          </radialGradient>
          <radialGradient id="highlight" cx="35%" cy="20%" r="40%">
            <stop offset="0%" stopColor="white" stopOpacity={0.35}/>
            <stop offset="100%" stopColor="white" stopOpacity={0}/>
          </radialGradient>
          <radialGradient id="highlight2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity={0.6}/>
            <stop offset="100%" stopColor="white" stopOpacity={0}/>
          </radialGradient>
          <radialGradient id="shadowSide" cx="85%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000" stopOpacity={0.5}/>
            <stop offset="100%" stopColor="#000" stopOpacity={0}/>
          </radialGradient>
          <radialGradient id="shadowBot" cx="50%" cy="90%" r="55%">
            <stop offset="0%" stopColor="#000" stopOpacity={0.6}/>
            <stop offset="100%" stopColor="#000" stopOpacity={0}/>
          </radialGradient>
          <radialGradient id="rimLight" cx="15%" cy="50%" r="60%">
            <stop offset="0%" stopColor={cfg.bodyStop0} stopOpacity={0.4}/>
            <stop offset="100%" stopColor={cfg.bodyStop0} stopOpacity={0}/>
          </radialGradient>
          <radialGradient id="eyeGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor={cfg.eyeStop0}/>
            <stop offset="50%" stopColor={cfg.eyeStop1}/>
            <stop offset="100%" stopColor="#1e0a3c"/>
          </radialGradient>
          <linearGradient id="tailGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={cfg.bodyStop1}/>
            <stop offset="100%" stopColor={cfg.bodyStop2} stopOpacity={0.3}/>
          </linearGradient>
          <filter id="softblur"><feGaussianBlur stdDeviation="3"/></filter>
        </defs>

        {/* атмосферное свечение */}
        <ellipse cx="80" cy="95" rx="72" ry="78" fill="url(#outerGlow)" filter="url(#softblur)" opacity={0.7}>
          <animate attributeName="rx" values="72;84;72" dur="3.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values=".7;1;.7" dur="3.5s" repeatCount="indefinite"/>
        </ellipse>

        {/* хвост */}
        <path fill="url(#tailGrad)">
          <animate attributeName="d" values={`${TAIL_A};${TAIL_B};${TAIL_A}`} dur={waveDur} repeatCount="indefinite"/>
        </path>

        {/* тело */}
        <path d="M 28 88 C 28 38 132 38 132 88 L 132 152 Q 116 138 104 152 Q 92 166 80 152 Q 68 138 56 152 Q 44 166 28 152 Z" fill="url(#bodyGrad)"/>

        {/* rim свет */}
        <path d="M 28 88 C 28 38 132 38 132 88 L 132 152 Q 116 138 104 152 Q 92 166 80 152 Q 68 138 56 152 Q 44 166 28 152 Z" fill="url(#rimLight)"/>

        {/* тени для объёма */}
        <path d="M 28 88 C 28 38 132 38 132 88 L 132 152 Q 116 138 104 152 Q 92 166 80 152 Q 68 138 56 152 Q 44 166 28 152 Z" fill="url(#shadowSide)"/>
        <path d="M 28 88 C 28 38 132 38 132 88 L 132 152 Q 116 138 104 152 Q 92 166 80 152 Q 68 138 56 152 Q 44 166 28 152 Z" fill="url(#shadowBot)"/>

        {/* блики (объём) */}
        <ellipse cx="62" cy="68" rx="32" ry="28" fill="url(#highlight)" transform="rotate(-15 62 68)"/>
        <ellipse cx="52" cy="58" rx="10" ry="7" fill="url(#highlight2)" opacity={0.5} transform="rotate(-20 52 58)"/>

        {/* брови */}
        <Brows state={state}/>

        {/* глаза */}
        <Eyes state={state}/>

        {/* рот */}
        <Mouth state={state}/>

        {/* доп эффекты */}
        <Extras state={state}/>

        {/* частицы */}
        <circle cx="22" cy="65" r="3" fill={cfg.particles} opacity={0.7}>
          <animate attributeName="cy" values="65;48;65" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values=".7;0;.7" dur="3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="138" cy="72" r="2.5" fill={cfg.particles} opacity={0.6}>
          <animate attributeName="cy" values="72;55;72" dur="2.5s" repeatCount="indefinite" begin=".8s"/>
          <animate attributeName="opacity" values=".6;0;.6" dur="2.5s" repeatCount="indefinite" begin=".8s"/>
        </circle>
        <circle cx="142" cy="110" r="2" fill={cfg.particles} opacity={0.5}>
          <animate attributeName="cx" values="142;152;142" dur="2s" repeatCount="indefinite" begin=".4s"/>
          <animate attributeName="opacity" values=".5;0;.5" dur="2s" repeatCount="indefinite" begin=".4s"/>
        </circle>
      </svg>

      {showBubble && (
        <div className={styles.bubble}>{text}</div>
      )}
    </div>
  )
}
