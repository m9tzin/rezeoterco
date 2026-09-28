'use client'

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react'

// A campanha termina no Dia das Crianças; no dia 13/10 o banner some sozinho.
const CAMPAIGN_END = new Date('2026-10-13T00:00:00-03:00')
const PIX_EMAIL = 'joaoalvez916@gmail.com'

function isCampaignActive() {
  return Date.now() < CAMPAIGN_END.getTime()
}

type OpenDonation = (trigger: HTMLElement) => void

const DonationContext = createContext<OpenDonation | null>(null)

const CRAYON_GREEN = '#3d9a40'

/** Textura de giz de cera: bordas irregulares e falhas no traço, como nos gizes do flyer. */
function CrayonFilter({ id }: { id: string }) {
  return (
    <filter id={id} filterUnits="userSpaceOnUse" x="-40" y="-40" width="320" height="200">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" result="rough" />
      <feColorMatrix
        in="noise"
        type="matrix"
        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.3 1.5"
        result="grain"
      />
      <feComposite in="rough" in2="grain" operator="in" />
    </filter>
  )
}

function Ajude({ children }: { children: string }) {
  const filterId = useId()
  return (
    <span className="relative inline-block">
      <svg
        aria-hidden="true"
        viewBox="0 0 100 24"
        preserveAspectRatio="none"
        className="absolute -inset-x-1 top-[58%] h-[1em] w-[calc(100%+0.5rem)] -translate-y-1/2 overflow-visible"
      >
        <defs>
          <CrayonFilter id={filterId} />
        </defs>
        <path
          d="M3 14 C 22 9, 45 16, 62 11 S 88 10, 97 13"
          pathLength={1}
          fill="none"
          stroke={CRAYON_GREEN}
          strokeOpacity="0.55"
          strokeWidth="20"
          strokeLinecap="round"
          filter={`url(#${filterId})`}
          className="donation-highlight"
        />
      </svg>
      <strong className="relative font-semibold text-brown">{children}</strong>
    </span>
  )
}

// Volta de giz de cera ao redor do aviso; termina passando do ponto inicial, como feito à mão.
const CRAYON_CIRCLES = {
  card: {
    viewBox: '0 0 240 120',
    d: 'M34 10 C96 0, 196 2, 228 20 C244 32, 242 94, 216 110 C170 122, 56 122, 16 110 C-2 98, -2 30, 22 14 C40 4, 72 3, 100 5',
  },
  nav: {
    viewBox: '0 0 200 40',
    d: 'M24 5 C80 0, 160 1, 188 8 C200 14, 198 30, 180 36 C140 42, 50 41, 16 35 C0 29, 2 11, 20 6 C34 3, 56 2, 76 3',
  },
  pill: {
    viewBox: '0 0 200 50',
    d: 'M26 6 C80 0, 160 1, 188 10 C200 18, 198 38, 180 45 C140 52, 50 51, 16 43 C0 36, 2 14, 20 8 C34 4, 56 3, 76 4',
  },
}

// Tamanho explícito: um SVG absoluto sem altura mantém a proporção do viewBox e não acompanha o texto.
const CIRCLE_INSETS: Record<keyof typeof CRAYON_CIRCLES, string> = {
  card: '-left-5 -top-5 w-[calc(100%+2.5rem)] h-[calc(100%+2.5rem)]',
  nav: '-left-2 -top-1.5 w-[calc(100%+1rem)] h-[calc(100%+0.75rem)]',
  pill: '-left-2.5 -top-2 w-[calc(100%+1.25rem)] h-[calc(100%+1rem)]',
}

