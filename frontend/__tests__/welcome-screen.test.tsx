import { fireEvent, render, screen } from '@testing-library/react'
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
})
