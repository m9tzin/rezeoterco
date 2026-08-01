'use client'

import type { Etapa, Misterio, TipoTerco } from '@/data/types'

type Props = {
  misterio: Misterio
  tipo: TipoTerco
  currentIndex: number
}

type BeadTone = 'major' | 'minor' | 'intro' | 'final'

function beadTone(etapa: Etapa): BeadTone {
  if (
    etapa.tipo === 'pai-nosso' ||
    etapa.tipo === 'misericordia-oferta' ||
    etapa.tipo === 'conta-grande' ||
    etapa.tipo === 'anuncio' ||
    etapa.tipo === 'novena-dia'
  ) {
    return 'major'
  }

  if (
    etapa.tipo === 'salve-rainha' ||
    etapa.tipo === 'misericordia-final' ||
    etapa.tipo === 'oracao-final'
  ) {
    return 'final'
  }

  if (
    etapa.tipo === 'credo' ||
    etapa.tipo === 'sinal-cruz' ||
    etapa.tipo === 'gloria' ||
    etapa.tipo === 'fatima' ||
    etapa.tipo === 'oracao-inicial'
  ) {
    return 'intro'
  }

  return 'minor'
}

function beadClass(tone: BeadTone, state: 'pending' | 'current' | 'done'): string {
  const size = tone === 'major' || tone === 'final' ? 'h-3.5 w-3.5' : 'h-2.5 w-2.5'

  if (state === 'current') {
    return `${size} bg-red-800 border-red-800 shadow-[0_0_0_5px_rgba(139,32,32,0.16)] scale-125`
  }

  if (state === 'done') {
    return `${size} ${
      tone === 'major' || tone === 'final' ? 'bg-brown border-brown' : 'bg-gold border-gold'
    }`
  }

  return `${size} bg-parchment border-[#c9b99a]`
}

function describeTipo(tipo: TipoTerco): string {
  if (tipo === 'novena') return 'dias da novena'
  return 'contas do terço'
}

export function RosaryProgress({ misterio, tipo, currentIndex }: Props) {
  const currentEtapa = misterio.etapas[currentIndex]
  const progress = Math.round(((currentIndex + 1) / misterio.etapas.length) * 100)

  return (
    <section
      className="w-full max-w-[560px] md:max-w-2xl lg:max-w-3xl mb-5"
      aria-label={`Figura do progresso: ${describeTipo(tipo)}`}
    >
      <div
        className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 px-1 py-2"
        role="list"
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
