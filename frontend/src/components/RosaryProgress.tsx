'use client'

import type { Misterio, ProgressLayout, TipoTerco } from '@/data/types'
import { RosaryLoopProgress } from './RosaryLoopProgress'
import { beadClass, beadTone, describeTipo } from './progress-beads'

type Props = {
  misterio: Misterio
  tipo: TipoTerco
  currentIndex: number
  layout?: ProgressLayout
}

export function RosaryProgress({ misterio, tipo, currentIndex, layout = 'linear' }: Props) {
  if (layout === 'terco') {
    return <RosaryLoopProgress misterio={misterio} tipo={tipo} currentIndex={currentIndex} />
  }

  const currentEtapa = misterio.etapas[currentIndex]
  const progress = Math.round(((currentIndex + 1) / misterio.etapas.length) * 100)

  return (
    <section
      className="w-full max-w-[560px] md:max-w-2xl lg:max-w-3xl mb-5"
      aria-label={`Figura do progresso em linha: ${describeTipo(tipo)}`}
    >
      <div
        className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 px-1 py-2"
        role="list"
        data-testid="progress-linear-layout"
      >
        {misterio.etapas.map((etapa, index) => {
          const state =
            index === currentIndex ? 'current' : index < currentIndex ? 'done' : 'pending'
          const tone = beadTone(etapa)

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
              className={`inline-block rounded-full border transition-all duration-200 ${beadClass(
                tone,
                state
              )}`}
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
