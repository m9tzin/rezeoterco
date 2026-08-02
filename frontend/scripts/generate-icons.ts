/**
 * Bakes the favicon and the launcher icons from the same mark the app renders.
 *
 * Run with `npx sucrase-node scripts/generate-icons.ts` from `frontend/` after
 * changing the rosary geometry or the logo, then re-render the PNGs listed at
 * the bottom. Keeping this in the repo means the icons can be regenerated
 * instead of hand-patched when the figure moves.
 */
import fs from 'fs'
import path from 'path'
import { VIEW_WIDTH } from '../src/components/rosary-loop-geometry'
import { buildLogoMark, toPoints } from '../src/components/RosaryLogo'

const BROWN = '#5c3d2e'
const CREAM = '#f7f2e8'

function mark(width: number): string {
  const m = buildLogoMark(width)
  const { cross } = m
  const beads = m.beads
    .map((b) => `<circle cx="${b.x.toFixed(1)}" cy="${b.y.toFixed(1)}" r="${b.radius.toFixed(2)}"/>`)
    .join('')

  return (
    `<g fill="none" stroke="${BROWN}" stroke-width="${m.cordWidth.toFixed(2)}" stroke-linejoin="round" stroke-linecap="round">` +
    `<polygon points="${toPoints(m.loopCord)}"/><polyline points="${toPoints(m.pendantCord)}"/></g>` +
    `<g fill="${BROWN}">${beads}` +
    `<rect x="${(cross.x - cross.bar / 2).toFixed(1)}" y="${cross.top.toFixed(1)}" width="${cross.bar.toFixed(1)}" height="${cross.height.toFixed(1)}" rx="${(cross.bar * 0.2).toFixed(2)}"/>` +
    `<rect x="${(cross.x - cross.width / 2).toFixed(1)}" y="${cross.armTop.toFixed(1)}" width="${cross.width.toFixed(1)}" height="${cross.bar.toFixed(1)}" rx="${(cross.bar * 0.2).toFixed(2)}"/></g>`
  )
}

/**
 * Fits the mark into a square tile. `inset` is the share kept clear on every
 * side — launcher icons are declared "any maskable", so they need a wider
 * margin than the favicon to survive being cropped to a circle.
 */
function tile(size: number, markWidth: number, inset: number, radius: number): string {
  const viewHeight = buildLogoMark(markWidth).viewHeight
  const scale = (size * (1 - 2 * inset)) / viewHeight
  const dx = (size - VIEW_WIDTH * scale) / 2

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${CREAM}"/>
  <g transform="translate(${dx.toFixed(2)} ${(size * inset).toFixed(2)}) scale(${scale.toFixed(4)})">${mark(markWidth)}</g>
</svg>
`
}

const here = path.join(__dirname, '..')
const targets: [string, string][] = [
  [path.join(here, 'src/app/icon.svg'), tile(32, 24, 0.06, 6)],
  ['/private/tmp/icon-192.svg', tile(192, 40, 0.17, 0)],
  ['/private/tmp/icon-512.svg', tile(512, 40, 0.17, 0)],
]

for (const [file, svg] of targets) {
  fs.writeFileSync(file, svg)
  console.log('wrote', file)
}
console.log('\nNow rasterise the launcher icons into public/:')
console.log('  icon-192.png and icon-512.png from the SVGs above')
