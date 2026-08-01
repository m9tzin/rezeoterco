'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const NATURAL_RATE = 0.9
const NATURAL_PITCH = 1
const SPEAK_AFTER_CANCEL_DELAY_MS = 75

const QUALITY_NAME_PATTERN =
  /\b(google|neural|natural|premium|enhanced|luciana|francisca|maria|felipe|daniel|helena|joana|ines|inês|raquel)\b/i
const ROBOTIC_NAME_PATTERN = /\b(default|generic|compact|standard|basic|robot|synthetic|espeak|festival)\b/i

function normalizeLang(lang: string): string {
  return lang.toLowerCase().replace('_', '-')
}

function voiceScore(voice: SpeechSynthesisVoice): number {
  const lang = normalizeLang(voice.lang)
  const name = voice.name.toLowerCase()
  let score = 0

  if (lang === 'pt-br') score += 1000
  else if (lang.startsWith('pt-br')) score += 950
  else if (lang.startsWith('pt-')) score += 700
  else if (lang === 'pt') score += 600
  else return -1

  if (QUALITY_NAME_PATTERN.test(name)) score += 60
  if (ROBOTIC_NAME_PATTERN.test(name)) score -= 80
  if (voice.localService) score += 5

  return score
}

export function selectBestPortugueseVoice(
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | undefined {
  return voices
    .map((voice, index) => ({ voice, index, score: voiceScore(voice) }))
    .filter((candidate) => candidate.score >= 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)[0]?.voice
}

type SpeechSynthesisOptions = {
  onEnd?: () => void
}

export function useSpeechSynthesis(text: string, options: SpeechSynthesisOptions = {}) {
  const [isSupported, setIsSupported] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const queuedSpeakRef = useRef<number | null>(null)
  const onEndRef = useRef(options.onEnd)

  useEffect(() => {
    const supported =
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      'SpeechSynthesisUtterance' in window
    setIsSupported(supported)

    if (!supported) return undefined

    const synth = window.speechSynthesis
    const loadVoices = () => {
      setVoices(typeof synth.getVoices === 'function' ? synth.getVoices() : [])
    }

    loadVoices()

    if (typeof synth.addEventListener === 'function') {
      synth.addEventListener('voiceschanged', loadVoices)
      return () => synth.removeEventListener('voiceschanged', loadVoices)
    }

    synth.onvoiceschanged = loadVoices
    return () => {
      if (synth.onvoiceschanged === loadVoices) synth.onvoiceschanged = null
    }
  }, [])

  useEffect(() => {
    onEndRef.current = options.onEnd
  }, [options.onEnd])

  const clearQueuedSpeak = useCallback(() => {
    if (queuedSpeakRef.current === null || typeof window === 'undefined') return

    window.clearTimeout(queuedSpeakRef.current)
    queuedSpeakRef.current = null
  }, [])

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    clearQueuedSpeak()
    utteranceRef.current = null
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [clearQueuedSpeak])

  const speak = useCallback(() => {
    if (
      typeof window === 'undefined' ||
      !('speechSynthesis' in window) ||
      !('SpeechSynthesisUtterance' in window)
    ) {
      return
    }

    clearQueuedSpeak()
    utteranceRef.current = null
    window.speechSynthesis.cancel()

    const utterance = new window.SpeechSynthesisUtterance(text)
    const voice = selectBestPortugueseVoice(voices)

    if (voice) utterance.voice = voice
    utterance.lang = 'pt-BR'
    utterance.rate = NATURAL_RATE
    utterance.pitch = NATURAL_PITCH
    utterance.onend = () => {
      if (utteranceRef.current !== utterance) return

      utteranceRef.current = null
      setIsSpeaking(false)
      onEndRef.current?.()
    }
    utterance.onerror = () => {
      if (utteranceRef.current !== utterance) return

      utteranceRef.current = null
      setIsSpeaking(false)
    }

    utteranceRef.current = utterance
    setIsSpeaking(true)
    queuedSpeakRef.current = window.setTimeout(() => {
      queuedSpeakRef.current = null
      if (utteranceRef.current !== utterance) return

      window.speechSynthesis.speak(utterance)
    }, SPEAK_AFTER_CANCEL_DELAY_MS)
  }, [clearQueuedSpeak, text, voices])

  const toggle = useCallback(() => {
    if (isSpeaking) {
      stop()
      return
    }

    speak()
  }, [isSpeaking, speak, stop])

  useEffect(() => {
    stop()
  }, [text, stop])

  useEffect(
    () => () => {
      clearQueuedSpeak()
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

      window.speechSynthesis.cancel()
      utteranceRef.current = null
    },
    [clearQueuedSpeak]
  )

  return { isSupported, isSpeaking, speak, stop, toggle }
}
