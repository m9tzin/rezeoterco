'use client'

import { useState, useEffect } from 'react'
import type { TipoTerco, FontSize, Progress, ProgressLayout } from '@/data/types'
import { TERCOS } from '@/data/index'
import { saveProgress, loadProgress, clearProgress, savePreferences, loadPreferences } from '@/lib/storage'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { SelectionScreen } from '@/components/SelectionScreen'
import { PrayerScreen } from '@/components/PrayerScreen'
import { CompletionScreen } from '@/components/CompletionScreen'
import { DonationBanner } from '@/components/DonationBanner'

type View = 'welcome' | 'selection' | 'praying' | 'complete'

export default function Home() {
  const [view, setView] = useState<View>('selection')
  const [tipo, setTipo] = useState<TipoTerco>('mariano')
  const [misterioId, setMisterioId] = useState<string>('gozosos')
  const [etapaIndex, setEtapaIndex] = useState(0)
  const [fontSize, setFontSize] = useState<FontSize>('normal')
  const [progressLayout, setProgressLayout] = useState<ProgressLayout>('linear')
  const [savedProgress, setSavedProgress] = useState<Progress | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const progress = loadProgress()
    const prefs = loadPreferences()
    setSavedProgress(progress)
    setFontSize(prefs.fontSize)
    setProgressLayout(prefs.progressLayout)
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

  function handleStartSelection() {
    setView('selection')
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
    const progress: Progress = { tipo, misterioId, etapaIndex }
    saveProgress(progress)
    setSavedProgress(progress)
    setView('selection')
  }

  function handleFontChange(size: FontSize) {
    setFontSize(size)
    savePreferences({ fontSize: size, progressLayout })
  }

  function handleProgressLayoutChange(layout: ProgressLayout) {
    setProgressLayout(layout)
    savePreferences({ fontSize, progressLayout: layout })
  }

  if (!hydrated) return null

  const misterio = TERCOS[tipo].misterios.find((m) => m.id === misterioId)

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {view === 'welcome' && (
          <WelcomeScreen
            hasSavedProgress={Boolean(savedProgress)}
            onStart={handleStartSelection}
            onResume={handleResume}
            onShowWelcome={() => setView('welcome')}
          />
        )}
        {view === 'selection' && (
          <SelectionScreen
            savedProgress={savedProgress}
            progressLayout={progressLayout}
            onSelectMisterio={handleSelectMisterio}
            onResume={handleResume}
            onDismissProgress={handleDismissProgress}
            onProgressLayoutChange={handleProgressLayoutChange}
            onShowSelection={handleStartSelection}
            onShowWelcome={() => setView('welcome')}
          />
        )}
        {view === 'praying' && misterio && (
          <PrayerScreen
            misterio={misterio}
            tipo={tipo}
            initialIndex={etapaIndex}
            fontSize={fontSize}
            progressLayout={progressLayout}
            onFontChange={handleFontChange}
            onProgressLayoutChange={handleProgressLayoutChange}
            onComplete={handleComplete}
            onStepChange={handleStepChange}
            onBack={handleBack}
          />
        )}
        {view === 'complete' && <CompletionScreen onRestart={handleRestart} />}
      </main>

      <footer className="py-1 text-center border-t border-parchment/60">
        <p className="text-xs text-terco-muted/60 font-geist min-h-[36px] flex items-center justify-center gap-2">
          &copy; 2026{' '}
          <a
            href="https://matheusmrno.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brown transition-colors"
          >
            Matheus Marinho
          </a>
        </p>
      </footer>

      <DonationBanner raised={view === 'praying'} />
    </div>
  )
}
