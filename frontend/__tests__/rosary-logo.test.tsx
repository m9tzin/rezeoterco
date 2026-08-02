import { render, screen } from '@testing-library/react'
import { RosaryLogo } from '@/components/RosaryLogo'

describe('RosaryLogo', () => {
  it('keeps the proportions of the figure the prayer screen draws', () => {
    render(<RosaryLogo width={40} />)

    const logo = screen.getByTestId('rosary-logo')
    const [, , viewWidth, viewHeight] = (logo.getAttribute('viewBox') ?? '').split(' ').map(Number)

    // Same aspect the real figure resolves to, so the mark is a true miniature.
    expect(Number(logo.getAttribute('height')) / Number(logo.getAttribute('width'))).toBeCloseTo(
      viewHeight / viewWidth,
      1
    )
  })

  it('traces the cord at full resolution so the teardrop stays smooth', () => {
    render(<RosaryLogo width={40} />)

    const loop = screen.getByTestId('rosary-logo').querySelector('polygon')
    const vertices = (loop?.getAttribute('points') ?? '').trim().split(/\s+/)

    // Beads are thinned out for legibility, but the cord never is.
    expect(vertices.length).toBeGreaterThan(
      screen.getByTestId('rosary-logo').querySelectorAll('circle').length * 2
    )
  })

  it('thins the beads out as the mark gets smaller', () => {
    const { rerender } = render(<RosaryLogo width={40} />)
    const large = screen.getByTestId('rosary-logo').querySelectorAll('circle').length

    rerender(<RosaryLogo width={13} />)
    const small = screen.getByTestId('rosary-logo').querySelectorAll('circle').length

    expect(small).toBeLessThan(large)
    expect(small).toBeGreaterThan(4)
  })

  it('never lets a bead swell past the gap it has to sit in', () => {
    render(<RosaryLogo width={13} />)

    const circles = Array.from(screen.getByTestId('rosary-logo').querySelectorAll('circle')).map(
      (circle) => ({
        x: Number(circle.getAttribute('cx')),
        y: Number(circle.getAttribute('cy')),
        r: Number(circle.getAttribute('r')),
      })
    )
    const radii = circles.map((circle) => circle.r)
    // Measured straight off what was drawn: how far apart neighbouring loop
    // beads actually ended up.
    const gaps = circles
      .slice(0, 8)
      .slice(0, -1)
      .map((circle, index) => Math.hypot(circles[index + 1].x - circle.x, circles[index + 1].y - circle.y))
    const drawnPitch = gaps.sort((a, b) => a - b)[Math.floor(gaps.length / 2)]

    expect(Math.max(...radii) * 2).toBeLessThan(drawnPitch * 1.25)
    // The medal must still out-size a plain bead, or the base stops reading.
    expect(Math.max(...radii)).toBeGreaterThan(Math.min(...radii) * 1.4)
  })

  it('inherits its colour so callers can place it on any surface', () => {
    render(<RosaryLogo width={40} className="text-brown" />)

    const logo = screen.getByTestId('rosary-logo')

    expect(logo).toHaveClass('text-brown')
    expect(logo.querySelector('g[fill="currentColor"]')).toBeInTheDocument()
    expect(logo).toHaveAttribute('aria-hidden', 'true')
  })
})
