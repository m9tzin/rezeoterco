'use client'

type Props = {
  onRestart: () => void
}

export function CompletionScreen({ onRestart }: Props) {
  return (
    <div className="bg-cream flex flex-col items-center justify-center px-6 text-center py-16">
      {/* Decorative ornament */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px w-12 bg-gold/40" aria-hidden="true" />
        <span className="text-gold/60 text-sm tracking-[0.5em]" aria-hidden="true">✦</span>
        <div className="h-px w-12 bg-gold/40" aria-hidden="true" />
      </div>

      {/* Cross */}
      <svg
        width="28"
        height="44"
        viewBox="0 0 28 44"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        className="text-gold mb-7"
        aria-hidden="true"
      >
        <line x1="14" y1="1" x2="14" y2="43" />
        <line x1="2" y1="13" x2="26" y2="13" />
      </svg>

      <h2 className="font-cormorant font-semibold text-[2.75rem] leading-tight text-brown tracking-widest uppercase mb-2">
        Terço Concluído
      </h2>
      <p className="font-cormorant text-gold text-base tracking-[0.2em] mb-10">
        Com fé e devoção
      </p>

      {/* Quote card */}
      <div className="max-w-sm w-full border border-parchment rounded-sm px-6 py-6 bg-white shadow-[0_2px_16px_rgba(92,61,46,0.07)] mb-10">
        <span className="font-cormorant text-4xl text-gold/40 leading-none block mb-2" aria-hidden="true">&ldquo;</span>
        <p className="font-garamond italic text-terco-muted text-lg leading-relaxed">
          Rezar o terço é pegar na mão de Maria e ir com ela ao encontro de Jesus.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button
          onClick={onRestart}
          className="font-cormorant text-base tracking-widest uppercase px-10 min-h-[52px] bg-brown text-cream hover:bg-brown-dark transition-colors rounded-sm active:scale-[0.97] shadow-[0_2px_12px_rgba(92,61,46,0.2)]"
        >
          Menu Principal
        </button>
        <button
          onClick={onRestart}
          className="font-cormorant text-base tracking-widest uppercase px-10 min-h-[52px] border border-gold/60 text-brown hover:bg-parchment transition-colors rounded-sm active:scale-[0.97]"
        >
          Rezar Novamente
        </button>
      </div>
    </div>
  )
}
