'use client'

import type { Misterio, TipoTerco } from '@/data/types'
import { beadClass, beadTone, describeTipo } from './progress-beads'

type Props = {
  misterio: Misterio
  tipo: TipoTerco
  currentIndex: number
}

function getBeadPosition(index: number, total: number): { x: number; y: number } {
  const angle = -100 + (index / total) * 360
  const radians = (angle * Math.PI) / 180

  return {
    x: 50 + Math.cos(radians) * 42,
    y: 45 + Math.sin(radians) * 34,
  }
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
        className="relative mx-auto h-[228px] w-full max-w-[360px]"
        role="list"
        data-testid="progress-terco-layout"
      >
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full text-parchment"
          aria-hidden="true"
        >
          <ellipse
            cx="50"
            cy="45"
            rx="42"
            ry="34"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.7"
            strokeDasharray="1.5 3"
          />
          <path d="M50 79 L50 90" stroke="currentColor" strokeWidth="0.9" />
          <path d="M50 88 L50 98 M45 92 L55 92" stroke="currentColor" strokeWidth="1.5" />
        </svg>

        {misterio.etapas.map((etapa, index) => {
          const state =
            index === currentIndex ? 'current' : index < currentIndex ? 'done' : 'pending'
          const tone = beadTone(etapa)
          const position = getBeadPosition(index, misterio.etapas.length)

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
                  state
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
