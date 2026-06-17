'use client'

import type { FontSize } from '@/data/types'

const SIZES: FontSize[] = ['normal', 'grande', 'muito-grande']

type Props = {
  fontSize: FontSize
  onChange: (size: FontSize) => void
}

export function FontControls({ fontSize, onChange }: Props) {
  const currentIndex = SIZES.indexOf(fontSize)

  function decrease() {
    if (currentIndex > 0) onChange(SIZES[currentIndex - 1])
  }

  function increase() {
    if (currentIndex < SIZES.length - 1) onChange(SIZES[currentIndex + 1])
  }

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
      <button
        onClick={increase}
        disabled={currentIndex === SIZES.length - 1}
        aria-label="Aumentar fonte"
        className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] text-[#6B7280] text-sm font-bold shadow-sm hover:border-[#8B7355] disabled:opacity-30 transition-colors"
      >
        A+
      </button>
      <button
        onClick={decrease}
        disabled={currentIndex === 0}
        aria-label="Diminuir fonte"
        className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] text-[#6B7280] text-xs font-bold shadow-sm hover:border-[#8B7355] disabled:opacity-30 transition-colors"
      >
        A−
      </button>
    </div>
  )
}
