import { LOOP_PERIMETER, buildRosaryLayout, pendantCount } from '@/components/rosary-loop-geometry'
import { beadTone } from '@/components/progress-beads'
import type { BeadTone } from '@/components/progress-beads'
import { TERCO_LIST } from '@/data/index'

function tonesOf(count: number, tone: BeadTone = 'minor'): BeadTone[] {
  return Array.from({ length: count }, () => tone)
}

function gap(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(b.x - a.x, b.y - a.y)
}

describe('rosary loop geometry', () => {
  it('spaces neighbouring beads evenly all the way around the loop', () => {
    const layout = buildRosaryLayout(tonesOf(72))
    const loopBeads = layout.beads.slice(pendantCount(72))
    const gaps = loopBeads.slice(0, -1).map((bead, index) => gap(bead, loopBeads[index + 1]))
    const smallest = Math.min(...gaps)
    const largest = Math.max(...gaps)

    // Chord length dips slightly below arc length on the tightest curves, but
    // never enough to read as an uneven cord.
    expect(largest - smallest).toBeLessThan(layout.spacing * 0.06)
  })

  it('keeps the pendant straight, below the loop and at the same pitch', () => {
    const stem = pendantCount(63)
    const layout = buildRosaryLayout(tonesOf(63))
    const pendant = layout.beads.slice(0, stem)

    expect(pendant.every((bead) => bead.x === 50)).toBe(true)
    // Index 0 hangs nearest the cross, so the pendant climbs towards the loop.
    expect(pendant[0].y).toBeGreaterThan(pendant[stem - 1].y)
    expect(pendant[0].y - pendant[1].y).toBeCloseTo(layout.spacing, 5)
    expect(layout.cross.top).toBeGreaterThan(pendant[0].y)
  })

  it('leaves plain beads clearly apart, with the cord showing between them', () => {
    const layout = buildRosaryLayout(tonesOf(72))
    const plain = layout.beads[10]

    expect(plain.diameter / layout.spacing).toBeGreaterThan(0.5)
    expect(plain.diameter / layout.spacing).toBeLessThan(0.65)
  })

  it('strings the cord through every bead centre, thin against the beads', () => {
    const stem = pendantCount(72)
    const layout = buildRosaryLayout(tonesOf(72))

    expect(layout.cord.loop).toHaveLength(72 - stem)
    layout.cord.loop.forEach((vertex, index) => {
      expect(vertex).toEqual({ x: layout.beads[stem + index].x, y: layout.beads[stem + index].y })
    })

    // Medal at the top, the pendant beads bottom-up, then down into the cross.
    expect(layout.cord.pendant).toHaveLength(stem + 2)
    expect(layout.cord.pendant[0]).toEqual({ x: 50, y: layout.beads[stem].y })
    expect(layout.cord.pendant[stem + 1]).toEqual({ x: 50, y: layout.cross.top })
    expect(layout.cord.width).toBeLessThan(layout.beads[10].diameter * 0.3)
    expect(layout.cord.width).toBeGreaterThan(0)
  })

  it('makes major beads and the medal at the base visibly larger', () => {
    const stem = pendantCount(20)
    const tones = tonesOf(20)
    tones[stem + 4] = 'major'
    const layout = buildRosaryLayout(tones)
    const medal = layout.beads[stem]
    const major = layout.beads[stem + 4]
    const plain = layout.beads[stem + 5]

    expect(major.diameter).toBeGreaterThan(plain.diameter * 1.2)
    expect(medal.diameter).toBeGreaterThan(major.diameter)
    expect(medal.y).toBeGreaterThan(layout.beads[stem + 1].y)
  })

  it('scales across every registered devotional without overflowing the figure', () => {
    TERCO_LIST.forEach((terco) => {
      terco.misterios.forEach((misterio) => {
        const layout = buildRosaryLayout(misterio.etapas.map(beadTone))

        expect(layout.beads).toHaveLength(misterio.etapas.length)
        layout.beads.forEach((bead) => {
          expect(bead.x - bead.diameter / 2).toBeGreaterThan(0)
          expect(bead.x + bead.diameter / 2).toBeLessThan(100)
          expect(bead.y - bead.diameter / 2).toBeGreaterThan(0)
          expect(bead.y + bead.diameter / 2).toBeLessThan(layout.viewHeight)
        })

        expect(layout.cross.top + layout.cross.height).toBeLessThanOrEqual(layout.viewHeight)
        expect(layout.spacing).toBeLessThanOrEqual(LOOP_PERIMETER / 12)
      })
    })
  })
})
