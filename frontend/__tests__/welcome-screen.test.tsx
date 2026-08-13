import { act, fireEvent, render, screen } from '@testing-library/react'
import { WelcomeScreen } from '@/components/WelcomeScreen'

describe('WelcomeScreen', () => {
  it('renders an empty video state until a demo URL is configured', () => {
    render(<WelcomeScreen hasSavedProgress={false} onStart={jest.fn()} onResume={jest.fn()} />)

    expect(screen.getByText('Vídeo demonstrativo em breve')).toBeInTheDocument()
    expect(screen.queryByTestId('demo-video')).not.toBeInTheDocument()
  })

  it('renders a configured video URL as an autoplaying, muted, looping loop', () => {
    render(
      <WelcomeScreen
        hasSavedProgress={false}
        onStart={jest.fn()}
        onResume={jest.fn()}
        demoVideoUrl="https://example.public.blob.vercel-storage.com/demo.mp4"
      />
    )

    const video = screen.getByTestId('demo-video')
    expect(video.tagName).toBe('VIDEO')
    expect(video).toHaveAttribute('src', 'https://example.public.blob.vercel-storage.com/demo.mp4')
    expect(video).toHaveAttribute('autoplay')
    expect((video as HTMLVideoElement).muted).toBe(true)
    expect(video).toHaveAttribute('loop')
    expect(video).toHaveAttribute('aria-hidden', 'true')
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

    it('marks the screen with the rosary figure, in the header and beside the menu', () => {
      mockReducedMotion(true)

      render(<WelcomeScreen hasSavedProgress={false} onStart={jest.fn()} onResume={jest.fn()} />)

      const logos = screen.getAllByTestId('rosary-logo')

      expect(logos).toHaveLength(2)
      logos.forEach((logo) => {
        expect(logo.querySelectorAll('circle').length).toBeGreaterThan(8)
        expect(logo.querySelectorAll('rect')).toHaveLength(2)
        expect(logo.querySelectorAll('line')).toHaveLength(0)
        expect(logo).toHaveAttribute('aria-hidden', 'true')
      })

      // The menu mark is the discreet one; the header carries the full logo.
      const widths = logos.map((logo) => Number(logo.getAttribute('width')))
      expect(Math.min(...widths)).toBeLessThan(Math.max(...widths))
    })
  })
})
