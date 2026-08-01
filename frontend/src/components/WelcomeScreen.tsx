'use client'

import { useEffect, useState } from 'react'

type Props = {
  hasSavedProgress: boolean
  onStart: () => void
  onResume: () => void
  demoVideoUrl?: string
}

const DEMO_VIDEO_URL = process.env.NEXT_PUBLIC_DEMO_VIDEO_URL ?? ''

const TITLE = 'Reze o Terço'
const TYPE_MS = 130
const DELETE_MS = 55
const HOLD_FULL_MS = 2400
const HOLD_EMPTY_MS = 700

function normalizeVideoUrl(url: string): string {
  if (!url.includes('loom.com/share/')) return url

  return url.replace('loom.com/share/', 'loom.com/embed/').split('?')[0]
}

/**
 * Types the title out, holds it, erases it and starts over.
 *
 * The heading renders complete on the server and on first paint, and only starts
 * cycling once mounted — so there is no flash of empty heading, and readers that
 * never run the effect still see the whole title. The accessible name is pinned
 * with `aria-label`, so assistive tech announces the full title at any point in
 * the cycle rather than whatever fragment is on screen.
 */
function TypewriterTitle() {
  const [animated, setAnimated] = useState(false)
  const [count, setCount] = useState(TITLE.length)
  const [erasing, setErasing] = useState(false)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return

    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setAnimated(!query.matches)

    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!animated) {
      setCount(TITLE.length)
      setErasing(false)
      return
    }

    const done = erasing ? count === 0 : count === TITLE.length
    const delay = done
      ? erasing
        ? HOLD_EMPTY_MS
        : HOLD_FULL_MS
      : erasing
        ? DELETE_MS
        : TYPE_MS

    const timer = setTimeout(() => {
      if (done) setErasing(!erasing)
      else setCount(erasing ? count - 1 : count + 1)
    }, delay)

    return () => clearTimeout(timer)
  }, [animated, count, erasing])

  return (
    <h1
      aria-label={TITLE}
      className="font-cormorant font-semibold text-[2.75rem] leading-tight text-brown tracking-widest uppercase mb-3"
    >
      <span aria-hidden="true">{TITLE.slice(0, count)}</span>
      {animated && (
        <span
          aria-hidden="true"
          data-testid="welcome-title-caret"
          className="ml-1 inline-block h-[0.8em] w-[3px] translate-y-[0.06em] bg-gold/70 animate-pulse"
        />
      )}
    </h1>
  )
}

