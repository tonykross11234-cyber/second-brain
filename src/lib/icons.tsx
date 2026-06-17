import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }

const base = (size: number, sw: number): SVGProps<SVGSVGElement> => ({
  viewBox: '0 0 24 24',
  width: size,
  height: size,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: sw,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
})

export function Home({ size = 24, strokeWidth = 2, ...p }: P) {
  return (
    <svg {...base(size, strokeWidth)} {...p}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}

export function Dumbbell({ size = 24, strokeWidth = 2, ...p }: P) {
  return (
    <svg {...base(size, strokeWidth)} {...p}>
      <path d="M14.4 14.4 9.6 9.6"/>
      <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/>
      <path d="m21.5 21.5-1.4-1.4"/>
      <path d="M3.9 3.9 2.5 2.5"/>
      <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/>
    </svg>
  )
}

export function Brain({ size = 24, strokeWidth = 2, ...p }: P) {
  return (
    <svg {...base(size, strokeWidth)} {...p}>
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
      <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
      <path d="M6 18a4 4 0 0 1-1.967-.516"/>
      <path d="m17.967 17.516A4 4 0 0 1 18 18"/>
    </svg>
  )
}

export function BookOpen({ size = 24, strokeWidth = 2, ...p }: P) {
  return (
    <svg {...base(size, strokeWidth)} {...p}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  )
}

export function User({ size = 24, strokeWidth = 2, ...p }: P) {
  return (
    <svg {...base(size, strokeWidth)} {...p}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

export function Search({ size = 24, strokeWidth = 2, ...p }: P) {
  return (
    <svg {...base(size, strokeWidth)} {...p}>
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.3-4.3"/>
    </svg>
  )
}

export function Flame({ size = 24, strokeWidth = 2, ...p }: P) {
  return (
    <svg {...base(size, strokeWidth)} {...p}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </svg>
  )
}

export function Target({ size = 24, strokeWidth = 2, ...p }: P) {
  return (
    <svg {...base(size, strokeWidth)} {...p}>
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  )
}

export function Trophy({ size = 24, strokeWidth = 2, ...p }: P) {
  return (
    <svg {...base(size, strokeWidth)} {...p}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
      <path d="M4 22h16"/>
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
    </svg>
  )
}

export function Droplets({ size = 24, strokeWidth = 2, ...p }: P) {
  return (
    <svg {...base(size, strokeWidth)} {...p}>
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/>
      <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>
    </svg>
  )
}

export function Zap({ size = 24, strokeWidth = 2, ...p }: P) {
  return (
    <svg {...base(size, strokeWidth)} {...p}>
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
    </svg>
  )
}

export function Moon({ size = 24, strokeWidth = 2, ...p }: P) {
  return (
    <svg {...base(size, strokeWidth)} {...p}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  )
}

export function Sun({ size = 24, strokeWidth = 2, ...p }: P) {
  return (
    <svg {...base(size, strokeWidth)} {...p}>
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2"/>
      <path d="M12 20v2"/>
      <path d="m4.93 4.93 1.41 1.41"/>
      <path d="m17.66 17.66 1.41 1.41"/>
      <path d="M2 12h2"/>
      <path d="M20 12h2"/>
      <path d="m6.34 17.66-1.41 1.41"/>
      <path d="m19.07 4.93-1.41 1.41"/>
    </svg>
  )
}

export function MessageCircle({ size = 24, strokeWidth = 2, ...p }: P) {
  return (
    <svg {...base(size, strokeWidth)} {...p}>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
    </svg>
  )
}

export function CheckSquare({ size = 24, strokeWidth = 2, ...p }: P) {
  return (
    <svg {...base(size, strokeWidth)} {...p}>
      <path d="m9 11 3 3L22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  )
}

export function Clock({ size = 24, strokeWidth = 2, ...p }: P) {
  return (
    <svg {...base(size, strokeWidth)} {...p}>
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}

export function Bell({ size = 24, strokeWidth = 2, ...p }: P) {
  return (
    <svg {...base(size, strokeWidth)} {...p}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  )
}

export function ArrowUp({ size = 24, strokeWidth = 2, ...p }: P) {
  return (
    <svg {...base(size, strokeWidth)} {...p}>
      <path d="m5 12 7-7 7 7"/>
      <path d="M12 19V5"/>
    </svg>
  )
}

export function ChevronRight({ size = 24, strokeWidth = 2, ...p }: P) {
  return (
    <svg {...base(size, strokeWidth)} {...p}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  )
}

export function Check({ size = 24, strokeWidth = 2, ...p }: P) {
  return (
    <svg {...base(size, strokeWidth)} {...p}>
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  )
}

export function Trash2({ size = 24, strokeWidth = 2, ...p }: P) {
  return (
    <svg {...base(size, strokeWidth)} {...p}>
      <path d="M3 6h18"/>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
      <line x1="10" x2="10" y1="11" y2="17"/>
      <line x1="14" x2="14" y1="11" y2="17"/>
    </svg>
  )
}
