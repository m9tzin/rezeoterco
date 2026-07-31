'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const NATURAL_RATE = 0.9
const NATURAL_PITCH = 1

const QUALITY_NAME_PATTERN =
  /\b(neural|natural|premium|enhanced|luciana|francisca|maria|felipe|daniel|helena|joana|ines|inês|raquel)\b/i
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

  if (voice.localService) score += 100
  if (QUALITY_NAME_PATTERN.test(name)) score += 60
  if (ROBOTIC_NAME_PATTERN.test(name)) score -= 80

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

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    utteranceRef.current = null
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  const speak = useCallback(() => {
    if (
      typeof window === 'undefined' ||
      !('speechSynthesis' in window) ||
      !('SpeechSynthesisUtterance' in window)
    ) {
      return
    }

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
    window.speechSynthesis.speak(utterance)
  }, [text, voices])

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
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

      window.speechSynthesis.cancel()
      utteranceRef.current = null
    },
    []
  )

  return { isSupported, isSpeaking, speak, stop, toggle }
}
