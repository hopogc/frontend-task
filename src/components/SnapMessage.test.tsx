import { render, screen } from '@testing-library/react'
import { SnapMessage } from './SnapMessage'

describe('SnapMessage', () => {
  it('renders nothing when neither snap condition is true', () => {
    const { container } = render(<SnapMessage snapValue={false} snapSuit={false} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows SNAP VALUE! when snapValue is true', () => {
    render(<SnapMessage snapValue={true} snapSuit={false} />)
    expect(screen.getByText('SNAP VALUE!')).toBeInTheDocument()
  })

  it('shows SNAP SUIT! when snapSuit is true', () => {
    render(<SnapMessage snapValue={false} snapSuit={true} />)
    expect(screen.getByText('SNAP SUIT!')).toBeInTheDocument()
  })

  it('prioritises SNAP VALUE! when both are true', () => {
    render(<SnapMessage snapValue={true} snapSuit={true} />)
    expect(screen.getByText('SNAP VALUE!')).toBeInTheDocument()
    expect(screen.queryByText('SNAP SUIT!')).not.toBeInTheDocument()
  })

  it('does not show SNAP SUIT! when only snapValue is true', () => {
    render(<SnapMessage snapValue={true} snapSuit={false} />)
    expect(screen.queryByText('SNAP SUIT!')).not.toBeInTheDocument()
  })

  it('does not show SNAP VALUE! when only snapSuit is true', () => {
    render(<SnapMessage snapValue={false} snapSuit={true} />)
    expect(screen.queryByText('SNAP VALUE!')).not.toBeInTheDocument()
  })
})
