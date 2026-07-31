import { render, screen } from '@testing-library/react'
import { VerseOfDay } from '@/components/VerseOfDay'
import {
  getDiaDoAno,
  getVersiculoDoDia,
  VERSICULOS_DO_DIA,
} from '@/data/versiculos'

describe('versículo do dia', () => {
  it('calculates a deterministic zero-based day of year', () => {
    expect(getDiaDoAno(new Date(2026, 0, 1))).toBe(0)
    expect(getDiaDoAno(new Date(2026, 0, 2))).toBe(1)
  })

  it('selects the same verse during the same day', () => {
    const morning = getVersiculoDoDia(new Date(2026, 6, 31, 8))
    const evening = getVersiculoDoDia(new Date(2026, 6, 31, 21))

    expect(morning).toBe(evening)
  })

  it('changes deterministically on the following day', () => {
    const today = getVersiculoDoDia(new Date(2026, 0, 1))
    const tomorrow = getVersiculoDoDia(new Date(2026, 0, 2))

    expect(today).toBe(VERSICULOS_DO_DIA[0])
    expect(tomorrow).toBe(VERSICULOS_DO_DIA[1])
  })

  it('cycles through the local static verse list', () => {
    const cycled = getVersiculoDoDia(new Date(2026, 0, VERSICULOS_DO_DIA.length + 1))

    expect(cycled).toBe(VERSICULOS_DO_DIA[0])
  })

  it('renders the selected verse and reflection', () => {
    const versiculo = getVersiculoDoDia(new Date(2026, 0, 1))

    render(<VerseOfDay date={new Date(2026, 0, 1)} />)

    expect(screen.getByText('Versículo do dia')).toBeInTheDocument()
    expect(screen.getByText(`“${versiculo.texto}”`)).toBeInTheDocument()
    expect(screen.getByText(versiculo.referencia)).toBeInTheDocument()
    expect(screen.getByText(versiculo.reflexao)).toBeInTheDocument()
  })
})
