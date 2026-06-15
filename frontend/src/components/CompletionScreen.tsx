'use client'

type Props = {
  onRestart: () => void
}

export function CompletionScreen({ onRestart }: Props) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 text-5xl select-none">✝</div>
      <h2 className="text-2xl font-serif text-[#1C1C1E] mb-3">
        Terço concluído
      </h2>
      <p className="text-[#6B7280] text-base mb-10 max-w-sm leading-relaxed">
        Que Nossa Senhora interceda por você e por todos os seus pedidos.
      </p>
      <button
        onClick={onRestart}
        className="w-full max-w-xs py-4 rounded-lg bg-[#8B7355] text-white font-medium text-lg hover:bg-[#7a6347] transition-colors"
      >
        Rezar outro terço
      </button>
    </div>
  )
}
