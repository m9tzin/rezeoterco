import { act, fireEvent, render, screen } from '@testing-library/react'
import { DonationBanner } from '@/components/DonationBanner'

describe('DonationBanner', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-10-01T12:00:00-03:00'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('shows the desktop card and the compact mobile badge during the campaign', () => {
    render(<DonationBanner />)

    const triggers = screen.getAllByRole('button', {
      name: /aqui para ajudar no Dia das Crianças/,
    })
    expect(triggers).toHaveLength(2)
    expect(triggers[0]).toHaveClass('hidden', 'xl:block')
    expect(triggers[0]).toHaveTextContent('Clique aqui para ajudar no Dia das Crianças')
    expect(triggers[1]).toHaveTextContent('Toque aqui para ajudar no Dia das Crianças')
    expect(triggers[1]).toHaveClass('xl:hidden', 'bottom-4')
    for (const trigger of triggers) {
      expect(trigger.querySelector('[data-testid="donation-crayon-circle"] path')).toHaveAttribute(
        'stroke',
        '#3d9a40'
      )
    }
  })

  it('raises the mobile badge above the prayer navigation', () => {
    render(<DonationBanner raised />)

    const [, badge] = screen.getAllByRole('button', {
      name: /aqui para ajudar no Dia das Crianças/,
    })
    expect(badge).toHaveClass('bottom-24')
  })

  it('disappears after Dia das Crianças', () => {
    jest.setSystemTime(new Date('2026-10-13T00:00:00-03:00'))
    const { container } = render(<DonationBanner />)

    expect(container).toBeEmptyDOMElement()
  })

  it('opens the flyer popup and closes it with the button, Escape and the backdrop', () => {
    render(<DonationBanner />)
    const [trigger] = screen.getAllByRole('button', {
      name: /aqui para ajudar no Dia das Crianças/,
    })

    fireEvent.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Arrecadação Dia das Crianças' })
    expect(dialog).toContainElement(screen.getByRole('img'))
    expect(screen.getByRole('img')).toHaveAttribute('src', '/dia-das-criancas.jpg')
    expect(screen.getByRole('button', { name: 'Fechar' })).toHaveFocus()

    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()

    fireEvent.click(trigger)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.click(trigger)
    fireEvent.click(screen.getByRole('dialog'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('donation-backdrop'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('copies the PIX e-mail', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    render(<DonationBanner />)

    fireEvent.click(
      screen.getAllByRole('button', { name: /aqui para ajudar no Dia das Crianças/ })[0]
    )
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copiar' }))
    })

    expect(writeText).toHaveBeenCalledWith('joaoalvez916@gmail.com')
    expect(screen.getByRole('button', { name: 'Copiado' })).toBeInTheDocument()
  })
})
