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
      <RosaryProgress misterio={misterio} tipo="mariano" currentIndex={0} layout="linear" />
    )

    expect(screen.getByRole('region', { name: /contas do terço/i })).toBeInTheDocument()
    expect(screen.getByTestId('progress-linear-layout')).toBeInTheDocument()
    expect(screen.getByTestId('progress-bead-0')).toHaveAttribute('data-current', 'true')
    expect(screen.getByTestId('progress-bead-0')).toHaveAttribute('data-tone', 'intro')
    expect(screen.getByText('Credo · 1%')).toBeInTheDocument()

    rerender(
      <RosaryProgress misterio={misterio} tipo="mariano" currentIndex={8} layout="linear" />
    )

    expect(screen.getByTestId('progress-bead-0')).toHaveAttribute('data-state', 'done')
    expect(screen.getByTestId('progress-bead-8')).toHaveAttribute('data-current', 'true')
    expect(screen.getByTestId('progress-bead-8')).toHaveAttribute('data-tone', 'minor')
    expect(screen.getByText('Ave Maria 1/10 · 12%')).toBeInTheDocument()
  })

  it('reflects the real sequence of the Mercy chaplet decades', () => {
    const misterio = misericordiaData.misterios[0]
    render(
      <RosaryProgress misterio={misterio} tipo="misericordia" currentIndex={5} layout="linear" />
    )

    expect(screen.getAllByRole('listitem')).toHaveLength(misterio.etapas.length)
    expect(screen.getByTestId('progress-bead-5')).toHaveAttribute('data-current', 'true')
    expect(screen.getByTestId('progress-bead-5')).toHaveAttribute('data-tone', 'major')
    expect(screen.getByText('Oferecimento — 1ª Dezena · 10%')).toBeInTheDocument()
  })

  it('renders novena days and prayers as a devotional progress figure', () => {
    const misterio = novenaData.misterios[1]
    render(<RosaryProgress misterio={misterio} tipo="novena" currentIndex={4} layout="linear" />)

    expect(screen.getByRole('region', { name: /dias da novena/i })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(36)
    expect(screen.getByTestId('progress-bead-4')).toHaveAttribute('data-current', 'true')
    expect(screen.getByTestId('progress-bead-4')).toHaveAttribute('data-tone', 'major')
    expect(screen.getByText('Dia 2/9 — Palavra de Deus · 14%')).toBeInTheDocument()
  })

  it('derives the visual sequence length from every registered devotional type', () => {
    const firstTerco = TERCO_LIST[0]
    const firstMisterio = firstTerco.misterios[0]
    const { rerender } = render(
      <RosaryProgress
        misterio={firstMisterio}
        tipo={firstTerco.id}
        currentIndex={firstMisterio.etapas.length - 1}
        layout="linear"
      />
    )

    TERCO_LIST.forEach((terco) => {
      const misterio = terco.misterios[0]

      rerender(
        <RosaryProgress
          misterio={misterio}
          tipo={terco.id}
          currentIndex={misterio.etapas.length - 1}
          layout="linear"
        />
      )

      expect(screen.getAllByRole('listitem')).toHaveLength(misterio.etapas.length)
      expect(screen.getByTestId(`progress-bead-${misterio.etapas.length - 1}`)).toHaveAttribute(
        'data-current',
        'true'
      )
    })
  })

  it('switches between the aligned beads and physical rosary layouts', () => {
    const misterio = marianoData.misterios[0]
    const { rerender } = render(
      <RosaryProgress misterio={misterio} tipo="mariano" currentIndex={0} layout="linear" />
    )

    expect(screen.getByTestId('progress-linear-layout')).toBeInTheDocument()
    expect(screen.queryByTestId('progress-terco-layout')).not.toBeInTheDocument()

    rerender(<RosaryProgress misterio={misterio} tipo="mariano" currentIndex={0} layout="terco" />)

    expect(screen.getByTestId('progress-terco-layout')).toBeInTheDocument()
    expect(screen.getByTestId('progress-terco-guide')).toHaveAttribute(
      'preserveAspectRatio',
      'none'
    )
    expect(screen.getByTestId('progress-terco-guide-loop')).toBeInTheDocument()
    expect(screen.queryByTestId('progress-linear-layout')).not.toBeInTheDocument()
    expect(screen.getByTestId('progress-bead-0')).toHaveAttribute('data-current', 'true')
    expect(screen.getByTestId('progress-bead-0')).toHaveAttribute('data-tone', 'intro')
  })

  it('renders the physical rosary layout for every registered devotional type', () => {
    const firstTerco = TERCO_LIST[0]
    const firstMisterio = firstTerco.misterios[0]
    const { rerender } = render(
      <RosaryProgress
        misterio={firstMisterio}
        tipo={firstTerco.id}
        currentIndex={firstMisterio.etapas.length - 1}
        layout="terco"
      />
    )

    TERCO_LIST.forEach((terco) => {
      const misterio = terco.misterios[0]

      rerender(
        <RosaryProgress
          misterio={misterio}
          tipo={terco.id}
          currentIndex={misterio.etapas.length - 1}
          layout="terco"
        />
      )

      expect(screen.getByTestId('progress-terco-layout')).toBeInTheDocument()
      expect(screen.getAllByRole('listitem')).toHaveLength(misterio.etapas.length)
      expect(screen.getByTestId(`progress-bead-${misterio.etapas.length - 1}`)).toHaveAttribute(
        'data-current',
        'true'
      )
    })
  })
})