export function WelcomeScreen({
  hasSavedProgress,
  onStart,
  onResume,
  demoVideoUrl = DEMO_VIDEO_URL,
}: Props) {
  const videoUrl = normalizeVideoUrl(demoVideoUrl.trim())

  return (
    <div className="bg-cream flex flex-col items-center px-4 pb-10">
      <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl pt-10 pb-7">
        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={onStart}
            className="font-cormorant text-base text-terco-muted hover:text-brown transition-colors min-h-[44px] px-3"
          >
            Menu
          </button>
        </div>

        <div className="text-center">
          {/* Rosary hanging from its loop: tilted ring of beads, medal at the
              base, short pendant down to the cross. */}
          <svg
            width="36"
            height="61"
            viewBox="7.8 3.8 31.01 52.16"
            className="text-gold mx-auto mb-6"
            data-testid="welcome-logo"
            aria-hidden="true"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="0.75"
              strokeLinejoin="round"
              strokeLinecap="round"
            >
              <polygon points="20.56,28.55 14.53,27.09 10.45,22.44 10.52,16.27 14.00,11.05 19.28,7.68 25.40,6.45 31.47,7.91 35.55,12.56 35.48,18.73 32.00,23.95 26.72,27.32" />
              <polyline points="20.56,28.55 20.56,32.45 20.56,36.35 20.56,40.25 20.56,43.35" />
            </g>
            <g fill="currentColor">
              <circle cx="20.56" cy="28.55" r="2.8" />
              <circle cx="14.53" cy="27.09" r="1.45" />
              <circle cx="10.45" cy="22.44" r="1.45" />
              <circle cx="10.52" cy="16.27" r="1.45" />
              <circle cx="14.00" cy="11.05" r="2.05" />
              <circle cx="19.28" cy="7.68" r="1.45" />
              <circle cx="25.40" cy="6.45" r="1.45" />
              <circle cx="31.47" cy="7.91" r="1.45" />
              <circle cx="35.55" cy="12.56" r="2.05" />
              <circle cx="35.48" cy="18.73" r="1.45" />
              <circle cx="32.00" cy="23.95" r="1.45" />
              <circle cx="26.72" cy="27.32" r="1.45" />
              <circle cx="20.56" cy="32.45" r="1.2" />
              <circle cx="20.56" cy="36.35" r="1.2" />
              <circle cx="20.56" cy="40.25" r="1.7" />
              <rect x="19.46" y="43.35" width="2.2" height="11.4" rx="0.5" />
              <rect x="16.56" y="46.75" width="8" height="2.2" rx="0.5" />
            </g>
          </svg>

          <TypewriterTitle />
          <p className="font-garamond italic text-terco-muted text-lg leading-relaxed max-w-xl mx-auto">
            Um guia simples para acompanhar cada oração, mistério e conta com calma.
          </p>
        </div>
      </div>

      <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl mb-8">
        {videoUrl ? (
          <div className="aspect-video w-full overflow-hidden rounded-sm border border-parchment bg-white shadow-[0_2px_16px_rgba(92,61,46,0.07)]">
            <iframe
              src={videoUrl}
              title="Vídeo demonstrativo: como rezar o terço"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        ) : (
          <div className="aspect-video w-full rounded-sm border border-dashed border-gold/50 bg-[#faf8f3] flex flex-col items-center justify-center px-6 text-center">
            <p className="font-cormorant font-semibold text-brown text-xl mb-2">
              Vídeo demonstrativo em breve
            </p>
            <p className="font-garamond text-terco-muted text-base leading-relaxed max-w-md">
              Quando o Loom estiver pronto, ele aparecerá aqui para mostrar o fluxo antes da
              oração.
            </p>
          </div>
        )}
      </div>

      <section className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl mb-9">
        <h2 className="font-cormorant font-semibold text-brown text-2xl mb-4">
          Como rezar em poucos passos
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ['1', 'Escolha a devoção', 'Selecione o terço ou a novena que deseja acompanhar.'],
            ['2', 'Reze etapa por etapa', 'Avance pelas orações na ordem, sem precisar decorar.'],
            ['3', 'Retome depois', 'O app salva seu progresso se você precisar parar.'],
          ].map(([number, title, text]) => (
            <div
              key={number}
              className="relative overflow-hidden border border-parchment bg-white rounded-sm px-5 py-5 shadow-[0_1px_8px_rgba(92,61,46,0.06)] transition-all duration-200 motion-safe:ease-out [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:border-gold/40 [@media(hover:hover)]:hover:shadow-[0_6px_18px_rgba(92,61,46,0.1)]"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gold/50" aria-hidden="true" />
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-parchment/70 font-cormorant font-semibold text-brown text-lg">
                  {number}
                </span>
                <span className="font-cormorant text-gold text-sm tracking-[0.2em]">
                  PASSO
                </span>
              </div>
              <h3 className="font-cormorant font-semibold text-brown text-2xl leading-snug mb-2">
                {title}
              </h3>
              <div className="w-8 h-px bg-gold/30 mb-3" aria-hidden="true" />
              <p className="font-garamond text-terco-muted text-base leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl flex flex-col gap-3">
        {hasSavedProgress && (
          <button
            type="button"
            onClick={onResume}
            className="font-cormorant text-base tracking-widest uppercase px-10 min-h-[52px] border border-gold/60 text-brown hover:bg-parchment transition-colors rounded-sm active:scale-[0.97]"
          >
            Continuar oração salva
          </button>
        )}
        <button
          type="button"
          onClick={onStart}
          className="font-cormorant text-base tracking-widest uppercase px-10 min-h-[52px] bg-brown text-cream hover:bg-brown-dark transition-colors rounded-sm active:scale-[0.97] shadow-[0_2px_12px_rgba(92,61,46,0.2)]"
        >
          Vamos rezar o terço?
        </button>
      </div>
    </div>
  )
}
