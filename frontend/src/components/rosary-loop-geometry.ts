import type { BeadTone } from './progress-beads'
import { beadScale } from './progress-beads'

export type Point = { x: number; y: number }

/** Horizontal user-unit span of the figure. Height is derived per devotional. */
export const VIEW_WIDTH = 100

type Cubic = { from: Point; c1: Point; c2: Point; to: Point }

const APEX: Point = { x: 50, y: 10 }
const JUNCTION: Point = { x: 50, y: 124 }
const RIGHT_FLANK: Point = { x: 84, y: 64 }
const LEFT_FLANK: Point = { x: 16, y: 64 }

/**
 * Closed teardrop, traced from the base junction up the right flank, over the
 * apex and back down the left flank. The tangents at the junction leave at
 * ~30 degrees off vertical so the two flanks converge into a narrow V, and the
 * tangents at the flanks are vertical so the sides fall almost straight before
 * the shoulders round over the apex.
 */
const LOOP: Cubic[] = [
  { from: JUNCTION, c1: { x: 59, y: 107 }, c2: { x: 84, y: 92 }, to: RIGHT_FLANK },
  { from: RIGHT_FLANK, c1: { x: 84, y: 26 }, c2: { x: 76, y: 10 }, to: APEX },
  { from: APEX, c1: { x: 24, y: 10 }, c2: { x: 16, y: 26 }, to: LEFT_FLANK },
  { from: LEFT_FLANK, c1: { x: 16, y: 92 }, c2: { x: 41, y: 107 }, to: JUNCTION },
]

const SAMPLES_PER_SEGMENT = 160

function cubicAt(segment: Cubic, t: number): Point {
  const u = 1 - t
  const a = u * u * u
  const b = 3 * u * u * t
  const c = 3 * u * t * t
  const d = t * t * t

  return {
    x: a * segment.from.x + b * segment.c1.x + c * segment.c2.x + d * segment.to.x,
    y: a * segment.from.y + b * segment.c1.y + c * segment.c2.y + d * segment.to.y,
  }
}

type ArcTable = { points: Point[]; lengths: number[]; total: number }

function buildArcTable(segments: Cubic[]): ArcTable {
  const points: Point[] = [segments[0].from]
  const lengths: number[] = [0]
  let total = 0

  for (const segment of segments) {
    for (let step = 1; step <= SAMPLES_PER_SEGMENT; step++) {
      const point = cubicAt(segment, step / SAMPLES_PER_SEGMENT)
      const previous = points[points.length - 1]
      total += Math.hypot(point.x - previous.x, point.y - previous.y)
      points.push(point)
      lengths.push(total)
    }
  }

  return { points, lengths, total }
}

const LOOP_ARC = buildArcTable(LOOP)

/** Total arc length of the teardrop, in user units. */
export const LOOP_PERIMETER = LOOP_ARC.total

function pointAtDistance(table: ArcTable, distance: number): Point {
  const target = ((distance % table.total) + table.total) % table.total
  let low = 0
  let high = table.lengths.length - 1

  while (low < high) {
    const middle = (low + high) >> 1
    if (table.lengths[middle] < target) low = middle + 1
    else high = middle
  }

  if (low === 0) return table.points[0]

  const before = table.lengths[low - 1]
  const after = table.lengths[low]
  const span = after - before
  const ratio = span === 0 ? 0 : (target - before) / span
  const start = table.points[low - 1]
  const end = table.points[low]

  return {
    x: start.x + (end.x - start.x) * ratio,
    y: start.y + (end.y - start.y) * ratio,
  }
}

/** Beads that hang on the straight pendant between the cross and the junction. */
export function pendantCount(total: number): number {
  if (total <= 6) return Math.max(0, total - 1)
  return Math.min(5, Math.max(3, Math.round(total * 0.08)))
}

/**
 * Bead diameter as a fraction of the bead-to-bead pitch. The beads stand clearly
 * apart, with the cord showing through between them.
 */
