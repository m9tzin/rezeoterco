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
          initialIndex={etapaIndex}
          fontSize={fontSize}
          onFontChange={handleFontChange}
          onComplete={handleComplete}
          onStepChange={handleStepChange}
          onBack={handleBack}
        />
      )}
      {view === 'complete' && <CompletionScreen onRestart={handleRestart} />}
    </>
  )
}
