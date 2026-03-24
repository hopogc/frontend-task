import { render } from '@testing-library/react'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('renders an SVG element', () => {
    const { container } = render(<Spinner />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('has animate-spin class', () => {
    const { container } = render(<Spinner />)
    expect(container.querySelector('svg')).toHaveClass('animate-spin')
  })

  it('is hidden from assistive technology', () => {
    const { container } = render(<Spinner />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies additional className', () => {
    const { container } = render(<Spinner className="w-10 h-10 text-white" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('w-10', 'h-10', 'text-white')
  })

  it('preserves default animate-spin when extra className is provided', () => {
    const { container } = render(<Spinner className="w-5 h-5" />)
    expect(container.querySelector('svg')).toHaveClass('animate-spin', 'w-5', 'h-5')
  })
})
