export function canGoNext(currentIndex: number, totalSteps: number): boolean {
  return currentIndex < totalSteps - 1
}

export function canGoPrev(currentIndex: number): boolean {
  return currentIndex > 0
}

export function nextIndex(currentIndex: number): number {
  return currentIndex + 1
}

export function prevIndex(currentIndex: number): number {
  return currentIndex - 1
}
