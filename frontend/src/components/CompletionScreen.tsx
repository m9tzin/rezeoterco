'use client'

type Props = {
  onRestart: () => void
}

export function CompletionScreen({ onRestart }: Props) {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 text-center pb-16">
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
      <h2 className="font-cormorant font-light text-3xl text-brown tracking-wide uppercase mb-3">
        Terço Concluído
      </h2>
      <p className="font-garamond italic text-terco-muted text-lg mb-10 max-w-sm leading-relaxed">
        &ldquo;Rezar o terço é pegar na mão de Maria e ir com ela ao encontro de Jesus.&rdquo;
      </p>
      <button
        onClick={onRestart}
        className="font-cormorant text-base tracking-wide px-8 py-3 bg-gold text-cream hover:bg-gold-dark transition-colors rounded-sm active:scale-[0.97]"
      >
        Rezar Novamente
      </button>
    </div>
  )
}
