import {
  saveProgress,
  loadProgress,
  clearProgress,
  savePreferences,
  loadPreferences,
} from '@/lib/storage'
import type { Progress, Preferences } from '@/data/types'

const mockProgress: Progress = {
  tipo: 'mariano',
  misterioId: 'gozosos',
  etapaIndex: 5,
}

const mockPrefs: Preferences = { fontSize: 'grande', progressLayout: 'terco' }

beforeEach(() => {
  localStorage.clear()
})

describe('progress storage', () => {
  it('saves and loads progress', () => {
    saveProgress(mockProgress)
    expect(loadProgress()).toEqual(mockProgress)
  })

  it('returns null when no progress saved', () => {
    expect(loadProgress()).toBeNull()
  })

  it('returns null when saved progress is not valid JSON', () => {
    localStorage.setItem('terco-progress', '{')
    expect(loadProgress()).toBeNull()
  })

  it('returns null when saved progress has an invalid shape', () => {
    localStorage.setItem(
      'terco-progress',
      JSON.stringify({ tipo: 'mariano', misterioId: 'gozosos', etapaIndex: -1 })
    )

    expect(loadProgress()).toBeNull()
  })

  it('clears saved progress', () => {
    saveProgress(mockProgress)
    clearProgress()
    expect(loadProgress()).toBeNull()
  })

  it('overwrites existing progress', () => {
    saveProgress(mockProgress)
    const updated: Progress = { ...mockProgress, etapaIndex: 20 }
    saveProgress(updated)
    expect(loadProgress()).toEqual(updated)
  })

  it('loads progress for novenas', () => {
    const updated: Progress = {
      tipo: 'novena',
      misterioId: 'santo-antonio',
      etapaIndex: 4,
    }

    saveProgress(updated)

    expect(loadProgress()).toEqual(updated)
  })

  it('loads progress for devotional rosary types', () => {
    const updated: Progress = {
      tipo: 'santas-chagas',
      misterioId: 'santas-chagas',
      etapaIndex: 12,
    }

    saveProgress(updated)

    expect(loadProgress()).toEqual(updated)
  })
})

describe('preferences storage', () => {
  it('saves and loads preferences', () => {
    savePreferences(mockPrefs)
    expect(loadPreferences()).toEqual(mockPrefs)
  })

  it('returns default preferences when nothing saved', () => {
    expect(loadPreferences()).toEqual({ fontSize: 'normal', progressLayout: 'linear' })
  })

  it('returns default preferences when saved preferences are invalid', () => {
    localStorage.setItem('terco-preferences', JSON.stringify({ fontSize: 'gigante' }))

    expect(loadPreferences()).toEqual({ fontSize: 'normal', progressLayout: 'linear' })
  })

  it('adds the default progress layout to older saved preferences', () => {
    localStorage.setItem('terco-preferences', JSON.stringify({ fontSize: 'grande' }))

    expect(loadPreferences()).toEqual({ fontSize: 'grande', progressLayout: 'linear' })
  })

  it('returns default preferences when saved progress layout is invalid', () => {
    localStorage.setItem(
      'terco-preferences',
      JSON.stringify({ fontSize: 'grande', progressLayout: 'grade' })
    )

    expect(loadPreferences()).toEqual({ fontSize: 'normal', progressLayout: 'linear' })
  })
})
