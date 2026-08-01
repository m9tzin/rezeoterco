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

/** Colour and emphasis of a bead, with no size baked in. */
export function beadSurfaceClass(tone: BeadTone, state: BeadState): string {
  if (state === 'current') {
    return 'bg-red-800 border-red-800 shadow-[0_0_0_5px_rgba(139,32,32,0.16)] scale-125'
  }

  if (state === 'done') {
    return tone === 'major' || tone === 'final' ? 'bg-brown border-brown' : 'bg-gold border-gold'
  }

  return 'bg-parchment border-[#c9b99a]'
}

/**
 * Relative bead diameter, for layouts that size beads from their own geometry
 * instead of a fixed class. Kept in step with the sizes `beadClass` hands out.
 */
export function beadScale(tone: BeadTone): number {
  if (tone === 'major' || tone === 'final') return 1.35
  if (tone === 'intro') return 1.15
  return 1
}

export function beadClass(
  tone: BeadTone,
  state: BeadState,
  density: 'default' | 'compact' = 'default'
): string {
  const size =
    tone === 'major' || tone === 'final'
      ? density === 'compact'
        ? 'h-3 w-3'
        : 'h-3.5 w-3.5'
      : density === 'compact'
        ? 'h-2 w-2'
        : 'h-2.5 w-2.5'

  return `${size} ${beadSurfaceClass(tone, state)}`
}

export function describeTipo(tipo: TipoTerco): string {
  if (tipo === 'novena') return 'dias da novena'
  return 'contas do terço'
}
