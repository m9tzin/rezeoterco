import { fireEvent, render, screen } from '@testing-library/react'
import { TopNav } from '@/components/TopNav'

describe('TopNav', () => {
  it('groups both navigation links with their icons and handlers', () => {
    const onShowSelection = jest.fn()
    const onShowWelcome = jest.fn()

    render(<TopNav onShowSelection={onShowSelection} onShowWelcome={onShowWelcome} />)

    const nav = screen.getByRole('navigation', { name: 'Navegação principal' })
    const menu = screen.getByRole('button', { name: 'Menu' })
    const howToPray = screen.getByRole('button', { name: 'Como rezar' })

    expect(nav).toContainElement(menu)
    expect(nav).toContainElement(howToPray)
    expect(screen.getByTestId('rosary-logo')).toBeInTheDocument()
    expect(howToPray).toHaveTextContent('?')

    fireEvent.click(menu)
    fireEvent.click(howToPray)

    expect(onShowSelection).toHaveBeenCalledTimes(1)
    expect(onShowWelcome).toHaveBeenCalledTimes(1)
  })

  it('keeps both links accessible touch targets with hover motion', () => {
    render(<TopNav onShowSelection={jest.fn()} onShowWelcome={jest.fn()} />)

    for (const button of [
      screen.getByRole('button', { name: 'Menu' }),
      screen.getByRole('button', { name: 'Como rezar' }),
    ]) {
      expect(button).toHaveClass(
        'min-h-[44px]',
        'transition-all',
        'duration-200',
        '[@media(hover:hover)]:hover:-translate-y-0.5'
      )
    }
  })
})
