'use client'

type Props = {
  hasSavedProgress: boolean
  onStart: () => void
  onResume: () => void
  demoVideoUrl?: string
}

const DEMO_VIDEO_URL = process.env.NEXT_PUBLIC_DEMO_VIDEO_URL ?? ''

function normalizeVideoUrl(url: string): string {
  if (!url.includes('loom.com/share/')) return url

  return url.replace('loom.com/share/', 'loom.com/embed/').split('?')[0]
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
          <svg
            width="28"
            height="44"
            viewBox="0 0 28 44"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            className="text-gold mx-auto mb-6"
            aria-hidden="true"
          >
            <line x1="14" y1="1" x2="14" y2="43" />
            <line x1="2" y1="13" x2="26" y2="13" />
          </svg>

          <h1 className="font-cormorant font-semibold text-[2.75rem] leading-tight text-brown tracking-widest uppercase mb-3">
            Reze o Terço
          </h1>
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
              className="relative overflow-hidden border border-parchment bg-white rounded-sm px-5 py-5 shadow-[0_1px_8px_rgba(92,61,46,0.06)]"
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
