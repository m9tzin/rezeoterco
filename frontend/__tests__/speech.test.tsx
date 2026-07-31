import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { PrayerScreen } from '@/components/PrayerScreen'
import { marianoData } from '@/data/mariano'

type MockUtterance = {
  text: string
  lang: string
  rate: number
  onend: (() => void) | null
  onerror: (() => void) | null
}

const speechSynthesisMock = {
  speak: jest.fn(),
  cancel: jest.fn(),
}

function installSpeechMocks() {
  class SpeechSynthesisUtteranceMock implements MockUtterance {
    lang = ''
    rate = 1
    onend: (() => void) | null = null
    onerror: (() => void) | null = null

    constructor(public text: string) {}
  }

  Object.defineProperty(window, 'speechSynthesis', {
    configurable: true,
    value: speechSynthesisMock,
  })
  Object.defineProperty(window, 'SpeechSynthesisUtterance', {
    configurable: true,
    value: SpeechSynthesisUtteranceMock,
  })
}

function renderPrayerScreen() {
  return render(
    <PrayerScreen
      misterio={marianoData.misterios[0]}
      tipo="mariano"
      initialIndex={0}
      fontSize="normal"
      onFontChange={jest.fn()}
      onComplete={jest.fn()}
      onStepChange={jest.fn()}
      onBack={jest.fn()}
    />
  )
}

beforeEach(() => {
  jest.useFakeTimers()
  speechSynthesisMock.speak.mockClear()
  speechSynthesisMock.cancel.mockClear()
  installSpeechMocks()
  window.HTMLElement.prototype.scrollIntoView = jest.fn()
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
  jest.restoreAllMocks()
})

describe('speech synthesis controls', () => {
  it('reads the current prayer aloud in pt-BR and shows reading state', async () => {
    renderPrayerScreen()

    const listenButton = await screen.findByRole('button', {
      name: 'Ler oração em voz alta',
    })
    await waitFor(() => expect(listenButton).not.toBeDisabled())
    speechSynthesisMock.speak.mockClear()
    speechSynthesisMock.cancel.mockClear()

    fireEvent.click(listenButton)

    expect(speechSynthesisMock.cancel).toHaveBeenCalledTimes(1)
    expect(speechSynthesisMock.speak).toHaveBeenCalledTimes(1)

    const utterance = speechSynthesisMock.speak.mock.calls[0][0] as MockUtterance
    expect(utterance.text).toBe(marianoData.misterios[0].etapas[0].texto)
    expect(utterance.lang).toBe('pt-BR')
    expect(utterance.rate).toBe(0.95)

    expect(screen.getByRole('button', { name: 'Parar leitura em voz alta' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByText('Credo').closest('[data-speaking]')).toHaveAttribute(
      'data-speaking',
      'true'
    )
  })

  it('stops reading when the user presses stop', async () => {
    renderPrayerScreen()

    const listenButton = await screen.findByRole('button', {
      name: 'Ler oração em voz alta',
    })
    await waitFor(() => expect(listenButton).not.toBeDisabled())
    speechSynthesisMock.speak.mockClear()
    speechSynthesisMock.cancel.mockClear()

    fireEvent.click(listenButton)
    fireEvent.click(screen.getByRole('button', { name: 'Parar leitura em voz alta' }))

    expect(speechSynthesisMock.cancel.mock.calls.length).toBeGreaterThanOrEqual(2)
    expect(screen.getByRole('button', { name: 'Ler oração em voz alta' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })

  it('cancels the current reading when moving to another step', async () => {
    renderPrayerScreen()

    const listenButton = await screen.findByRole('button', {
      name: 'Ler oração em voz alta',
    })
    await waitFor(() => expect(listenButton).not.toBeDisabled())
    speechSynthesisMock.speak.mockClear()
    speechSynthesisMock.cancel.mockClear()

    fireEvent.click(listenButton)
    fireEvent.click(screen.getByRole('button', { name: 'Próxima etapa' }))
    act(() => {
      jest.advanceTimersByTime(150)
    })

    expect(speechSynthesisMock.cancel.mock.calls.length).toBeGreaterThanOrEqual(2)
    expect(await screen.findByText('Pai Nosso')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ler oração em voz alta' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })
})
