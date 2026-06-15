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

const mockPrefs: Preferences = { fontSize: 'grande' }

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
})

describe('preferences storage', () => {
  it('saves and loads preferences', () => {
    savePreferences(mockPrefs)
    expect(loadPreferences()).toEqual(mockPrefs)
  })

  it('returns default preferences when nothing saved', () => {
    expect(loadPreferences()).toEqual({ fontSize: 'normal' })
  })
})
