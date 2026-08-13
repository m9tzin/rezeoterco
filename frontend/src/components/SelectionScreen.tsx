'use client'

import { useEffect, useState, type ReactNode } from 'react'
import type { TipoTerco, Progress, ProgressLayout } from '@/data/types'
import { TERCOS, TERCO_LIST } from '@/data/index'
import { VerseOfDay } from './VerseOfDay'
import { RosaryLogo } from './RosaryLogo'
import { TopNav } from './TopNav'
import { TypewriterTitle } from './TypewriterTitle'

type Props = {
  savedProgress: Progress | null
  progressLayout: ProgressLayout
  onSelectMisterio: (tipo: TipoTerco, misterioId: string) => void
  onResume: () => void
  onDismissProgress: () => void
  onProgressLayoutChange: (layout: ProgressLayout) => void
  onShowSelection?: () => void
  onShowWelcome: () => void
}

const CruzSVG = (
  <svg width="22" height="34" viewBox="0 0 28 44" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="14" y1="1" x2="14" y2="43" />
    <line x1="2" y1="13" x2="26" y2="13" />
  </svg>
)

const MISTERIO_VISUAL: Record<
  string,
  { simbolo: ReactNode; tema: string; dias: string; cor: string }
> = {
  gozosos: {
    simbolo: '✿',
    tema: 'Alegria · Encarnação',
    dias: 'Segunda · Sábado',
    cor: '#9a7b3f',
  },
  luminosos: {
    simbolo: '✦',
    tema: 'Luz · Ministério de Jesus',
    dias: 'Quinta',
    cor: '#3b6ea5',
  },
  dolorosos: {
    simbolo: CruzSVG,
    tema: 'Sofrimento · Paixão',
    dias: 'Terça · Sexta',
    cor: '#8b2020',
  },
  gloriosos: {
    simbolo: '✸',
    tema: 'Glória · Ressurreição',
    dias: 'Quarta · Domingo',
    cor: '#c9a85c',
  },
  'santa-terezinha': {
    simbolo: 'ST',
    tema: 'Confiança · Pequeno caminho',
    dias: '9 dias',
    cor: '#b46a7c',
  },
  'santo-antonio': {
    simbolo: 'SA',
    tema: 'Caridade · Evangelho',
    dias: '9 dias',
    cor: '#7d6b4f',
  },
  'nossa-senhora-das-gracas': {
    simbolo: 'NS',
    tema: 'Graças · Intercessão',
    dias: '9 dias',
    cor: '#4d7ca8',
  },
}

function getTodayMisterioId(): string {
  const map: Record<number, string> = {
    0: 'gloriosos',
    1: 'gozosos',
    2: 'dolorosos',
    3: 'gloriosos',
    4: 'luminosos',
    5: 'dolorosos',
    6: 'gozosos',
  }
  return map[new Date().getDay()]
}

