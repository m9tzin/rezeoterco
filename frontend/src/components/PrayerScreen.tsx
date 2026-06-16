'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Misterio, FontSize } from '@/data/types'
import { canGoNext, canGoPrev, nextIndex, prevIndex } from '@/lib/navigation'

const FONT_CLASS: Record<FontSize, string> = {
  normal: 'text-lg',
  grande: 'text-2xl',
  'muito-grande': 'text-3xl',
}

const SIZES: FontSize[] = ['normal', 'grande', 'muito-grande']

type Props = {
  misterio: Misterio
  initialIndex: number
  fontSize: FontSize
  onFontChange: (size: FontSize) => void
  onComplete: () => void
  onStepChange: (index: number) => void
  onBack: () => void
}

export function PrayerScreen({
  misterio,
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
    if (canGoNext(index, total)) {
      go(nextIndex(index))
    } else {
      onComplete()
    }
  }, [index, total, go, onComplete])

  const handlePrev = useCallback(() => {
    if (canGoPrev(index)) go(prevIndex(index))
  }, [index, go])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        handleNext()
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleNext, handlePrev])

  const fontIndex = SIZES.indexOf(fontSize)
  const percent = Math.round(((index + 1) / total) * 100)

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col max-w-[680px] mx-auto px-6">
      {/* Header */}
      <div className="pt-5 pb-4 border-b border-[#E5E7EB]">
        {/* Top row: back + mystery name */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={onBack}
            aria-label="Voltar à página inicial"
            className="text-[#6B7280] hover:text-[#8B7355] transition-colors text-sm flex items-center gap-1 shrink-0"
          >
            ← Início
          </button>
          <p className="text-xs text-[#6B7280] uppercase tracking-widest truncate">
            {misterio.titulo}
          </p>
        </div>

        {/* Etapa label */}
        <p className="text-sm text-[#8B7355] font-medium mb-2">{etapa.label}</p>

        {/* Progress bar + percentage */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#8B7355] rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-xs text-[#6B7280] tabular-nums w-9 text-right">{percent}%</span>
        </div>

        {/* Font size controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6B7280]">Tamanho da fonte</span>
          <div className="flex gap-1 ml-auto">
            <button
              onClick={() => fontIndex > 0 && onFontChange(SIZES[fontIndex - 1])}
              disabled={fontIndex === 0}
              aria-label="Diminuir fonte"
              className="px-2.5 py-1 rounded border border-[#E5E7EB] text-[#6B7280] text-xs font-bold hover:border-[#8B7355] disabled:opacity-30 transition-colors bg-white"
            >
              A−
            </button>
            <button
              onClick={() => fontIndex < SIZES.length - 1 && onFontChange(SIZES[fontIndex + 1])}
              disabled={fontIndex === SIZES.length - 1}
              aria-label="Aumentar fonte"
              className="px-2.5 py-1 rounded border border-[#E5E7EB] text-[#6B7280] text-sm font-bold hover:border-[#8B7355] disabled:opacity-30 transition-colors bg-white"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* Prayer text */}
      <div className="flex-1 flex items-center py-8">
        <p
          className={`font-serif text-[#1C1C1E] leading-relaxed whitespace-pre-line transition-opacity duration-150 ${FONT_CLASS[fontSize]} ${visible ? 'opacity-100' : 'opacity-0'}`}
        >
          {etapa.texto}
        </p>
      </div>

      {/* Navigation */}
      <div className="py-6 flex gap-3">
        <button
          onClick={handlePrev}
          disabled={!canGoPrev(index)}
          className="px-5 py-4 rounded-lg border border-[#E5E7EB] text-[#6B7280] font-medium disabled:opacity-30 hover:border-[#8B7355] transition-colors"
        >
          ← Anterior
        </button>
        <button
          onClick={handleNext}
          className="flex-1 py-4 rounded-lg bg-[#8B7355] text-white font-medium text-lg hover:bg-[#7a6347] transition-colors"
        >
          {canGoNext(index, total) ? 'Próximo →' : 'Concluir ✓'}
        </button>
      </div>
    </div>
  )
}
