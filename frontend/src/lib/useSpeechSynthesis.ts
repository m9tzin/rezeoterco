'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type SpeechSynthesisOptions = {
  onEnd?: () => void
}

export function useSpeechSynthesis(text: string, options: SpeechSynthesisOptions = {}) {
  const [isSupported, setIsSupported] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const onEndRef = useRef(options.onEnd)

  useEffect(() => {
    setIsSupported(
      typeof window !== 'undefined' &&
        'speechSynthesis' in window &&
        'SpeechSynthesisUtterance' in window
    )
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
    utterance.lang = 'pt-BR'
    utterance.rate = 0.95
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
  }, [text])

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
