'use client'

import { useEffect, useState } from 'react'

const TITLE = 'Reze o Terço'
const TYPE_MS = 130
const DELETE_MS = 55
const HOLD_FULL_MS = 2400
const HOLD_EMPTY_MS = 700

type Props = {
  className: string
  caretTestId?: string
}

/**
 * Types the app title out, holds it, erases it and starts over.
 *
 * The full title is rendered initially to avoid a flash of an empty heading.
 * Its accessible name stays fixed while the visible letters animate.
 */
export function TypewriterTitle({ className, caretTestId = 'typewriter-title-caret' }: Props) {
  const [animated, setAnimated] = useState(false)
  const [count, setCount] = useState(TITLE.length)
  const [erasing, setErasing] = useState(false)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return

    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setAnimated(!query.matches)

    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!animated) {
      setCount(TITLE.length)
      setErasing(false)
      return
    }

    const done = erasing ? count === 0 : count === TITLE.length
    const delay = done
      ? erasing
        ? HOLD_EMPTY_MS
        : HOLD_FULL_MS
      : erasing
        ? DELETE_MS
        : TYPE_MS

    const timer = setTimeout(() => {
      if (done) setErasing(!erasing)
      else setCount(erasing ? count - 1 : count + 1)
    }, delay)

    return () => clearTimeout(timer)
  }, [animated, count, erasing])

  return (
    <h1 aria-label={TITLE} className={className}>
      <span aria-hidden="true">{TITLE.slice(0, count)}</span>
      {animated && (
        <span
          aria-hidden="true"
          data-testid={caretTestId}
          className="ml-1 inline-block h-[0.8em] w-[3px] translate-y-[0.06em] bg-gold/70 animate-pulse"
        />
      )}
    </h1>
  )
}
