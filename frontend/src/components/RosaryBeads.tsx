'use client'

// ── Geometry ──────────────────────────────────────────────────────────────────
const CX = 150, CY = 130      // ellipse center
const RX = 110, RY = 80       // ellipse semi-axes
const MEDAL_Y = CY + RY       // 210 – connector at bottom of ring

// Bead radii
const RP = 7.5  // pater
const RA = 5    // ave
const RM = 6    // medal connector

// ── Ring beads (55): 5 decades × (1 pater + 10 aves) ─────────────────────────
// Flipped-y formula: x = cx + rx·cos(θ), y = cy - ry·sin(θ)
// This makes increasing θ = clockwise on screen.
// Starting just clockwise past the bottom connector (θ = 3π/2) and going all
// the way around, leaving an equal gap at the connector.
type BeadDef = { etapaIndex: number; type: 'pater' | 'ave'; x: number; y: number }

const GAP = 0.18   // radians of gap at the connector — needs to be > (RM+RP)/RX ≈ 0.12 to avoid overlap
const RING: BeadDef[] = []
for (let i = 0; i < 55; i++) {
  const θ = (3 * Math.PI) / 2 + GAP + (i * (2 * Math.PI - 2 * GAP)) / 55
  const x = CX + RX * Math.cos(θ)
  const y = CY - RY * Math.sin(θ)
  const d = Math.floor(i / 11) // decade 0-4
  const p = i % 11              // position within decade
  let etapaIndex: number, type: 'pater' | 'ave'
  if (p === 0) { etapaIndex = 7 + d * 14; type = 'pater' }
  else          { etapaIndex = 8 + d * 14 + (p - 1); type = 'ave' }
  RING.push({ etapaIndex, type, x, y })
}

// ── Tail beads (hanging below the connector) ──────────────────────────────────
// Order top-to-bottom: medal → ave 3 (etapa 4) → ave 2 (3) → ave 1 (2) → pater (1) → cross (0)
// This matches the physical rosary: from the cross upward you pray Pai Nosso then 3 Ave Marias.
const T0 = MEDAL_Y + 20   // first tail bead center y
const TAIL: BeadDef[] = [
  { etapaIndex: 4, type: 'ave',   x: CX, y: T0 },
  { etapaIndex: 3, type: 'ave',   x: CX, y: T0 + 19 },
  { etapaIndex: 2, type: 'ave',   x: CX, y: T0 + 35 },
  { etapaIndex: 1, type: 'pater', x: CX, y: T0 + 51 },
]
const CROSS_Y = T0 + 70    // center of the cross
const SVG_H = CROSS_Y + 16 // total SVG height

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
  const isCur = (idx: number) => idx === currentIndex
  const isDone = (idx: number) => idx < currentIndex

  return (
    <svg
      viewBox={`0 0 300 ${SVG_H}`}
      width="100%"
      style={{ maxWidth: 300, display: 'block' }}
      className="mx-auto"
      aria-hidden="true"
    >
      {/* ── Strings ── */}
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

      {/* ── Medal connector (etapa 5 = Glória, rezada na medalha) ── */}
      {isCur(5) && <circle cx={CX} cy={MEDAL_Y} r={RM + 5} fill={C.glow} />}
      <circle cx={CX} cy={MEDAL_Y} r={RM}
        fill={currentIndex === 5 ? C.red : currentIndex > 5 ? C.gold : C.parchment}
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
