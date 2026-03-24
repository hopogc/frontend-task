import { render, screen } from '@testing-library/react'
import { CardSlot } from './CardSlot'
import type { Card } from '@/api/deckApi'

const mockCard: Card = {
  code: 'AS',
  image: 'https://deckofcardsapi.com/static/img/AS.png',
  value: 'ACE',
  suit: 'SPADES',
}

describe('CardSlot', () => {
  it('renders the label', () => {
    render(<CardSlot card={null} label="Previous" />)
    expect(screen.getByText('Previous')).toBeInTheDocument()
  })

  it('renders a placeholder when card is null', () => {
    const { container } = render(<CardSlot card={null} label="Previous" />)
    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(container.querySelector('.border-dashed')).toBeInTheDocument()
  })

  it('renders the card image when a card is provided', () => {
    render(<CardSlot card={mockCard} label="Current" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', mockCard.image)
  })

  it('uses value and suit as alt text', () => {
    render(<CardSlot card={mockCard} label="Current" />)
    expect(screen.getByAltText('ACE of SPADES')).toBeInTheDocument()
  })

  it('renders a skeleton when isLoading is true (no card)', () => {
    const { container } = render(<CardSlot card={null} label="Previous" isLoading={true} />)
    expect(container.querySelector('[data-slot="skeleton"]')).toBeInTheDocument()
    expect(container.querySelector('img')).not.toBeInTheDocument()
  })

  it('renders a skeleton instead of the card image when isLoading is true', () => {
    const { container } = render(<CardSlot card={mockCard} label="Current" isLoading={true} />)
    expect(container.querySelector('[data-slot="skeleton"]')).toBeInTheDocument()
    expect(container.querySelector('img')).not.toBeInTheDocument()
  })

  it('does not render a skeleton when isLoading defaults to false', () => {
    const { container } = render(<CardSlot card={mockCard} label="Current" />)
    expect(container.querySelector('[data-slot="skeleton"]')).not.toBeInTheDocument()
  })
})