const MINOR_FILL = 0.7
/** Extra bulk for the bead that sits where the two flanks converge. */
const MEDAL_SCALE = 2.25
/** Cord thickness, relative to a plain bead, with a floor so it stays visible. */
const CORD_RATIO = 0.16
const MIN_CORD_WIDTH = 0.35
/**
 * Ceiling on the pitch used for sizing. Short devotionals spread few beads over
 * the same cord, and sizing them straight off that pitch makes them coarse;
 * past this point the gap widens instead of the beads growing.
 */
const MAX_SIZING_PITCH = 8

/** Cross proportions, expressed in multiples of a plain bead's diameter. */
const CROSS_WIDTH_RATIO = 4.6
const CROSS_ASPECT = 1.5
const CROSS_BAR_RATIO = 0.245
const CROSS_ARM_RATIO = 0.29
const CROSS_MIN_WIDTH = 14
const CROSS_MAX_WIDTH = 26
const BOTTOM_MARGIN = 3

function clamp(value: number, low: number, high: number): number {
  return Math.min(Math.max(value, low), high)
}

export type BeadPlacement = Point & { diameter: number }

export type CrossPlacement = {
  x: number
  top: number
  width: number
  height: number
  bar: number
  armTop: number
}

/**
 * The thread the beads are strung on. `loop` is the closed ring of loop-bead
 * centres; `pendant` runs from the medal down through the pendant beads into
 * the top of the cross.
 */
export type CordPlacement = {
  loop: Point[]
  pendant: Point[]
  width: number
}

export type RosaryLayout = {
  viewHeight: number
  spacing: number
  beads: BeadPlacement[]
  cross: CrossPlacement
  cord: CordPlacement
}

/**
 * Places one bead per devotional step around the teardrop and its pendant.
 *
 * Beads are spread by arc length, so the gap between neighbours is identical
 * everywhere — on the flanks, over the apex and down the pendant — whatever the
 * step count of the devotional. Bead size is derived from that same pitch, so a
 * 36-step novena and a 77-step Marian rosary both read as one continuous cord.
 */
export function buildRosaryLayout(tones: BeadTone[]): RosaryLayout {
  const total = tones.length
  const stem = Math.min(pendantCount(total), Math.max(total - 1, 0))
  const loopCount = Math.max(total - stem, 1)
  const spacing = LOOP_PERIMETER / Math.max(loopCount, 12)
  const minorDiameter = Math.min(spacing, MAX_SIZING_PITCH) * MINOR_FILL

  const beads: BeadPlacement[] = tones.map((tone, index) => {
    const diameter = minorDiameter * beadScale(tone)

    if (index < stem) {
      // Index 0 is the bead closest to the cross; the pendant climbs from there
      // to the junction, keeping the same pitch as the loop.
      return { x: JUNCTION.x, y: JUNCTION.y + (stem - index) * spacing, diameter }
    }

    const loopIndex = index - stem
    const point = pointAtDistance(LOOP_ARC, loopIndex * spacing)
    const isMedal = loopIndex === 0

    return {
      x: point.x,
      y: point.y,
      diameter: isMedal ? minorDiameter * MEDAL_SCALE : diameter,
    }
  })

  const width = clamp(minorDiameter * CROSS_WIDTH_RATIO, CROSS_MIN_WIDTH, CROSS_MAX_WIDTH)
  const height = width * CROSS_ASPECT
  const pendantBottom = JUNCTION.y + Math.max(stem, 1) * spacing
  const crossTop = pendantBottom + Math.max(spacing * 1.1, 4)

  // Threading the bead centres in prayer order: down the pendant from the medal
  // into the cross, and around the closed loop.
  const pendantCord = [
    JUNCTION,
    ...beads.slice(0, stem).map(({ x, y }) => ({ x, y })).reverse(),
    { x: JUNCTION.x, y: crossTop },
  ]
  const loopCord = beads.slice(stem).map(({ x, y }) => ({ x, y }))

  return {
    viewHeight: crossTop + height + BOTTOM_MARGIN,
    spacing,
    beads,
    cross: {
      x: JUNCTION.x,
      top: crossTop,
      width,
      height,
      bar: width * CROSS_BAR_RATIO,
      armTop: crossTop + height * CROSS_ARM_RATIO,
    },
    cord: {
      loop: loopCord,
      pendant: pendantCord,
      width: Math.max(minorDiameter * CORD_RATIO, MIN_CORD_WIDTH),
    },
  }
}
