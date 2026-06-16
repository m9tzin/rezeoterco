'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Misterio, FontSize, TipoTerco } from '@/data/types'
import { canGoNext, canGoPrev, nextIndex, prevIndex } from '@/lib/navigation'
import { RosaryBeads } from './RosaryBeads'

const FONT_CLASS: Record<FontSize, string> = {
  normal: 'text-2xl',
  grande: 'text-3xl',
  'muito-grande': 'text-4xl',
}

const SIZES: FontSize[] = ['normal', 'grande', 'muito-grande']

type Props = {
  misterio: Misterio
  tipo: TipoTerco
  initialIndex: number
  fontSize: FontSize
  onFontChange: (size: FontSize) => void
  onComplete: () => void
  onStepChange: (index: number) => void
  onBack: () => void
}

export function PrayerScreen({
  misterio,
  tipo,
  initialIndex,
  fontSize,
  onFontChange,
  onComplete,
  onStepChange,
  onBack,
}: Props) {
  const [index, setIndex] = useState(initialIndex)
  const [visible, setVisible] = useState(true)

  const etapa = misterio.etapas[index]
  const total = misterio.etapas.length

  const go = useCallback(
    (newIndex: number) => {
      setVisible(false)
      setTimeout(() => {
        setIndex(newIndex)
        onStepChange(newIndex)
        setVisible(true)
      }, 150)
    },
    [onStepChange]
  )

  const handleNext = useCallback(() => {
    if (canGoNext(index, total)) go(nextIndex(index))
    else onComplete()
  }, [index, total, go, onComplete])

  const handlePrev = useCallback(() => {
    if (canGoPrev(index)) go(prevIndex(index))
  }, [index, go])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); handleNext() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); handlePrev() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleNext, handlePrev])

  const fontIndex = SIZES.indexOf(fontSize)
  const percent = Math.round(((index + 1) / total) * 100)

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center px-4 pb-40">

      {/* ── Header ── */}
      <div className="w-full max-w-[560px] pt-6 pb-3">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="font-cormorant text-base text-terco-muted hover:text-brown transition-colors"
          >
            ← Início
          </button>
          <p className="font-cormorant italic text-base text-terco-muted truncate ml-4">
            {misterio.titulo}
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-[3px] bg-parchment rounded-full overflow-hidden">
            <div
              className="h-full bg-gold rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="font-cormorant text-sm text-terco-muted tabular-nums w-8 text-right">
            {percent}%
          </span>
        </div>
      </div>

      {/* ── Rosary beads (Marian only) ── */}
      {tipo === 'mariano' && <RosaryBeads currentIndex={index} />}

      {/* ── Prayer card ── */}
      <div
        className={`w-full max-w-[560px] bg-white border border-parchment rounded-sm shadow-[0_2px_16px_rgba(92,61,46,0.07)] px-7 py-6 mb-5 transition-opacity duration-150 ${visible ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Eyebrow: step label */}
        <p className="font-cormorant italic text-base text-gold mb-3">
          {etapa.label}
        </p>
        {/* Prayer text */}
        <p className={`font-garamond text-terco-text leading-[1.85] whitespace-pre-line ${FONT_CLASS[fontSize]}`}>
          {etapa.texto}
        </p>
      </div>

      {/* ── Font size controls ── */}
      <div className="flex items-center gap-3 w-full max-w-[560px] mb-2">
        <span className="font-cormorant text-base text-terco-muted">Tamanho da fonte</span>
        <div className="flex gap-1 ml-auto">
          <button
            onClick={() => fontIndex > 0 && onFontChange(SIZES[fontIndex - 1])}
            disabled={fontIndex === 0}
            aria-label="Diminuir fonte"
            className="px-3 py-1 border border-parchment text-terco-muted font-cormorant text-base hover:border-gold disabled:opacity-30 transition-colors bg-white rounded-sm"
          >
            A−
          </button>
          <button
            onClick={() => fontIndex < SIZES.length - 1 && onFontChange(SIZES[fontIndex + 1])}
            disabled={fontIndex === SIZES.length - 1}
            aria-label="Aumentar fonte"
            className="px-3 py-1 border border-parchment text-terco-muted font-cormorant text-base hover:border-gold disabled:opacity-30 transition-colors bg-white rounded-sm"
          >
            A+
          </button>
        </div>
      </div>

      {/* ── Navigation (fixed) ── */}
      <div className="fixed bottom-12 left-0 right-0 flex justify-center gap-3 px-4">
        <button
          onClick={handlePrev}
          disabled={!canGoPrev(index)}
          className="font-cormorant text-lg px-6 py-3 border border-gold bg-parchment text-brown disabled:opacity-30 hover:bg-[#e0d5bd] transition-colors rounded-sm active:scale-[0.97]"
        >
          ← Voltar
        </button>
        <button
          onClick={handleNext}
          className="font-cormorant text-lg flex-1 max-w-[280px] py-3 bg-brown text-cream hover:bg-brown-dark transition-colors rounded-sm active:scale-[0.97]"
        >
          {canGoNext(index, total) ? 'Avançar →' : 'Finalizar ✝'}
        </button>
      </div>
    </div>
  )
}
