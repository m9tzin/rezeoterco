import { render, screen } from '@testing-library/react'
import { RosaryProgress } from '@/components/RosaryProgress'
import { marianoData } from '@/data/mariano'
import { misericordiaData } from '@/data/misericordia'
import { novenaData } from '@/data/novenas'
import { TERCO_LIST } from '@/data/index'

describe('RosaryProgress', () => {
  it('highlights the current Marian rosary bead and updates when the step changes', () => {
    const misterio = marianoData.misterios[0]
    const { rerender } = render(
      <RosaryProgress misterio={misterio} tipo="mariano" currentIndex={0} />
    )

    expect(screen.getByRole('region', { name: /contas do terço/i })).toBeInTheDocument()
    expect(screen.getByTestId('progress-bead-0')).toHaveAttribute('data-current', 'true')
    expect(screen.getByTestId('progress-bead-0')).toHaveAttribute('data-tone', 'intro')
    expect(screen.getByText('Credo · 1%')).toBeInTheDocument()

    rerender(<RosaryProgress misterio={misterio} tipo="mariano" currentIndex={8} />)

    expect(screen.getByTestId('progress-bead-0')).toHaveAttribute('data-state', 'done')
    expect(screen.getByTestId('progress-bead-8')).toHaveAttribute('data-current', 'true')
    expect(screen.getByTestId('progress-bead-8')).toHaveAttribute('data-tone', 'minor')
    expect(screen.getByText('Ave Maria 1/10 · 12%')).toBeInTheDocument()
  })

  it('reflects the real sequence of the Mercy chaplet decades', () => {
    const misterio = misericordiaData.misterios[0]
    render(<RosaryProgress misterio={misterio} tipo="misericordia" currentIndex={5} />)

    expect(screen.getAllByRole('listitem')).toHaveLength(misterio.etapas.length)
    expect(screen.getByTestId('progress-bead-5')).toHaveAttribute('data-current', 'true')
    expect(screen.getByTestId('progress-bead-5')).toHaveAttribute('data-tone', 'major')
    expect(screen.getByText('Oferecimento — 1ª Dezena · 10%')).toBeInTheDocument()
  })

  it('renders novena days as a devotional progress figure', () => {
    const misterio = novenaData.misterios[1]
    render(<RosaryProgress misterio={misterio} tipo="novena" currentIndex={4} />)

    expect(screen.getByRole('region', { name: /dias da novena/i })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(9)
    expect(screen.getByTestId('progress-bead-4')).toHaveAttribute('data-current', 'true')
    expect(screen.getByTestId('progress-bead-4')).toHaveAttribute('data-tone', 'major')
    expect(screen.getByText('Dia 5/9 — Família · 56%')).toBeInTheDocument()
  })

  it('derives the visual sequence length from every registered devotional type', () => {
    const firstTerco = TERCO_LIST[0]
    const firstMisterio = firstTerco.misterios[0]
    const { rerender } = render(
      <RosaryProgress
        misterio={firstMisterio}
        tipo={firstTerco.id}
        currentIndex={firstMisterio.etapas.length - 1}
      />
    )

    TERCO_LIST.forEach((terco) => {
      const misterio = terco.misterios[0]

      rerender(
        <RosaryProgress
          misterio={misterio}
          tipo={terco.id}
          currentIndex={misterio.etapas.length - 1}
        />
      )

      expect(screen.getAllByRole('listitem')).toHaveLength(misterio.etapas.length)
      expect(screen.getByTestId(`progress-bead-${misterio.etapas.length - 1}`)).toHaveAttribute(
        'data-current',
        'true'
      )
    })
  })
})
