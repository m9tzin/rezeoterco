import { render, screen, within } from '@testing-library/react'
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
