import { canGoNext, canGoPrev, nextIndex, prevIndex } from '@/lib/navigation'

describe('navigation', () => {
  it('canGoNext returns true when not at last step', () => {
    expect(canGoNext(3, 10)).toBe(true)
  })

  it('canGoNext returns false at last step', () => {
    expect(canGoNext(9, 10)).toBe(false)
  })

  it('canGoPrev returns true when not at first step', () => {
    expect(canGoPrev(1)).toBe(true)
  })

  it('canGoPrev returns false at first step', () => {
    expect(canGoPrev(0)).toBe(false)
  })

  it('nextIndex increments by 1', () => {
    expect(nextIndex(3)).toBe(4)
  })

  it('prevIndex decrements by 1', () => {
    expect(prevIndex(3)).toBe(2)
  })
})
