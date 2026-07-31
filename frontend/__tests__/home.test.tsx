import { act, fireEvent, render, screen } from '@testing-library/react'
import Home from '@/app/page'

beforeEach(() => {
  localStorage.clear()
  jest.useFakeTimers()
  window.HTMLElement.prototype.scrollIntoView = jest.fn()
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
  jest.restoreAllMocks()
})

describe('Home prayer flow', () => {
  it('preserves current progress when returning to the selection screen', async () => {
    render(<Home />)

    fireEvent.click(await screen.findByRole('button', { name: /Mistérios Gozosos/ }))
    expect(screen.getByText('Credo')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Próxima etapa' }))
    act(() => {
      jest.advanceTimersByTime(150)
    })

    expect(await screen.findByText('Pai Nosso')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Voltar ao início' }))

    expect(screen.getByRole('button', { name: 'Continuar' })).toBeInTheDocument()
    expect(screen.getByText(/etapa 2\./)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(screen.getByText('Pai Nosso')).toBeInTheDocument()
    expect(screen.queryByText('Credo')).not.toBeInTheDocument()
  })

  it('returns to the main menu from the completed prayer screen', async () => {
    localStorage.setItem(
      'terco-progress',
      JSON.stringify({ tipo: 'mariano', misterioId: 'gozosos', etapaIndex: 76 })
    )

    render(<Home />)

    fireEvent.click(await screen.findByRole('button', { name: 'Continuar' }))

    expect(screen.getByText('Salve Rainha')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Finalizar terço' }))

    expect(screen.getByRole('heading', { name: 'Terço Concluído' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Menu Principal' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Menu Principal' }))

    expect(screen.getByRole('heading', { name: 'Reze o Terço' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Mistérios Gozosos/ })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Terço Concluído' })).not.toBeInTheDocument()
  })
})
