'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Misterio, FontSize, TipoTerco } from '@/data/types'
import { canGoNext, canGoPrev, nextIndex, prevIndex } from '@/lib/navigation'
import { useSpeechSynthesis } from '@/lib/useSpeechSynthesis'
import { RosaryProgress } from './RosaryProgress'

const FONT_CLASS: Record<FontSize, string> = {
  normal: 'text-xl',
  grande: 'text-2xl',
  'muito-grande': 'text-3xl',
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
  const cardRef = useRef<HTMLDivElement>(null)

  const etapa = misterio.etapas[index]
  const total = misterio.etapas.length
  const speech = useSpeechSynthesis(etapa.texto)

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
    speech.stop()
    if (canGoNext(index, total)) go(nextIndex(index))
    else onComplete()
  }, [index, total, go, onComplete, speech])

  const handlePrev = useCallback(() => {
    speech.stop()
    if (canGoPrev(index)) go(prevIndex(index))
  }, [index, go, speech])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); handleNext() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); handlePrev() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleNext, handlePrev])

  useEffect(() => {
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [index])

  const fontIndex = SIZES.indexOf(fontSize)
  const percent = Math.round(((index + 1) / total) * 100)
  const isLast = !canGoNext(index, total)

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center px-4 pb-36">

      {/* ── Header ── */}
      <div className="w-full max-w-[560px] pt-5 pb-3">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 font-cormorant text-base text-terco-muted hover:text-brown transition-colors min-h-[44px] pr-4"
            aria-label="Voltar ao início"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M13 8H3M7 12l-4-4 4-4" />
            </svg>
            Início
          </button>
          <p className="font-cormorant font-semibold text-lg text-brown truncate ml-4 max-w-[240px]">
            {misterio.titulo}
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div
            className="flex-1 h-[2px] bg-parchment rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progresso: ${percent}%`}
          >
            <div
              className="h-full bg-gold rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="font-cormorant text-sm text-terco-muted tabular-nums w-9 text-right">
            {percent}%
          </span>
        </div>
      </div>

      <RosaryProgress misterio={misterio} tipo={tipo} currentIndex={index} />

      {/* ── Prayer card ── */}
      <div
        ref={cardRef}
        data-speaking={speech.isSpeaking}
        className={`w-full max-w-[560px] bg-white border rounded-sm px-7 py-7 mb-5 transition-all duration-150 ${
          speech.isSpeaking
            ? 'border-gold shadow-[0_0_0_3px_rgba(154,123,63,0.16),0_2px_20px_rgba(92,61,46,0.12)]'
            : 'border-parchment shadow-[0_2px_20px_rgba(92,61,46,0.09)]'
        } ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Step label */}
        <p className="font-cormorant font-semibold text-base text-gold tracking-wide mb-3 uppercase flex items-center gap-2">
          {speech.isSpeaking && (
            <span
              className="inline-block h-2 w-2 rounded-full bg-gold"
              aria-hidden="true"
            />
          )}
          {etapa.label}
        </p>

        {/* Subtle divider */}
        <div className="w-8 h-px bg-gold/30 mb-4" aria-hidden="true" />

        {/* Prayer text */}
        <p
          className={`font-garamond text-terco-text leading-[1.9] whitespace-pre-line ${FONT_CLASS[fontSize]}`}
        >
          {etapa.texto}
        </p>
      </div>

      {/* ── Font size controls ── */}
      <div className="flex items-center gap-3 w-full max-w-[560px] mb-1">
        <span className="font-cormorant text-sm text-terco-muted/70 tracking-wide">
          Tamanho da fonte
        </span>
        <div className="flex gap-1.5 ml-auto">
          <button
            onClick={speech.toggle}
            disabled={!speech.isSupported}
            aria-pressed={speech.isSpeaking}
            aria-label={speech.isSpeaking ? 'Parar leitura em voz alta' : 'Ler oração em voz alta'}
            className={`min-h-[44px] px-4 flex items-center justify-center border font-cormorant text-base transition-colors rounded-sm disabled:opacity-30 ${
              speech.isSpeaking
                ? 'border-gold bg-gold text-cream'
                : 'border-parchment bg-white text-terco-muted hover:border-gold hover:text-brown'
            }`}
          >
            {speech.isSpeaking ? 'Parar' : 'Ouvir'}
          </button>
          <button
            onClick={() => fontIndex > 0 && onFontChange(SIZES[fontIndex - 1])}
            disabled={fontIndex === 0}
            aria-label="Diminuir fonte"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center border border-parchment text-terco-muted font-cormorant text-base hover:border-gold disabled:opacity-30 transition-colors bg-white rounded-sm"
          >
            A−
          </button>
          <button
            onClick={() =>
              fontIndex < SIZES.length - 1 && onFontChange(SIZES[fontIndex + 1])
            }
            disabled={fontIndex === SIZES.length - 1}
            aria-label="Aumentar fonte"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center border border-parchment text-terco-muted font-cormorant text-base hover:border-gold disabled:opacity-30 transition-colors bg-white rounded-sm"
          >
            A+
          </button>
        </div>
      </div>

      {/* ── Navigation (fixed) ── */}
      <div className="fixed bottom-12 left-0 right-0 px-4">
        <div className="flex justify-center gap-2 max-w-[560px] mx-auto">
          <button
            onClick={handlePrev}
            disabled={!canGoPrev(index)}
            aria-label="Etapa anterior"
            className="font-cormorant text-base px-5 min-h-[52px] border border-gold/60 bg-parchment text-brown disabled:opacity-30 hover:bg-[#e5d9c0] transition-colors rounded-sm active:scale-[0.97] shrink-0"
          >
            ← Voltar
          </button>
          <button
            onClick={handleNext}
            className={`font-cormorant text-base flex-1 min-h-[52px] text-cream transition-colors rounded-sm active:scale-[0.97] shadow-[0_2px_12px_rgba(92,61,46,0.2)] ${
              isLast
                ? 'bg-gold hover:bg-gold-dark'
                : 'bg-brown hover:bg-brown-dark'
            }`}
            aria-label={isLast ? 'Finalizar terço' : 'Próxima etapa'}
          >
            {isLast ? (
              <span className="flex items-center justify-center gap-2">
                Finalizar
                <svg width="10" height="16" viewBox="0 0 28 44" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <line x1="14" y1="1" x2="14" y2="43" />
                  <line x1="2" y1="13" x2="26" y2="13" />
                </svg>
              </span>
            ) : 'Avançar →'}
          </button>
        </div>
      </div>
    </div>
  )
}
