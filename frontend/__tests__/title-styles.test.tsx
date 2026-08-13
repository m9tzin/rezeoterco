import { act, render, screen, within } from '@testing-library/react'
import { CompletionScreen } from '@/components/CompletionScreen'
import { PrayerScreen } from '@/components/PrayerScreen'
import { SelectionScreen } from '@/components/SelectionScreen'
import { marianoData } from '@/data/mariano'

beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('title typography', () => {
  function mockReducedMotion(reduce: boolean) {
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion') && reduce,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })) as unknown as typeof window.matchMedia
  }

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  it('uses larger semibold title styles on the selection screen', () => {
    render(
      <SelectionScreen
        savedProgress={null}
        progressLayout="linear"
        onSelectMisterio={jest.fn()}
        onResume={jest.fn()}
        onDismissProgress={jest.fn()}
        onProgressLayoutChange={jest.fn()}
        onShowWelcome={jest.fn()}
      />
    )

    expect(screen.getByRole('heading', { name: 'Reze o Terço' })).toHaveClass(
      'font-semibold',
      'text-[2.75rem]'
    )

    const misterioButton = screen.getByRole('button', { name: /Mistérios Gozosos/ })
    expect(within(misterioButton).getByText('Mistérios Gozosos')).toHaveClass(
      'font-semibold',
      'text-2xl'
    )

    expect(within(screen.getByRole('button', { name: 'Como rezar' })).getByText('?')).toHaveClass(
      'text-gold'
    )
  })

  it('animates the selection title without changing its accessible name', () => {
    mockReducedMotion(false)
    jest.useFakeTimers()

    render(
      <SelectionScreen
        savedProgress={null}
        progressLayout="linear"
        onSelectMisterio={jest.fn()}
        onResume={jest.fn()}
        onDismissProgress={jest.fn()}
        onProgressLayoutChange={jest.fn()}
        onShowWelcome={jest.fn()}
      />
    )

    const heading = screen.getByRole('heading', { name: 'Reze o Terço' })
    expect(heading).toHaveTextContent('Reze o Terço')
    expect(screen.getByTestId('selection-title-caret')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(2400)
    })
    for (let step = 0; step < 4; step++) {
      act(() => {
        jest.advanceTimersByTime(55)
      })
    }

    expect(heading).not.toHaveTextContent('Reze o Terço')
    expect(screen.getByRole('heading', { name: 'Reze o Terço' })).toBe(heading)
  })

  it('uses larger semibold title styles while praying', () => {
    render(
      <PrayerScreen
        misterio={marianoData.misterios[0]}
        tipo="mariano"
        initialIndex={0}
        fontSize="normal"
        progressLayout="linear"
        onFontChange={jest.fn()}
        onProgressLayoutChange={jest.fn()}
        onComplete={jest.fn()}
        onStepChange={jest.fn()}
        onBack={jest.fn()}
      />
    )

    expect(screen.getByText('Mistérios Gozosos')).toHaveClass(
      'font-semibold',
      'text-lg'
    )
    expect(screen.getByText('Credo')).toHaveClass('font-semibold', 'text-base')
  })

  it('uses larger semibold title styles on the completion screen', () => {
    render(<CompletionScreen onRestart={jest.fn()} />)

    expect(screen.getByRole('heading', { name: 'Terço Concluído' })).toHaveClass(
      'font-semibold',
      'text-[2.75rem]'
    )
  })
})
