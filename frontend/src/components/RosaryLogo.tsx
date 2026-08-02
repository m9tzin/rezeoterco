import { VIEW_WIDTH, buildRosaryLayout } from './rosary-loop-geometry'
import type { BeadPlacement, CrossPlacement, Point } from './rosary-loop-geometry'
import type { BeadTone } from './progress-beads'

/**
 * Tone sequence of the Marian rosary — the devotional whose figure the app draws
 * on the prayer screen. The logo is that same figure, so it is built from the
 * same geometry rather than redrawn by hand.
 */
function marianoTones(): BeadTone[] {
  const tones: BeadTone[] = ['intro', 'major', 'minor', 'minor', 'minor', 'intro']

  for (let decade = 0; decade < 5; decade++) {
    tones.push('major', 'major')
    for (let bead = 0; bead < 10; bead++) tones.push('minor')
    tones.push('intro', 'intro')
  }
  tones.push('final')

  return tones
}

const LAYOUT = buildRosaryLayout(marianoTones())
const STEM = LAYOUT.beads.filter((bead) => bead.x === 50 && bead.y > 124).length
const LOOP_BEADS = LAYOUT.beads.slice(STEM)
const PENDANT_BEADS = LAYOUT.beads.slice(0, STEM)

/**
 * Seventy-seven beads turn to mush below a couple of hundred pixels, so a
 * miniature draws only some of them.
 */
function beadStep(width: number): number {
  if (width >= 30) return 3
  if (width >= 20) return 5
  return 7
}

/**
 * Picks roughly every Nth item, spread so the last gap matches the rest. Taking
 * `index % step` instead leaves a short remainder where the loop closes, which
 * shows up as beads bunching against the medal.
 */
function spread<T>(items: T[], step: number): T[] {
  const count = Math.max(3, Math.round(items.length / step))

  return Array.from({ length: count }, (_, index) => items[Math.round((index * items.length) / count)])
}

export type LogoMark = {
  viewHeight: number
  loopCord: Point[]
  pendantCord: Point[]
  cordWidth: number
  beads: { x: number; y: number; radius: number }[]
  cross: CrossPlacement
}

/**
 * The rosary mark at a given bead density, in the geometry's own coordinates.
 *
 * Shared by the React logo and the script that bakes the favicon and launcher
 * icons, so every copy of the mark comes from one description.
 */
export function buildLogoMark(width: number): LogoMark {
  const step = beadStep(width)
  const loop = spread(LOOP_BEADS, step)
  const pendant = spread(PENDANT_BEADS, 2)
  // Beads grow by however much the drawn pitch grew, so the cord stays as full
  // as the prayer screen's.
  const scale = LOOP_BEADS.length / loop.length
  // The medal is 2.25x a plain bead; once plain beads are a fifth of the loop
  // that turns into a blob, so cap every bead against the drawn pitch.
  const cap = LAYOUT.spacing * scale * 1.15
  const size = (bead: BeadPlacement) => Math.min(bead.diameter * scale, cap) / 2

  return {
    viewHeight: LAYOUT.viewHeight,
    // The cord keeps every point of the full figure, so the teardrop stays a
    // smooth curve however few beads are threaded onto it.
    loopCord: LAYOUT.cord.loop,
    pendantCord: LAYOUT.cord.pendant,
    cordWidth: LAYOUT.cord.width * scale,
    beads: [...loop, ...pendant].map((bead) => ({
      x: bead.x,
      y: bead.y,
      radius: size(bead),
    })),
    cross: LAYOUT.cross,
  }
}

export function toPoints(points: Point[]): string {
  return points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ')
}

type Props = {
  /** Rendered width in px. Bead density adapts so the mark stays legible. */
  width: number
  className?: string
}

export function RosaryLogo({ width, className }: Props) {
  const mark = buildLogoMark(width)
  const { cross } = mark

  return (
    <svg
      width={width}
      height={Math.round((width * mark.viewHeight) / VIEW_WIDTH)}
      viewBox={`0 0 ${VIEW_WIDTH} ${mark.viewHeight.toFixed(1)}`}
      className={className}
      data-testid="rosary-logo"
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={mark.cordWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <polygon points={toPoints(mark.loopCord)} />
        <polyline points={toPoints(mark.pendantCord)} />
      </g>
      <g fill="currentColor">
        {mark.beads.map((bead, index) => (
          <circle key={index} cx={bead.x.toFixed(1)} cy={bead.y.toFixed(1)} r={bead.radius.toFixed(2)} />
        ))}
        <rect
          x={cross.x - cross.bar / 2}
          y={cross.top}
          width={cross.bar}
          height={cross.height}
          rx={cross.bar * 0.2}
        />
        <rect
          x={cross.x - cross.width / 2}
          y={cross.armTop}
          width={cross.width}
          height={cross.bar}
          rx={cross.bar * 0.2}
        />
      </g>
    </svg>
  )
}
