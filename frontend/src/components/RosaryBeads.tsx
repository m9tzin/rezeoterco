'use client'

// ── Geometry ──────────────────────────────────────────────────────────────────
const CX = 150, CY = 146
const RX = 98,  RY = 130      // portrait oval ~1:1.33
const MEDAL_Y = CY + RY       // 276 – medal at bottom of ring

// Bead radii
const RP = 7.5  // pater
const RA = 5    // ave
const RM = 8    // medal connector (slightly larger to stand out)

// ── Arc-length parameterization ───────────────────────────────────────────────
// Beads and symbols spaced by arc length so they distribute evenly on the oval.
const GAP = 0.22  // radians gap at connector (must be > (RM+RP)/RX ≈ 0.16)
const θ_START = (3 * Math.PI) / 2 + GAP
const ARC_SPAN = 2 * Math.PI - 2 * GAP

const N = 2000
const _arcs: number[] = [0]
for (let i = 1; i <= N; i++) {
  const θ1 = θ_START + ((i - 1) / N) * ARC_SPAN
  const θ2 = θ_START + (i / N) * ARC_SPAN
  const dx = RX * (Math.cos(θ2) - Math.cos(θ1))
  const dy = RY * (Math.sin(θ2) - Math.sin(θ1))
  _arcs.push(_arcs[i - 1] + Math.hypot(dx, dy))
}
const TOTAL_ARC = _arcs[N]

function arcToTheta(target: number): number {
  let lo = 0, hi = N
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1
    if (_arcs[mid] < target) lo = mid; else hi = mid
  }
  const span = _arcs[hi] - _arcs[lo]
  const t = span === 0 ? 0 : (target - _arcs[lo]) / span
  const θlo = θ_START + (lo / N) * ARC_SPAN
  const θhi = θ_START + (hi / N) * ARC_SPAN
  return θlo + t * (θhi - θlo)
}

// ── Ring: 55 beads = 5 decades × (1 pater + 10 aves) ────────────────────────
type BeadDef = { etapaIndex: number; type: 'pater' | 'ave'; x: number; y: number }

const RING: BeadDef[] = []
for (let i = 0; i < 55; i++) {
  const θ = arcToTheta((i + 0.5) * TOTAL_ARC / 55)
  const x = CX + RX * Math.cos(θ)
  const y = CY - RY * Math.sin(θ)
  const d = Math.floor(i / 11)
  const p = i % 11
  const etapaIndex = p === 0 ? 7 + d * 14 : 8 + d * 14 + (p - 1)
  const type: 'pater' | 'ave' = p === 0 ? 'pater' : 'ave'
  RING.push({ etapaIndex, type, x, y })
}

// ── Tail beads (hanging below the connector) ──────────────────────────────────
// From medal downward: Ave 3 → Ave 2 → Ave 1 → Pai Nosso → Cross
const T0 = MEDAL_Y + 22
const TAIL: BeadDef[] = [
  { etapaIndex: 4, type: 'ave',   x: CX, y: T0 },
  { etapaIndex: 3, type: 'ave',   x: CX, y: T0 + 20 },
  { etapaIndex: 2, type: 'ave',   x: CX, y: T0 + 40 },
  { etapaIndex: 1, type: 'pater', x: CX, y: T0 + 60 },
]
const CROSS_Y = T0 + 84
const SVG_H   = CROSS_Y + 18

// ── Colors ────────────────────────────────────────────────────────────────────
const C = {
  parchment: '#ede4d0',
  gold:      '#9a7b3f',
  brown:     '#5c3d2e',
  red:       '#8b2020',
  glow:      'rgba(139,32,32,0.15)',
  string:    '#c9b99a',
}

// ── Component ─────────────────────────────────────────────────────────────────
type Props = { currentIndex: number }

export function RosaryBeads({ currentIndex }: Props) {
  const fill = (b: BeadDef) => {
    if (b.etapaIndex === currentIndex) return C.red
    if (b.etapaIndex < currentIndex)   return b.type === 'pater' ? C.brown : C.gold
    return C.parchment
  }
  const outline = (b: BeadDef) => b.type === 'pater' ? C.brown : C.gold

  const isCur  = (idx: number) => idx === currentIndex
  const isDone = (idx: number) => idx < currentIndex

  // Medal is active for etapa 5 (Glória after intro) or etapa 76 (Salve Rainha end)
  const medalCur  = currentIndex === 5 || currentIndex === 76
  const medalDone = currentIndex > 5 && currentIndex !== 76

  return (
    <svg
      viewBox={`0 0 300 ${SVG_H}`}
      width="100%"
      style={{ maxWidth: 300, display: 'block' }}
      className="mx-auto"
      aria-hidden="true"
    >
      {/* ── String: ring + tail ── */}
      <ellipse cx={CX} cy={CY} rx={RX} ry={RY}
        fill="none" stroke={C.string} strokeWidth="1.5" />
      <line x1={CX} y1={MEDAL_Y} x2={CX} y2={CROSS_Y + 10}
        stroke={C.string} strokeWidth="1.5" />

      {/* ── Ring beads ── */}
      {RING.map((b, i) => {
        const r = b.type === 'pater' ? RP : RA
        return (
          <g key={i}>
            {isCur(b.etapaIndex) && <circle cx={b.x} cy={b.y} r={r + 5} fill={C.glow} />}
            <circle cx={b.x} cy={b.y} r={r}
              fill={fill(b)} stroke={outline(b)} strokeWidth="1" />
          </g>
        )
      })}

      {/* ── Medal connector (Glória after intro / Salve Rainha at the end) ── */}
      {medalCur && <circle cx={CX} cy={MEDAL_Y} r={RM + 5} fill={C.glow} />}
      <circle cx={CX} cy={MEDAL_Y} r={RM}
        fill={medalCur ? C.red : medalDone ? C.gold : C.parchment}
        stroke={C.gold} strokeWidth="1.5" />

      {/* ── Tail beads ── */}
      {TAIL.map((b, i) => {
        const r = b.type === 'pater' ? RP : RA
        return (
          <g key={i}>
            {isCur(b.etapaIndex) && <circle cx={b.x} cy={b.y} r={r + 5} fill={C.glow} />}
            <circle cx={b.x} cy={b.y} r={r}
              fill={fill(b)} stroke={outline(b)} strokeWidth="1" />
          </g>
        )
      })}

      {/* ── Cross (etapa 0 — Credo) ── */}
      {isCur(0) && <circle cx={CX} cy={CROSS_Y} r={14} fill={C.glow} />}
      <g
        stroke={isCur(0) ? C.red : isDone(0) ? C.gold : C.string}
        strokeWidth="2"
        strokeLinecap="round"
      >
        <line x1={CX}     y1={CROSS_Y - 10} x2={CX}     y2={CROSS_Y + 10} />
        <line x1={CX - 7} y1={CROSS_Y - 3}  x2={CX + 7} y2={CROSS_Y - 3} />
      </g>
    </svg>
  )
}
