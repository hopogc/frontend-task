import { render } from '@testing-library/react'
import { LoadingOverlay } from './LoadingOverlay'

describe('LoadingOverlay', () => {
  it('renders nothing when not visible', () => {
    const { container } = render(<LoadingOverlay visible={false} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders an overlay when visible', () => {
    const { container } = render(<LoadingOverlay visible={true} />)
    const overlay = container.firstChild as HTMLElement
    expect(overlay).toBeInTheDocument()
    expect(overlay).toHaveClass('fixed', 'inset-0', 'z-50')
  })

  it('renders a spinner inside the overlay', () => {
    const { container } = render(<LoadingOverlay visible={true} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('overlay has dark background', () => {
    const { container } = render(<LoadingOverlay visible={true} />)
    const overlay = container.firstChild as HTMLElement
    expect(overlay.className).toContain('bg-black')
  })

  it('transitions from hidden to visible', () => {
    const { container, rerender } = render(<LoadingOverlay visible={false} />)
    expect(container).toBeEmptyDOMElement()

    rerender(<LoadingOverlay visible={true} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
