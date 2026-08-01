import { act, fireEvent, render, screen } from '@testing-library/react'
import { WelcomeScreen } from '@/components/WelcomeScreen'

describe('WelcomeScreen', () => {
  it('renders an empty video state until a demo URL is configured', () => {
    render(<WelcomeScreen hasSavedProgress={false} onStart={jest.fn()} onResume={jest.fn()} />)

    expect(screen.getByText('Vídeo demonstrativo em breve')).toBeInTheDocument()
    expect(screen.queryByTitle('Vídeo demonstrativo: como rezar o terço')).not.toBeInTheDocument()
  })

  it('renders a configured Loom share URL as an embeddable player', () => {
    render(
      <WelcomeScreen
        hasSavedProgress={false}
        onStart={jest.fn()}
        onResume={jest.fn()}
        demoVideoUrl="https://www.loom.com/share/demo-id?sid=abc"
      />
    )

    expect(screen.getByTitle('Vídeo demonstrativo: como rezar o terço')).toHaveAttribute(
      'src',
      'https://www.loom.com/embed/demo-id'
    )
  })

  it('calls the start action from the primary CTA', () => {
    const onStart = jest.fn()

    render(<WelcomeScreen hasSavedProgress={false} onStart={onStart} onResume={jest.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Vamos rezar o terço?' }))

    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('uses a clear menu shortcut for skipping the welcome content', () => {
    const onStart = jest.fn()

    render(<WelcomeScreen hasSavedProgress={false} onStart={onStart} onResume={jest.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Menu' }))

    expect(onStart).toHaveBeenCalledTimes(1)
  })

  describe('animated title', () => {
    function mockReducedMotion(reduce: boolean) {
      window.matchMedia = jest.fn().mockImplementation((query: string) => ({
        matches: query.includes('prefers-reduced-motion') && reduce,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn(),
        onchange: null,
      })) as unknown as typeof window.matchMedia
    }

    afterEach(() => {
      jest.useRealTimers()
    })

    it('keeps the full title as the accessible name while the letters animate', () => {
      mockReducedMotion(false)
      jest.useFakeTimers()

      render(<WelcomeScreen hasSavedProgress={false} onStart={jest.fn()} onResume={jest.fn()} />)

      const heading = screen.getByRole('heading', { name: 'Reze o Terço' })
      expect(heading).toHaveTextContent('Reze o Terço')

      // Each step reschedules from an effect, so it needs its own flush.
      act(() => {
        jest.advanceTimersByTime(2400)
      })
      for (let step = 0; step < 4; step++) {
        act(() => {
          jest.advanceTimersByTime(55)
        })
      }

      expect(heading).not.toHaveTextContent('Reze o Terço')
      // The visible text shrank, but the announced name did not.
      expect(screen.getByRole('heading', { name: 'Reze o Terço' })).toBe(heading)
    })

    it('holds the title still and drops the caret when reduced motion is preferred', () => {
      mockReducedMotion(true)
      jest.useFakeTimers()

      render(<WelcomeScreen hasSavedProgress={false} onStart={jest.fn()} onResume={jest.fn()} />)

      const heading = screen.getByRole('heading', { name: 'Reze o Terço' })

      act(() => {
        jest.advanceTimersByTime(20000)
      })

      expect(heading).toHaveTextContent('Reze o Terço')
      expect(screen.queryByTestId('welcome-title-caret')).not.toBeInTheDocument()
    })

    it('shows the rosary logo instead of the old plain cross', () => {
      mockReducedMotion(true)

      render(<WelcomeScreen hasSavedProgress={false} onStart={jest.fn()} onResume={jest.fn()} />)

      const logo = screen.getByTestId('welcome-logo')

      expect(logo.querySelectorAll('circle').length).toBeGreaterThan(10)
      expect(logo.querySelectorAll('rect')).toHaveLength(2)
      expect(logo.querySelectorAll('line')).toHaveLength(0)
      expect(logo).toHaveAttribute('aria-hidden', 'true')
    })
  })
})
