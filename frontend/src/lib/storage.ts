import type { Progress, Preferences } from '@/data/types'

const PROGRESS_KEY = 'terco-progress'
const PREFS_KEY = 'terco-preferences'

const DEFAULT_PREFERENCES: Preferences = { fontSize: 'normal', progressLayout: 'linear' }
const TERCO_IDS = new Set([
  'mariano',
  'misericordia',
  'libertacao',
  'santas-chagas',
  'novena',
])
const FONT_SIZES = new Set(['normal', 'grande', 'muito-grande'])
const PROGRESS_LAYOUTS = new Set(['linear', 'terco'])

function isProgress(value: unknown): value is Progress {
  if (!value || typeof value !== 'object') return false

  const progress = value as Record<string, unknown>
  return (
    typeof progress.tipo === 'string' &&
    TERCO_IDS.has(progress.tipo) &&
    typeof progress.misterioId === 'string' &&
    progress.misterioId.length > 0 &&
    typeof progress.etapaIndex === 'number' &&
    Number.isInteger(progress.etapaIndex) &&
    progress.etapaIndex >= 0
  )
}

function isPreferences(value: unknown): value is Preferences {
  if (!value || typeof value !== 'object') return false

  const prefs = value as Record<string, unknown>
  return (
    typeof prefs.fontSize === 'string' &&
    FONT_SIZES.has(prefs.fontSize) &&
    (prefs.progressLayout === undefined ||
      (typeof prefs.progressLayout === 'string' && PROGRESS_LAYOUTS.has(prefs.progressLayout)))
  )
}

function normalizePreferences(value: Record<string, unknown>): Preferences {
  return {
    fontSize:
      typeof value.fontSize === 'string' && FONT_SIZES.has(value.fontSize)
        ? (value.fontSize as Preferences['fontSize'])
        : DEFAULT_PREFERENCES.fontSize,
    progressLayout:
      typeof value.progressLayout === 'string' && PROGRESS_LAYOUTS.has(value.progressLayout)
        ? (value.progressLayout as Preferences['progressLayout'])
        : DEFAULT_PREFERENCES.progressLayout,
  }
}

export function saveProgress(progress: Progress): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}

export function loadProgress(): Progress | null {
  const raw = localStorage.getItem(PROGRESS_KEY)
  if (!raw) return null
  try {
    const progress = JSON.parse(raw)
    return isProgress(progress) ? progress : null
  } catch {
    return null
  }
}

export function clearProgress(): void {
  localStorage.removeItem(PROGRESS_KEY)
}

export function savePreferences(prefs: Preferences): void {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
}

export function loadPreferences(): Preferences {
  const raw = localStorage.getItem(PREFS_KEY)
  if (!raw) return DEFAULT_PREFERENCES
  try {
    const prefs = JSON.parse(raw)
    return isPreferences(prefs)
      ? normalizePreferences(prefs as Record<string, unknown>)
      : DEFAULT_PREFERENCES
  } catch {
    return DEFAULT_PREFERENCES
  }
}
