'use client'

import type { Misterio, TipoTerco } from '@/data/types'
import { beadClass, beadTone, describeTipo } from './progress-beads'

type Props = {
  misterio: Misterio
  tipo: TipoTerco
  currentIndex: number
}

function getBeadPosition(index: number, total: number): { x: number; y: number } {
  const angle = -95 + (index / total) * 360
  const radians = (angle * Math.PI) / 180

  return {
    x: 50 + Math.cos(radians) * 38,
    y: 39 + Math.sin(radians) * 31,
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
        className="relative mx-auto h-[300px] w-full max-w-[360px]"
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
          <ellipse
            cx="50"
            cy="39"
            rx="38"
            ry="31"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.55"
            strokeDasharray="1.2 2.4"
          />
          <path
            d="M50 70 C50 73 50 75 50 78 M50 81 L50 91"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
          />
          <circle cx="50" cy="79" r="2.2" fill="none" stroke="currentColor" strokeWidth="0.75" />
          <path
            d="M50 88 L50 99 M45 93 L55 93"
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
