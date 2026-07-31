'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export function useSpeechSynthesis(text: string) {
  const [isSupported, setIsSupported] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    setIsSupported(
      typeof window !== 'undefined' &&
        'speechSynthesis' in window &&
        'SpeechSynthesisUtterance' in window
    )
  }, [])

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()
    utteranceRef.current = null
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

    window.speechSynthesis.cancel()

    const utterance = new window.SpeechSynthesisUtterance(text)
    utterance.lang = 'pt-BR'
    utterance.rate = 0.95
    utterance.onend = () => {
      utteranceRef.current = null
      setIsSpeaking(false)
    }
    utterance.onerror = () => {
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
