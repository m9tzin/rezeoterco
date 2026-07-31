import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { PrayerScreen } from '@/components/PrayerScreen'
import { marianoData } from '@/data/mariano'
import type { Misterio } from '@/data/types'

type MockUtterance = {
  text: string
  lang: string
  rate: number
  pitch: number
  voice: SpeechSynthesisVoice | null
  onend: (() => void) | null
  onerror: (() => void) | null
}

let voicesChangedHandler: (() => void) | null = null

const speechSynthesisMock = {
  speak: jest.fn(),
  cancel: jest.fn(),
  getVoices: jest.fn<SpeechSynthesisVoice[], []>(),
  addEventListener: jest.fn((event: string, handler: () => void) => {
    if (event === 'voiceschanged') voicesChangedHandler = handler
  }),
  removeEventListener: jest.fn((event: string, handler: () => void) => {
    if (event === 'voiceschanged' && voicesChangedHandler === handler) {
      voicesChangedHandler = null
    }
  }),
  onvoiceschanged: null as (() => void) | null,
}

function makeVoice(
  name: string,
  lang: string,
  localService: boolean
): SpeechSynthesisVoice {
  return {
    name,
    lang,
    localService,
    default: false,
    voiceURI: name,
  } as SpeechSynthesisVoice
}

