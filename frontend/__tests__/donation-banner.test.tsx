import { act, fireEvent, render, screen } from '@testing-library/react'
import { DonationBanner, DonationNavButton, DonationProvider } from '@/components/DonationBanner'
import { TopNav } from '@/components/TopNav'

const TRIGGER = /ajudar no Dia das Crianças/

function renderBanner(props: Parameters<typeof DonationBanner>[0] = {}) {
  return render(
    <DonationProvider>
      <DonationBanner {...props} />
    </DonationProvider>
  )
}

describe('DonationBanner', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-10-01T12:00:00-03:00'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('shows only the desktop card by default', () => {
    renderBanner()

    const [card] = screen.getAllByRole('button', { name: TRIGGER })
    expect(screen.getAllByRole('button', { name: TRIGGER })).toHaveLength(1)
    expect(card).toHaveClass('hidden', 'xl:block')
    expect(card).toHaveTextContent('Clique aqui para ajudar no Dia das Crianças')
    expect(card.querySelector('[data-testid="donation-crayon-circle"] path')).toHaveAttribute(
      'stroke',
      '#3d9a40'
    )
  })

  it('adds the mobile badge, raised above the prayer navigation', () => {
    renderBanner({ showMobileBadge: true, raised: true })

    const [, badge] = screen.getAllByRole('button', { name: TRIGGER })
    expect(badge).toHaveClass('xl:hidden', 'bottom-24')
    expect(badge).toHaveTextContent('Toque aqui para ajudar no Dia das Crianças')
  })

  it('disappears after Dia das Crianças', () => {
    jest.setSystemTime(new Date('2026-10-13T00:00:00-03:00'))
    render(
      <DonationProvider>
        <DonationBanner showMobileBadge />
        <DonationNavButton />
      </DonationProvider>
    )

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('opens the flyer popup and closes it with the button, Escape and the backdrop', () => {
    renderBanner()
    const [trigger] = screen.getAllByRole('button', { name: TRIGGER })

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
    renderBanner()

    fireEvent.click(screen.getAllByRole('button', { name: TRIGGER })[0])
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copiar' }))
    })

    expect(writeText).toHaveBeenCalledWith('joaoalvez916@gmail.com')
    expect(screen.getByRole('button', { name: 'Copiado' })).toBeInTheDocument()
  })

  it('puts a circled mobile shortcut in the top navigation that opens the popup', () => {
    render(
      <DonationProvider>
        <TopNav onShowSelection={jest.fn()} onShowWelcome={jest.fn()} />
      </DonationProvider>
    )

    const shortcut = screen.getByRole('button', { name: 'Clique aqui e ajude no Dia das Crianças!' })
    expect(screen.getByRole('navigation', { name: 'Navegação principal' })).toContainElement(
      shortcut
    )
    expect(shortcut).toHaveClass('xl:hidden', 'min-h-[44px]')
    expect(shortcut.querySelector('[data-testid="donation-crayon-circle"]')).toBeInTheDocument()

    fireEvent.click(shortcut)
    expect(screen.getByRole('dialog', { name: 'Arrecadação Dia das Crianças' })).toBeInTheDocument()
  })
})