function CrayonCircle({ variant }: { variant: keyof typeof CRAYON_CIRCLES }) {
  const { viewBox, d } = CRAYON_CIRCLES[variant]
  const filterId = useId()
  return (
    <svg
      aria-hidden="true"
      data-testid="donation-crayon-circle"
      viewBox={viewBox}
      preserveAspectRatio="none"
      className={`pointer-events-none absolute overflow-visible ${
        CIRCLE_INSETS[variant]
      }`}
    >
      <defs>
        <CrayonFilter id={filterId} />
      </defs>
      <path
        d={d}
        pathLength={1}
        fill="none"
        stroke={CRAYON_GREEN}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${filterId})`}
        className="donation-pen"
      />
    </svg>
  )
}

/**
 * Guarda o popup do flyer e deixa qualquer botão da página abri-lo,
 * como o atalho do Dia das Crianças na barra de navegação.
 */
export function DonationProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  function handleOpen(trigger: HTMLElement) {
    triggerRef.current = trigger
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
    triggerRef.current?.focus()
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(PIX_EMAIL)
      setCopied(true)
    } catch {
      // Sem permissão de área de transferência: o e-mail continua visível para copiar à mão.
    }
  }

  return (
    <DonationContext.Provider value={isCampaignActive() ? handleOpen : null}>
      {children}
      {open && (
        <div
          data-testid="donation-backdrop"
          onClick={(event) => event.target === event.currentTarget && handleClose()}
          className="fixed inset-0 z-50 flex items-center justify-center bg-terco-text/60 p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Arrecadação Dia das Crianças"
            className="relative flex max-h-full flex-col items-center rounded-sm bg-cream p-3 shadow-[0_8px_32px_rgba(46,31,16,0.35)]"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={handleClose}
              aria-label="Fechar"
              className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full border border-gold/50 bg-cream font-geist text-lg text-brown shadow-[0_2px_8px_rgba(46,31,16,0.2)]"
            >
              ×
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/dia-das-criancas.jpg"
              alt={`Flyer da arrecadação do Dia das Crianças do Segue-me (Nerópolis - GO), com QR code para contribuir e o e-mail ${PIX_EMAIL}`}
              className="max-h-[calc(100vh-10rem)] w-auto rounded-sm"
            />
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-center">
              <p className="font-geist text-sm text-terco-muted">
                Chave PIX (e-mail): <span className="text-brown">{PIX_EMAIL}</span>
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className="font-geist text-sm min-h-[32px] px-3 border border-gold/60 text-brown rounded-sm transition-colors [@media(hover:hover)]:hover:bg-parchment"
              >
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DonationContext.Provider>
  )
}

type BannerProps = {
  /** Mostra o selo flutuante no celular, nas telas que não têm a barra de navegação. */
  showMobileBadge?: boolean
  /** Sobe o selo móvel para não cobrir a navegação fixa da tela de oração. */
  raised?: boolean
}

export function DonationBanner({ showMobileBadge = false, raised = false }: BannerProps) {
  const openDonation = useContext(DonationContext)
  if (!openDonation) return null

  return (
    <>
      {/* Desktop: aviso solto na margem lateral direita */}
      <button
        type="button"
        onClick={(event) => openDonation(event.currentTarget)}
        className="hidden xl:block fixed right-6 top-28 z-20 w-52 text-left px-4 py-3 transition-transform duration-200 motion-safe:ease-out [@media(hover:hover)]:hover:-translate-y-0.5"
      >
        <CrayonCircle variant="card" />
        <span className="block font-geist text-[15px] font-medium leading-snug text-terco-text">
          Clique aqui para <Ajude>ajudar</Ajude> no Dia das Crianças
        </span>
        <span className="mt-1.5 block font-geist text-[13px] leading-snug text-terco-muted">
          Arrecadação do Segue-me até 12 de outubro →
        </span>
      </button>

      {/* Celular/tablet sem barra de navegação: selo compacto */}
      {showMobileBadge && (
        <button
          type="button"
          onClick={(event) => openDonation(event.currentTarget)}
          className={`xl:hidden fixed right-4 z-20 rounded-full px-3 min-h-[36px] bg-cream/90 font-geist text-xs text-terco-text transition-all duration-200 active:scale-[0.97] ${
            raised ? 'bottom-24' : 'bottom-4'
          }`}
        >
          <CrayonCircle variant="pill" />
          Toque aqui para <Ajude>ajudar</Ajude> no Dia das Crianças
        </button>
      )}
    </>
  )
}

/** Atalho do Dia das Crianças na barra de navegação, só no celular/tablet. */
export function DonationNavButton() {
  const openDonation = useContext(DonationContext)
  if (!openDonation) return null

  return (
    <button
      type="button"
      onClick={(event) => openDonation(event.currentTarget)}
      className="xl:hidden mr-auto min-h-[44px] px-1 inline-flex items-center whitespace-nowrap font-geist text-[11px] leading-tight sm:text-xs text-terco-text active:scale-[0.97] transition-transform"
    >
      {/* No celular o texto quebra em duas linhas para caber ao lado de Menu e Como rezar */}
      <span className="relative inline-block px-1 py-0.5 text-center sm:px-1 sm:py-1">
        <CrayonCircle variant="nav" />
        <span className="block sm:inline">
          Clique aqui e <Ajude>ajude</Ajude>
        </span>{' '}
        <span className="block sm:inline">no Dia das Crianças!</span>
      </span>
    </button>
  )
}