function installSpeechMocks() {
  class SpeechSynthesisUtteranceMock implements MockUtterance {
    lang = ''
    rate = 1
    pitch = 1
    voice: SpeechSynthesisVoice | null = null
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

function renderPrayerScreen({
  misterio = marianoData.misterios[0],
  onComplete = jest.fn(),
  onStepChange = jest.fn(),
}: {
  misterio?: Misterio
  onComplete?: jest.Mock
  onStepChange?: jest.Mock
} = {}) {
  return render(
    <PrayerScreen
      misterio={misterio}
      tipo="mariano"
      initialIndex={0}
      fontSize="normal"
      onFontChange={jest.fn()}
      onComplete={onComplete}
      onStepChange={onStepChange}
      onBack={jest.fn()}
    />
  )
}

beforeEach(() => {
  jest.useFakeTimers()
  voicesChangedHandler = null
  speechSynthesisMock.speak.mockClear()
  speechSynthesisMock.cancel.mockClear()
  speechSynthesisMock.getVoices.mockReset()
  speechSynthesisMock.getVoices.mockReturnValue([])
  speechSynthesisMock.addEventListener.mockClear()
  speechSynthesisMock.removeEventListener.mockClear()
  speechSynthesisMock.onvoiceschanged = null
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
      name: 'Iniciar leitura contínua',
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
    expect(utterance.rate).toBe(0.9)
    expect(utterance.pitch).toBe(1)

    expect(screen.getByRole('button', { name: 'Parar leitura contínua' })).toHaveAttribute(
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
      name: 'Iniciar leitura contínua',
    })
    await waitFor(() => expect(listenButton).not.toBeDisabled())
    speechSynthesisMock.speak.mockClear()
    speechSynthesisMock.cancel.mockClear()

    fireEvent.click(listenButton)
    fireEvent.click(screen.getByRole('button', { name: 'Parar leitura contínua' }))

    expect(speechSynthesisMock.cancel.mock.calls.length).toBeGreaterThanOrEqual(2)
    expect(screen.getByRole('button', { name: 'Iniciar leitura contínua' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })

  it('cancels the current reading when moving to another step', async () => {
    renderPrayerScreen()

    const listenButton = await screen.findByRole('button', {
      name: 'Iniciar leitura contínua',
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
    expect(screen.getByRole('button', { name: 'Iniciar leitura contínua' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })

  it('chooses the best available pt-BR local natural voice', async () => {
    const englishVoice = makeVoice('Alex', 'en-US', true)
    const ptPtVoice = makeVoice('Joana', 'pt-PT', true)
    const remotePtBrVoice = makeVoice('Google português do Brasil', 'pt-BR', false)
    const localGenericPtBrVoice = makeVoice('Brazilian Portuguese Generic', 'pt-BR', true)
    const localNaturalPtBrVoice = makeVoice('Luciana Natural', 'pt-BR', true)
    speechSynthesisMock.getVoices.mockReturnValue([
      englishVoice,
      ptPtVoice,
      remotePtBrVoice,
      localGenericPtBrVoice,
      localNaturalPtBrVoice,
    ])

    renderPrayerScreen()

    const listenButton = await screen.findByRole('button', {
      name: 'Iniciar leitura contínua',
    })
    await waitFor(() => expect(listenButton).not.toBeDisabled())
    speechSynthesisMock.speak.mockClear()
    speechSynthesisMock.cancel.mockClear()

    fireEvent.click(listenButton)

    const utterance = speechSynthesisMock.speak.mock.calls[0][0] as MockUtterance
    expect(utterance.voice).toBe(localNaturalPtBrVoice)
    expect(utterance.lang).toBe('pt-BR')
    expect(utterance.rate).toBe(0.9)
    expect(utterance.pitch).toBe(1)
  })

  it('loads voices from voiceschanged and falls back to another Portuguese voice', async () => {
    const englishVoice = makeVoice('Alex', 'en-US', true)
    const ptPtVoice = makeVoice('Joana', 'pt-PT', true)
    speechSynthesisMock.getVoices.mockReturnValueOnce([]).mockReturnValue([englishVoice, ptPtVoice])

    renderPrayerScreen()

    const listenButton = await screen.findByRole('button', {
      name: 'Iniciar leitura contínua',
    })
    await waitFor(() => expect(listenButton).not.toBeDisabled())

    act(() => {
      voicesChangedHandler?.()
    })

    await waitFor(() => expect(speechSynthesisMock.getVoices).toHaveBeenCalledTimes(2))
    speechSynthesisMock.speak.mockClear()
    speechSynthesisMock.cancel.mockClear()

    fireEvent.click(listenButton)

    const utterance = speechSynthesisMock.speak.mock.calls[0][0] as MockUtterance
    expect(utterance.voice).toBe(ptPtVoice)
    expect(utterance.lang).toBe('pt-BR')
  })

  it('uses the browser default voice when no Portuguese voice is available', async () => {
    speechSynthesisMock.getVoices.mockReturnValue([
      makeVoice('Alex', 'en-US', true),
      makeVoice('Thomas', 'fr-FR', true),
    ])

    renderPrayerScreen()

    const listenButton = await screen.findByRole('button', {
      name: 'Iniciar leitura contínua',
    })
    await waitFor(() => expect(listenButton).not.toBeDisabled())
    speechSynthesisMock.speak.mockClear()
    speechSynthesisMock.cancel.mockClear()

    fireEvent.click(listenButton)

    const utterance = speechSynthesisMock.speak.mock.calls[0][0] as MockUtterance
    expect(utterance.voice).toBeNull()
    expect(utterance.lang).toBe('pt-BR')
  })

  it('auto-advances and keeps reading until the final step finishes', async () => {
    const localNaturalPtBrVoice = makeVoice('Luciana Natural', 'pt-BR', true)
    speechSynthesisMock.getVoices.mockReturnValue([localNaturalPtBrVoice])
    const misterio: Misterio = {
      id: 'teste',
      titulo: 'Sequência curta',
      etapas: [
        { tipo: 'credo', label: 'Etapa 1', texto: 'Texto 1' },
        { tipo: 'pai-nosso', label: 'Etapa 2', texto: 'Texto 2' },
        { tipo: 'ave-maria', label: 'Etapa 3', texto: 'Texto 3' },
      ],
    }
    const onComplete = jest.fn()
    const onStepChange = jest.fn()
    renderPrayerScreen({ misterio, onComplete, onStepChange })

    const listenButton = await screen.findByRole('button', {
      name: 'Iniciar leitura contínua',
    })
    await waitFor(() => expect(listenButton).not.toBeDisabled())
    speechSynthesisMock.speak.mockClear()
    speechSynthesisMock.cancel.mockClear()

    fireEvent.click(listenButton)

    expect(speechSynthesisMock.speak).toHaveBeenCalledTimes(1)
    const firstUtterance = speechSynthesisMock.speak.mock.calls[0][0] as MockUtterance
    expect(firstUtterance.text).toBe('Texto 1')
    expect(firstUtterance.voice).toBe(localNaturalPtBrVoice)
    expect(firstUtterance.rate).toBe(0.9)
    expect(firstUtterance.pitch).toBe(1)

    act(() => {
      firstUtterance.onend?.()
      jest.advanceTimersByTime(150)
    })

    expect(await screen.findByText('Etapa 2')).toBeInTheDocument()
    await waitFor(() => expect(speechSynthesisMock.speak).toHaveBeenCalledTimes(2))
    expect(onStepChange).toHaveBeenCalledWith(1)
    const secondUtterance = speechSynthesisMock.speak.mock.calls[1][0] as MockUtterance
    expect(secondUtterance.text).toBe('Texto 2')
    expect(secondUtterance.voice).toBe(localNaturalPtBrVoice)

    act(() => {
      secondUtterance.onend?.()
      jest.advanceTimersByTime(150)
    })

    expect(await screen.findByText('Etapa 3')).toBeInTheDocument()
    await waitFor(() => expect(speechSynthesisMock.speak).toHaveBeenCalledTimes(3))
    expect(onStepChange).toHaveBeenCalledWith(2)
    const thirdUtterance = speechSynthesisMock.speak.mock.calls[2][0] as MockUtterance
    expect(thirdUtterance.text).toBe('Texto 3')

    act(() => {
      thirdUtterance.onend?.()
      jest.advanceTimersByTime(150)
    })

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Iniciar leitura contínua' })).toHaveAttribute(
        'aria-pressed',
        'false'
      )
    )
    expect(speechSynthesisMock.speak).toHaveBeenCalledTimes(3)
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('does not auto-advance after the user manually stops continuous reading', async () => {
    const onStepChange = jest.fn()
    renderPrayerScreen({ onStepChange })

    const listenButton = await screen.findByRole('button', {
      name: 'Iniciar leitura contínua',
    })
    await waitFor(() => expect(listenButton).not.toBeDisabled())
    speechSynthesisMock.speak.mockClear()
    speechSynthesisMock.cancel.mockClear()

    fireEvent.click(listenButton)

    const utterance = speechSynthesisMock.speak.mock.calls[0][0] as MockUtterance
    fireEvent.click(screen.getByRole('button', { name: 'Parar leitura contínua' }))

    act(() => {
      utterance.onend?.()
      jest.advanceTimersByTime(150)
    })

    expect(screen.getByText('Credo')).toBeInTheDocument()
    expect(onStepChange).not.toHaveBeenCalled()
    expect(speechSynthesisMock.speak).toHaveBeenCalledTimes(1)
  })
})
