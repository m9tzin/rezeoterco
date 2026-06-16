'use client'

import type { TipoTerco, Progress } from '@/data/types'
import { TERCOS, TERCO_LIST } from '@/data/index'

type Props = {
  savedProgress: Progress | null
  onSelectMisterio: (tipo: TipoTerco, misterioId: string) => void
  onResume: () => void
  onDismissProgress: () => void
}

const MISTERIO_VISUAL: Record<
  string,
  { simbolo: string; tema: string; dias: string; cor: string }
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
    simbolo: '✝',
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
  onSelectMisterio,
  onResume,
  onDismissProgress,
}: Props) {
  const activeTipo: TipoTerco = savedProgress?.tipo ?? 'mariano'
  const activeTerco = TERCOS[activeTipo]
  const todayId = getTodayMisterioId()

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center px-4 pb-16">
      {/* Hero */}
      <div className="w-full max-w-lg text-center pt-12 pb-8 mb-2">
        {/* Minimalist SVG cross */}
        <svg
          width="28"
          height="44"
          viewBox="0 0 28 44"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          className="text-gold mx-auto mb-5"
          aria-hidden="true"
        >
          <line x1="14" y1="1" x2="14" y2="43" />
          <line x1="2" y1="13" x2="26" y2="13" />
        </svg>

        <h1 className="font-cormorant font-light text-4xl text-brown tracking-wide uppercase mb-3">
          Reze o Terço
        </h1>
        <p className="font-garamond italic text-terco-muted text-lg leading-relaxed max-w-xs mx-auto">
          Guia passo a passo para rezar o terço com calma e devoção.
        </p>
        <div className="mt-7 flex items-center gap-3 justify-center">
          <div className="h-px flex-1 bg-parchment" />
          <span className="text-gold text-base select-none">✦ ✦ ✦</span>
          <div className="h-px flex-1 bg-parchment" />
        </div>
      </div>

      {/* Resume banner */}
      {savedProgress && (
        <div className="w-full max-w-lg mb-6 border border-gold-light rounded-sm p-4 bg-[#faf8f3]">
          <p className="font-garamond italic text-terco-text text-base mb-3">
            Você parou em{' '}
            <strong>
              {TERCOS[savedProgress.tipo].misterios.find(
                (m) => m.id === savedProgress.misterioId
              )?.titulo ?? 'um mistério'}
            </strong>{' '}
            — etapa {savedProgress.etapaIndex + 1}.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onResume}
              className="font-cormorant text-base tracking-wide flex-1 py-2.5 bg-brown text-cream rounded-sm hover:bg-brown-dark transition-colors active:scale-[0.97]"
            >
              Continuar
            </button>
            <button
              onClick={onDismissProgress}
              className="font-cormorant text-base tracking-wide flex-1 py-2.5 border border-gold text-brown rounded-sm hover:bg-parchment transition-colors active:scale-[0.97]"
            >
              Começar do zero
            </button>
          </div>
        </div>
      )}

      {/* Terço type selector */}
      <div className="w-full max-w-lg mb-7">
        <p className="font-cormorant italic text-sm text-terco-muted mb-3">Tipo de terço</p>
        <div className="flex gap-2 flex-wrap">
          {TERCO_LIST.map((terco) => (
            <button
              key={terco.id}
              onClick={() => {
                const firstMisterio = TERCOS[terco.id].misterios[0]
                onSelectMisterio(terco.id, firstMisterio.id)
              }}
              className={`font-cormorant px-4 py-2 rounded-sm text-base border transition-colors active:scale-[0.97] ${
                activeTipo === terco.id
                  ? 'bg-brown text-cream border-brown'
                  : 'bg-white text-terco-muted border-parchment hover:border-gold'
              }`}
            >
              {terco.nome}
            </button>
          ))}
        </div>
      </div>

      {/* Mystery cards */}
      {activeTipo === 'mariano' && (
        <div className="w-full max-w-lg">
          <div className="flex items-baseline justify-between mb-3">
            <p className="font-cormorant italic text-base text-terco-muted">Escolha o mistério</p>
            <p className="font-cormorant text-base text-terco-muted">
              Hoje:{' '}
              <span className="text-brown italic">
                {activeTerco.misterios.find((m) => m.id === todayId)?.titulo ?? '—'}
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {activeTerco.misterios.map((misterio) => {
              const vis = MISTERIO_VISUAL[misterio.id]
              const isToday = misterio.id === todayId
              return (
                <button
                  key={misterio.id}
                  onClick={() => onSelectMisterio('mariano', misterio.id)}
                  className="w-full text-left flex items-center gap-5 px-5 py-5 border border-parchment bg-white hover:bg-[#faf8f3] transition-all rounded-sm active:scale-[0.99] group"
                  style={isToday ? { borderColor: vis?.cor } : undefined}
                >
                  {/* Colored accent bar */}
                  <div
                    className="w-1 self-stretch rounded-full shrink-0"
                    style={{ backgroundColor: vis?.cor ?? '#9a7b3f' }}
                  />

                  {/* Symbol */}
                  <span
                    className="text-4xl select-none shrink-0 transition-transform group-hover:scale-110 duration-200"
                    style={{ color: vis?.cor ?? '#9a7b3f' }}
                  >
                    {vis?.simbolo ?? '✝'}
                  </span>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-cormorant text-brown text-xl">
                        {misterio.titulo}
                      </p>
                      {isToday && (
                        <span
                          className="font-cormorant text-sm px-1.5 py-0.5 rounded-sm text-white shrink-0"
                          style={{ backgroundColor: vis?.cor ?? '#9a7b3f' }}
                        >
                          Hoje
                        </span>
                      )}
                    </div>
                    <p className="font-garamond italic text-terco-muted text-base leading-snug">
                      {vis?.tema ?? ''}
                    </p>
                    <p className="font-cormorant text-sm text-terco-muted/70 mt-1.5">
                      {vis?.dias ?? ''}
                    </p>
                  </div>

                  <span className="font-cormorant text-base text-parchment group-hover:text-gold transition-colors shrink-0">
                    →
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
