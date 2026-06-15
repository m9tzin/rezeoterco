'use client'

import type { TipoTerco, Progress } from '@/data/types'
import { TERCOS, TERCO_LIST } from '@/data/index'

type Props = {
  savedProgress: Progress | null
  onSelectMisterio: (tipo: TipoTerco, misterioId: string) => void
  onResume: () => void
  onDismissProgress: () => void
}

export function SelectionScreen({
  savedProgress,
  onSelectMisterio,
  onResume,
  onDismissProgress,
}: Props) {
  const activeTipo: TipoTerco = savedProgress?.tipo ?? 'mariano'
  const activeTerco = TERCOS[activeTipo]

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center px-4 py-10">
      <h1 className="text-3xl font-serif text-[#1C1C1E] mb-2 tracking-tight">
        Terço
      </h1>
      <p className="text-[#6B7280] text-sm mb-8">Escolha o terço e o mistério</p>

      {/* Resume banner */}
      {savedProgress && (
        <div className="w-full max-w-lg mb-6 border border-[#8B7355] rounded-lg p-4 bg-amber-50">
          <p className="text-[#1C1C1E] text-sm mb-3">
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
              className="flex-1 py-2 bg-[#8B7355] text-white rounded-md text-sm font-medium hover:bg-[#7a6347] transition-colors"
            >
              Continuar
            </button>
            <button
              onClick={onDismissProgress}
              className="flex-1 py-2 border border-[#8B7355] text-[#8B7355] rounded-md text-sm font-medium hover:bg-[#FAF9F6] transition-colors"
            >
              Começar do zero
            </button>
          </div>
        </div>
      )}

      {/* Terço type selector */}
      <div className="w-full max-w-lg mb-6">
        <p className="text-xs text-[#6B7280] uppercase tracking-widest mb-2">
          Tipo de terço
        </p>
        <div className="flex gap-2 flex-wrap">
          {TERCO_LIST.map((terco) => (
            <button
              key={terco.id}
              onClick={() => {
                const firstMisterio = TERCOS[terco.id].misterios[0]
                onSelectMisterio(terco.id, firstMisterio.id)
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeTipo === terco.id
                  ? 'bg-[#8B7355] text-white border-[#8B7355]'
                  : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#8B7355]'
              }`}
            >
              {terco.nome}
            </button>
          ))}
        </div>
      </div>

      {/* Mystery list — only for Marian rosary */}
      {activeTipo === 'mariano' && (
        <div className="w-full max-w-lg">
          <p className="text-xs text-[#6B7280] uppercase tracking-widest mb-2">
            Escolha o mistério
          </p>
          <div className="flex flex-col gap-3">
            {activeTerco.misterios.map((misterio) => (
              <button
                key={misterio.id}
                onClick={() => onSelectMisterio('mariano', misterio.id)}
                className="w-full text-left px-5 py-4 rounded-lg border border-[#E5E7EB] bg-white hover:border-[#8B7355] hover:bg-amber-50 transition-colors"
              >
                <span className="text-[#1C1C1E] font-medium">{misterio.titulo}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
