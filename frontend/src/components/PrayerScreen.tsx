'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Misterio, FontSize } from '@/data/types'
import { canGoNext, canGoPrev, nextIndex, prevIndex } from '@/lib/navigation'
import { FontControls } from './FontControls'

const FONT_CLASS: Record<FontSize, string> = {
  normal: 'text-lg',
  grande: 'text-2xl',
  'muito-grande': 'text-3xl',
}

type Props = {
  misterio: Misterio
  initialIndex: number
  fontSize: FontSize
  onFontChange: (size: FontSize) => void
  onComplete: () => void
  onStepChange: (index: number) => void
}

export function PrayerScreen({
  misterio,
  initialIndex,
  fontSize,
  onFontChange,
  onComplete,
  onStepChange,
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

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col max-w-[680px] mx-auto px-6">
      {/* Header */}
      <div className="py-5 border-b border-[#E5E7EB]">
        <p className="text-xs text-[#6B7280] uppercase tracking-widest">
          {misterio.titulo}
        </p>
        <p className="text-sm text-[#8B7355] font-medium mt-0.5">{etapa.label}</p>
        <div className="mt-2 h-1 bg-[#E5E7EB] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#8B7355] rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Prayer text */}
      <div className="flex-1 flex items-center py-8 pr-14">
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

      <FontControls fontSize={fontSize} onChange={onFontChange} />
    </div>
  )
}
