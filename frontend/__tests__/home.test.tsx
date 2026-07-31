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

  it('starts the new devotional rosary types from the selection screen', async () => {
    render(<Home />)

    fireEvent.click(await screen.findByRole('button', { name: 'Terço da Libertação' }))

    expect(screen.getByText('Terço da Libertação')).toBeInTheDocument()
    expect(screen.getByText('Sinal da Cruz')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Próxima etapa' }))
    act(() => {
      jest.advanceTimersByTime(150)
    })

    expect(await screen.findByText('Credo')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Voltar ao início' }))
    fireEvent.click(screen.getByRole('button', { name: 'Terço das Santas Chagas' }))

    expect(screen.getByText('Terço das Santas Chagas')).toBeInTheDocument()
    expect(screen.getByText('Sinal da Cruz')).toBeInTheDocument()
  })
})
