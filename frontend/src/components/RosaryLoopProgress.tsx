'use client'

import type { Misterio, TipoTerco } from '@/data/types'
import { beadSurfaceClass, beadTone, describeTipo } from './progress-beads'
import { VIEW_WIDTH, buildRosaryLayout } from './rosary-loop-geometry'

type Props = {
  misterio: Misterio
  tipo: TipoTerco
  currentIndex: number
}

export function RosaryLoopProgress({ misterio, tipo, currentIndex }: Props) {
  const currentEtapa = misterio.etapas[currentIndex]
  const progress = Math.round(((currentIndex + 1) / misterio.etapas.length) * 100)
  const tones = misterio.etapas.map(beadTone)
  const layout = buildRosaryLayout(tones)
  const { cross } = layout

  return (
    <section
      className="w-full max-w-[560px] md:max-w-2xl lg:max-w-3xl mb-5"
      aria-label={`Figura do progresso em formato de terço: ${describeTipo(tipo)}`}
    >
      <div
        className="relative mx-auto w-full max-w-[228px]"
        style={{ aspectRatio: `${VIEW_WIDTH} / ${layout.viewHeight}` }}
        role="list"
        data-testid="progress-terco-layout"
      >
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${layout.viewHeight}`}
          preserveAspectRatio="xMidYMid meet"
          data-testid="progress-terco-cross"
          className="absolute inset-0 h-full w-full text-[#c9b99a]"
          aria-hidden="true"
        >
          <rect
            x={cross.x - cross.bar / 2}
            y={cross.top}
            width={cross.bar}
            height={cross.height}
            rx={cross.bar * 0.2}
            fill="currentColor"
          />
          <rect
            x={cross.x - cross.width / 2}
            y={cross.armTop}
            width={cross.width}
            height={cross.bar}
            rx={cross.bar * 0.2}
            fill="currentColor"
          />
        </svg>

        {misterio.etapas.map((etapa, index) => {
          const state =
            index === currentIndex ? 'current' : index < currentIndex ? 'done' : 'pending'
          const tone = tones[index]
          const bead = layout.beads[index]

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
              className={`absolute rounded-full border -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${beadSurfaceClass(
                tone,
                state
              )}`}
              style={{
                left: `${(bead.x / VIEW_WIDTH) * 100}%`,
                top: `${(bead.y / layout.viewHeight) * 100}%`,
                width: `${(bead.diameter / VIEW_WIDTH) * 100}%`,
                aspectRatio: '1',
              }}
            />
          )
        })}
      </div>

      <p className="font-cormorant text-sm text-terco-muted text-center mt-2">
        {currentEtapa?.label ?? 'Etapa atual'} · {progress}%
      </p>
    </section>
  )
}
