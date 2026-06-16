'use client'

import { useState, useEffect } from 'react'
import type { TipoTerco, FontSize, Progress } from '@/data/types'
import { TERCOS } from '@/data/index'
import { saveProgress, loadProgress, clearProgress, savePreferences, loadPreferences } from '@/lib/storage'
import { SelectionScreen } from '@/components/SelectionScreen'
import { PrayerScreen } from '@/components/PrayerScreen'
import { CompletionScreen } from '@/components/CompletionScreen'

type View = 'selection' | 'praying' | 'complete'

export default function Home() {
  const [view, setView] = useState<View>('selection')
  const [tipo, setTipo] = useState<TipoTerco>('mariano')
  const [misterioId, setMisterioId] = useState<string>('gozosos')
  const [etapaIndex, setEtapaIndex] = useState(0)
  const [fontSize, setFontSize] = useState<FontSize>('normal')
  const [savedProgress, setSavedProgress] = useState<Progress | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const progress = loadProgress()
    const prefs = loadPreferences()
    setSavedProgress(progress)
    setFontSize(prefs.fontSize)
    setHydrated(true)
  }, [])

  function handleSelectMisterio(selectedTipo: TipoTerco, selectedMisterioId: string) {
    setTipo(selectedTipo)
    setMisterioId(selectedMisterioId)
    setEtapaIndex(0)
    const progress: Progress = { tipo: selectedTipo, misterioId: selectedMisterioId, etapaIndex: 0 }
    saveProgress(progress)
    setSavedProgress(null)
    setView('praying')
  }

  function handleResume() {
    if (!savedProgress) return
    setTipo(savedProgress.tipo)
    setMisterioId(savedProgress.misterioId)
    setEtapaIndex(savedProgress.etapaIndex)
    setSavedProgress(null)
    setView('praying')
  }

  function handleDismissProgress() {
    clearProgress()
    setSavedProgress(null)
  }

  function handleStepChange(index: number) {
    setEtapaIndex(index)
    saveProgress({ tipo, misterioId, etapaIndex: index })
  }

  function handleComplete() {
    clearProgress()
    setSavedProgress(null)
    setView('complete')
  }

  function handleRestart() {
    setEtapaIndex(0)
    setView('selection')
  }

  function handleBack() {
    setView('selection')
  }

  function handleFontChange(size: FontSize) {
    setFontSize(size)
    savePreferences({ fontSize: size })
  }

  if (!hydrated) return null

  const misterio = TERCOS[tipo].misterios.find((m) => m.id === misterioId)

  return (
    <>
      {view === 'selection' && (
        <SelectionScreen
          savedProgress={savedProgress}
          onSelectMisterio={handleSelectMisterio}
          onResume={handleResume}
          onDismissProgress={handleDismissProgress}
        />
      )}
      {view === 'praying' && misterio && (
        <PrayerScreen
          misterio={misterio}
          tipo={tipo}
          initialIndex={etapaIndex}
          fontSize={fontSize}
          onFontChange={handleFontChange}
          onComplete={handleComplete}
          onStepChange={handleStepChange}
          onBack={handleBack}
        />
      )}
      {view === 'complete' && <CompletionScreen onRestart={handleRestart} />}

      <footer className="fixed bottom-0 left-0 right-0 py-2 text-center bg-cream/80 backdrop-blur-sm border-t border-parchment">
        <a
          href="https://github.com/m9tzin"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-terco-muted hover:text-brown transition-colors font-geist"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          github.com/m9tzin
        </a>
      </footer>
    </>
  )
}