export function SelectionScreen({
  savedProgress,
  progressLayout,
  onSelectMisterio,
  onResume,
  onDismissProgress,
  onProgressLayoutChange,
  onShowSelection = () => {},
  onShowWelcome,
}: Props) {
  const [activeTipo, setActiveTipo] = useState<TipoTerco>(savedProgress?.tipo ?? 'mariano')
  const activeTerco = TERCOS[activeTipo]
  const todayId = getTodayMisterioId()
  const hasMultipleOptions = activeTerco.misterios.length > 1

  useEffect(() => {
    if (savedProgress) setActiveTipo(savedProgress.tipo)
  }, [savedProgress])

  return (
    <div className="bg-cream flex flex-col items-center px-4 pb-8">
      {/* Hero */}
      <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl text-center pt-10 pb-8">
        <TopNav onShowSelection={onShowSelection} onShowWelcome={onShowWelcome} />

        <RosaryLogo width={40} className="text-brown mx-auto mb-6" />

        <TypewriterTitle
          caretTestId="selection-title-caret"
          className="font-cormorant font-semibold text-[2.75rem] leading-tight text-brown tracking-widest uppercase mb-3"
        />
        <p className="font-garamond italic text-terco-muted text-lg leading-relaxed max-w-[18rem] md:max-w-xl mx-auto">
          Guia passo a passo para rezar o terço com calma e devoção.
        </p>

        <div className="mt-8 flex items-center gap-3 justify-center">
          <div className="h-px flex-1 bg-parchment" />
          <span className="text-gold-light text-sm select-none tracking-[0.4em]">✦ ✦ ✦</span>
          <div className="h-px flex-1 bg-parchment" />
        </div>
      </div>

      <VerseOfDay />

      <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl mb-7">
        <p className="font-cormorant font-semibold text-base text-terco-muted/80 mb-3 tracking-wide">
          Formato do progresso
        </p>
        <div className="inline-flex rounded-sm border border-parchment bg-white p-1">
          {([
            ['linear', 'Pedras'],
            ['terco', 'Terço'],
          ] as const).map(([layout, label]) => (
            <button
              key={layout}
              type="button"
              onClick={() => onProgressLayoutChange(layout)}
              aria-pressed={progressLayout === layout}
              className={`min-h-[40px] px-4 rounded-sm font-cormorant text-base transition-all duration-200 motion-safe:ease-out active:scale-[0.97] [@media(hover:hover)]:hover:-translate-y-0.5 ${
                progressLayout === layout
                  ? 'bg-brown text-cream shadow-[0_1px_4px_rgba(92,61,46,0.16)] [@media(hover:hover)]:hover:shadow-[0_3px_10px_rgba(92,61,46,0.18)]'
                  : 'text-terco-muted [@media(hover:hover)]:hover:text-brown [@media(hover:hover)]:hover:shadow-[0_3px_10px_rgba(92,61,46,0.1)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Resume banner */}
      {savedProgress && (
        <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl mb-7 border border-gold/40 rounded-sm px-5 py-4 bg-[#faf8f3] shadow-[0_1px_8px_rgba(154,123,63,0.08)]">
          <p className="font-garamond italic text-terco-text text-base mb-4 leading-relaxed">
            Você parou em{' '}
            <strong className="font-normal not-italic text-brown">
              {TERCOS[savedProgress.tipo].misterios.find(
                (m) => m.id === savedProgress.misterioId
              )?.titulo ?? 'um mistério'}
            </strong>{' '}
            — etapa {savedProgress.etapaIndex + 1}.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onResume}
              className="font-cormorant text-base tracking-wide flex-1 min-h-[44px] bg-brown text-cream rounded-sm transition-all duration-200 motion-safe:ease-out active:scale-[0.97] [@media(hover:hover)]:hover:bg-brown-dark [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-[0_4px_12px_rgba(92,61,46,0.2)]"
            >
              Continuar
            </button>
            <button
              onClick={onDismissProgress}
              className="font-cormorant text-base tracking-wide flex-1 min-h-[44px] border border-gold/60 text-brown rounded-sm transition-all duration-200 motion-safe:ease-out active:scale-[0.97] [@media(hover:hover)]:hover:bg-parchment [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-[0_3px_10px_rgba(92,61,46,0.1)]"
            >
              Começar do zero
            </button>
          </div>
        </div>
      )}

      {/* Terço type selector */}
      <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl mb-7">
        <p className="font-cormorant font-semibold text-base text-terco-muted/80 mb-3 tracking-wide">
          Tipo de devoção
        </p>
        <div className="flex gap-2 flex-wrap">
          {TERCO_LIST.map((terco) => (
            <button
              key={terco.id}
              onClick={() => {
                if (TERCOS[terco.id].misterios.length === 1) {
                  const firstMisterio = TERCOS[terco.id].misterios[0]
                  onSelectMisterio(terco.id, firstMisterio.id)
                  return
                }
                setActiveTipo(terco.id)
              }}
              className={`font-cormorant px-5 min-h-[44px] rounded-sm text-base border transition-all duration-200 motion-safe:ease-out active:scale-[0.97] [@media(hover:hover)]:hover:-translate-y-0.5 ${
                activeTipo === terco.id
                  ? 'bg-brown text-cream border-brown shadow-[0_2px_8px_rgba(92,61,46,0.18)] [@media(hover:hover)]:hover:shadow-[0_4px_12px_rgba(92,61,46,0.2)]'
                  : 'bg-white text-terco-muted border-parchment hover:border-gold hover:text-brown [@media(hover:hover)]:hover:shadow-[0_3px_10px_rgba(92,61,46,0.1)]'
              }`}
            >
              {terco.nome}
            </button>
          ))}
        </div>
      </div>

      {/* Option cards */}
      {hasMultipleOptions && (
        <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl">
          <div className="flex items-baseline justify-between mb-4">
            <p className="font-cormorant font-semibold text-lg text-terco-muted">
              {activeTipo === 'novena' ? 'Escolha a novena' : 'Escolha o mistério'}
            </p>
            {activeTipo === 'mariano' && (
              <p className="font-cormorant text-sm text-terco-muted">
                Hoje:{' '}
                <span className="text-brown italic">
                  {activeTerco.misterios.find((m) => m.id === todayId)?.titulo ?? '—'}
                </span>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {activeTerco.misterios.map((misterio) => {
              const vis = MISTERIO_VISUAL[misterio.id]
              const isToday = activeTipo === 'mariano' && misterio.id === todayId
              return (
                <button
                  key={misterio.id}
                  onClick={() => onSelectMisterio(activeTipo, misterio.id)}
                  className={`w-full text-left flex items-center gap-4 px-5 py-4 border bg-white hover:bg-[#faf8f3] transition-all duration-200 motion-safe:ease-out rounded-sm active:scale-[0.99] group shadow-[0_1px_4px_rgba(92,61,46,0.05)] [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-[0_5px_16px_rgba(92,61,46,0.12)] ${
                    isToday ? 'border-[1.5px]' : 'border-parchment'
                  }`}
                  style={isToday ? { borderColor: vis?.cor } : undefined}
                  aria-label={`${misterio.titulo}${isToday ? ' — recomendado para hoje' : ''}`}
                >
                  {/* Colored accent bar */}
                  <div
                    className="w-[3px] self-stretch rounded-full shrink-0"
                    style={{ backgroundColor: vis?.cor ?? '#9a7b3f' }}
                    aria-hidden="true"
                  />

                  {/* Symbol */}
                  <span
                    className="text-[2rem] select-none shrink-0 transition-transform group-hover:scale-110 duration-200 w-9 text-center leading-none"
                    style={{ color: vis?.cor ?? '#9a7b3f' }}
                    aria-hidden="true"
                  >
                    {vis?.simbolo ?? '✝'}
                  </span>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-cormorant font-semibold text-brown text-2xl leading-snug">
                        {misterio.titulo}
                      </p>
                      {isToday && (
                        <span
                          className="font-cormorant text-xs px-1.5 py-0.5 rounded-sm text-white shrink-0 tracking-wide"
                          style={{ backgroundColor: vis?.cor ?? '#9a7b3f' }}
                        >
                          Hoje
                        </span>
                      )}
                    </div>
                    <p className="font-garamond italic text-terco-muted text-sm leading-snug">
                      {vis?.tema ?? ''}
                    </p>
                    <p className="font-cormorant text-xs text-terco-muted/60 mt-1">
                      {vis?.dias ?? ''}
                    </p>
                  </div>

                  {/* Arrow icon */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-parchment group-hover:text-gold transition-colors shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Single-sequence CTA */}
      {!hasMultipleOptions && (
        <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl mt-2">
          <button
            onClick={() => {
              const misterio = TERCOS[activeTipo].misterios[0]
              onSelectMisterio(activeTipo, misterio.id)
            }}
            className="w-full min-h-[52px] font-cormorant text-lg tracking-wide bg-brown text-cream rounded-sm hover:bg-brown-dark transition-colors active:scale-[0.97] shadow-[0_2px_12px_rgba(92,61,46,0.18)]"
          >
            Começar →
          </button>
        </div>
      )}
    </div>
  )
}
