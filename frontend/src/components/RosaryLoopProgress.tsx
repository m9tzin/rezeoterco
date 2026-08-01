'use client'

import type { Etapa, Misterio, TipoTerco } from '@/data/types'
import { beadClass, beadTone, describeTipo } from './progress-beads'

type Props = {
  misterio: Misterio
  tipo: TipoTerco
  currentIndex: number
}

type Point = { x: number; y: number }

const LOOP_POINTS: Point[] = [
  { x: 50, y: 66 },
  { x: 44, y: 61 },
  { x: 38, y: 55 },
  { x: 32, y: 50 },
  { x: 25, y: 46 },
  { x: 20, y: 41 },
  { x: 17, y: 34 },
  { x: 17, y: 27 },
  { x: 21, y: 19 },
  { x: 31, y: 12 },
  { x: 42, y: 8 },
  { x: 50, y: 7 },
  { x: 58, y: 8 },
  { x: 69, y: 12 },
  { x: 79, y: 19 },
  { x: 83, y: 27 },
  { x: 83, y: 34 },
  { x: 80, y: 41 },
  { x: 75, y: 46 },
  { x: 68, y: 50 },
  { x: 62, y: 55 },
  { x: 56, y: 61 },
  { x: 50, y: 66 },
]

function distance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y)
}

function pointOnPath(points: Point[], progress: number): Point {
  const segmentLengths = points
    .slice(0, -1)
    .map((point, index) => distance(point, points[index + 1]))
  const totalLength = segmentLengths.reduce((sum, length) => sum + length, 0)
  let remaining = progress * totalLength

  for (let index = 0; index < segmentLengths.length; index++) {
    const length = segmentLengths[index]
    if (remaining <= length) {
      const start = points[index]
      const end = points[index + 1]
      const ratio = length === 0 ? 0 : remaining / length

      return {
        x: start.x + (end.x - start.x) * ratio,
        y: start.y + (end.y - start.y) * ratio,
      }
    }

    remaining -= length
  }

  return points[points.length - 1]
}

function pendantCount(total: number): number {
  if (total < 8) return Math.max(0, total - 1)
  return Math.min(5, Math.max(3, Math.round(total * 0.08)))
}

function beadSpacingWeight(etapa: Etapa): number {
  const tone = beadTone(etapa)
  if (tone === 'major' || tone === 'final') return 1.7
  if (tone === 'intro') return 1.25
  return 1
}

function weightedProgress(index: number, etapas: Etapa[]): number {
  const weights = etapas.map(beadSpacingWeight)
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
  const previousWeight = weights
    .slice(0, index)
    .reduce((sum, weight) => sum + weight, 0)

  return totalWeight === 0 ? 0 : (previousWeight + weights[index] / 2) / totalWeight
}

function getPendantPosition(index: number, etapas: Etapa[]): Point {
  const top = 68
  const bottom = 88
  const progress = weightedProgress(index, etapas)

  return { x: 50, y: bottom - (bottom - top) * progress }
}

function getBeadPosition(index: number, etapas: Etapa[]): Point {
  const total = etapas.length
  const stemCount = pendantCount(total)

  if (index < stemCount) return getPendantPosition(index, etapas.slice(0, stemCount))

  const loopEtapas = etapas.slice(stemCount)
  const loopIndex = index - stemCount
  const progress = weightedProgress(loopIndex, loopEtapas)

  return pointOnPath(LOOP_POINTS, progress)
}

export function RosaryLoopProgress({ misterio, tipo, currentIndex }: Props) {
  const currentEtapa = misterio.etapas[currentIndex]
  const progress = Math.round(((currentIndex + 1) / misterio.etapas.length) * 100)

  return (
    <section
      className="w-full max-w-[560px] md:max-w-2xl lg:max-w-3xl mb-5"
      aria-label={`Figura do progresso em formato de terço: ${describeTipo(tipo)}`}
    >
      <div
        className="relative mx-auto h-[340px] w-full max-w-[360px]"
        role="list"
        data-testid="progress-terco-layout"
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          data-testid="progress-terco-guide"
          className="absolute inset-0 h-full w-full text-parchment"
          aria-hidden="true"
        >
          <path
            data-testid="progress-terco-guide-loop"
            d="M50 66 C42 59 34 51 25 46 C18 42 15 34 17 27 C20 14 34 8 50 7 C66 8 80 14 83 27 C85 34 82 42 75 46 C66 51 58 59 50 66"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.55"
            strokeDasharray="1.2 2.4"
          />
          <path
            d="M50 71 L50 90"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.65"
            strokeDasharray="1 2.2"
          />
          <path
            d="M50 91 L50 99 M45 95 L55 95"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinecap="round"
          />
        </svg>

        {misterio.etapas.map((etapa, index) => {
          const state =
            index === currentIndex ? 'current' : index < currentIndex ? 'done' : 'pending'
          const tone = beadTone(etapa)
          const position = getBeadPosition(index, misterio.etapas)

          return (
            <span
              key={`${etapa.tipo}-${index}`}
              role="listitem"
              data-testid={`progress-bead-${index}`}
              data-current={index === currentIndex}
              data-state={state}
              data-tone={tone}
              aria-current={index === currentIndex ? 'step' : undefined}
              aria-label={`Etapa ${index + 1} de ${misterio.etapas.length}: ${etapa.label}`}
              title={etapa.label}
              className="absolute flex h-5 w-5 items-center justify-center -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
            >
              <span
                className={`inline-block rounded-full border transition-all duration-200 ${beadClass(
                  tone,
                  state,
                  'compact'
                )}`}
              />
            </span>
          )
        })}
      </div>

      <p className="font-cormorant text-sm text-terco-muted text-center mt-2">
        {currentEtapa?.label ?? 'Etapa atual'} · {progress}%
      </p>
    </section>
  )
}
