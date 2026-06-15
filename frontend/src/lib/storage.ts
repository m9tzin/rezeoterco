import type { Progress, Preferences } from '@/data/types'

const PROGRESS_KEY = 'terco-progress'
const PREFS_KEY = 'terco-preferences'

const DEFAULT_PREFERENCES: Preferences = { fontSize: 'normal' }

export function saveProgress(progress: Progress): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}

export function loadProgress(): Progress | null {
  const raw = localStorage.getItem(PROGRESS_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Progress
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
    return JSON.parse(raw) as Preferences
  } catch {
    return DEFAULT_PREFERENCES
  }
}
