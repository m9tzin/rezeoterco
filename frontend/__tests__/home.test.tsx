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

async function goToSelection() {
  expect(await screen.findByText('Versículo do dia')).toBeInTheDocument()
}

describe('Home prayer flow', () => {
  it('shows devotional choices as the initial screen', async () => {
    render(<Home />)

    expect(await screen.findByText('Versículo do dia')).toBeInTheDocument()
    expect(screen.getByText('Tipo de devoção')).toBeInTheDocument()
    expect(screen.queryByText('Como rezar em poucos passos')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Como rezar' })).toBeInTheDocument()
  })

  it('opens the tutorial from home and returns to home through the navbar', async () => {
    render(<Home />)

    await goToSelection()
    fireEvent.click(screen.getByRole('button', { name: 'Como rezar' }))

    expect(screen.getByText('Como rezar em poucos passos')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Vamos rezar o terço?' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Menu' }))

    expect(screen.getByText('Versículo do dia')).toBeInTheDocument()
  })

  it('lets returning users continue saved progress from home', async () => {
    localStorage.setItem(
      'terco-progress',
      JSON.stringify({ tipo: 'mariano', misterioId: 'gozosos', etapaIndex: 1 })
    )

    render(<Home />)

    fireEvent.click(await screen.findByRole('button', { name: 'Continuar' }))

    expect(screen.getByText('Pai Nosso')).toBeInTheDocument()
    expect(screen.getByText('Mistérios Gozosos')).toBeInTheDocument()
  })

  it('preserves current progress when returning to the selection screen', async () => {
    render(<Home />)

    await goToSelection()

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

  it('returns to the selection screen from the lower back button on the first step', async () => {
    render(<Home />)

    await goToSelection()

    fireEvent.click(await screen.findByRole('button', { name: /Mistérios Gozosos/ }))
    expect(screen.getByText('Credo')).toBeInTheDocument()

    const lowerBackButton = screen.getByRole('button', { name: 'Voltar à tela inicial' })
    expect(lowerBackButton).not.toBeDisabled()

    fireEvent.click(lowerBackButton)

    expect(screen.getByText('Versículo do dia')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continuar' })).toBeInTheDocument()
    expect(screen.getByText(/etapa 1\./)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(screen.getByText('Credo')).toBeInTheDocument()
  })

  it('keeps the lower back button moving to the previous step after the first step', async () => {
    render(<Home />)

    await goToSelection()

    fireEvent.click(await screen.findByRole('button', { name: /Mistérios Gozosos/ }))
    expect(screen.getByText('Credo')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Próxima etapa' }))
    act(() => {
      jest.advanceTimersByTime(150)
    })

    expect(await screen.findByText('Pai Nosso')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Etapa anterior' }))
    act(() => {
      jest.advanceTimersByTime(150)
    })

    expect(await screen.findByText('Credo')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Continuar' })).not.toBeInTheDocument()
  })

  it('shows and starts the requested novenas from the selection screen', async () => {
    render(<Home />)

    await goToSelection()
    fireEvent.click(await screen.findByRole('button', { name: 'Novenas' }))

    expect(screen.getByText('Escolha a novena')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Novena de Santa Terezinha' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Novena de Santo Antônio' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Novena de Nossa Senhora das Graças' })
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Novena de Santo Antônio' }))

    expect(screen.getByText('Novena de Santo Antônio')).toBeInTheDocument()
    expect(screen.getByText('Dia 1/9 — Fé')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Próxima etapa' }))
    act(() => {
      jest.advanceTimersByTime(150)
    })

    expect(await screen.findByText('Pai Nosso')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Próxima etapa' }))
    act(() => {
      jest.advanceTimersByTime(150)
    })

    expect(await screen.findByText('Ave Maria')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Próxima etapa' }))
    act(() => {
      jest.advanceTimersByTime(150)
    })

    expect(await screen.findByText('Glória')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Próxima etapa' }))
    act(() => {
      jest.advanceTimersByTime(150)
    })

    expect(await screen.findByText('Dia 2/9 — Palavra de Deus')).toBeInTheDocument()
  })

  it('starts the new devotional rosary types from the selection screen', async () => {
    render(<Home />)

    await goToSelection()
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

  it('persists and uses the selected progress layout', async () => {
    render(<Home />)

    await goToSelection()
    expect(screen.getByRole('button', { name: 'Pedras' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )

    fireEvent.click(screen.getByRole('button', { name: 'Terço' }))

    expect(screen.getByRole('button', { name: 'Terço' })).toHaveAttribute('aria-pressed', 'true')
    expect(JSON.parse(localStorage.getItem('terco-preferences') ?? '{}')).toEqual({
      fontSize: 'normal',
      progressLayout: 'terco',
    })

    fireEvent.click(screen.getByRole('button', { name: /Mistérios Gozosos/ }))

    expect(screen.getByTestId('progress-terco-layout')).toBeInTheDocument()
    expect(screen.queryByTestId('progress-linear-layout')).not.toBeInTheDocument()
  })

  it('changes the progress layout from the prayer screen without losing the current step', async () => {
    render(<Home />)

    await goToSelection()
    fireEvent.click(await screen.findByRole('button', { name: /Mistérios Gozosos/ }))

    fireEvent.click(screen.getByRole('button', { name: 'Próxima etapa' }))
    act(() => {
      jest.advanceTimersByTime(150)
    })

    expect(await screen.findByText('Pai Nosso')).toBeInTheDocument()
    expect(screen.getByTestId('progress-linear-layout')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Terço' }))

    expect(screen.getByText('Pai Nosso')).toBeInTheDocument()
    expect(screen.getByTestId('progress-terco-layout')).toBeInTheDocument()
    expect(screen.queryByTestId('progress-linear-layout')).not.toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('terco-preferences') ?? '{}')).toEqual({
      fontSize: 'normal',
      progressLayout: 'terco',
    })
  })
})
