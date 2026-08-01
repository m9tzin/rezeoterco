import type { Etapa, TipoTerco } from '@/data/types'

export type BeadTone = 'major' | 'minor' | 'intro' | 'final'
export type BeadState = 'pending' | 'current' | 'done'

export function beadTone(etapa: Etapa): BeadTone {
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

export function beadClass(tone: BeadTone, state: BeadState): string {
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

export function describeTipo(tipo: TipoTerco): string {
  if (tipo === 'novena') return 'dias da novena'
  return 'contas do terço'
}
