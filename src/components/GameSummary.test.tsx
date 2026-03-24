import { render, screen } from '@testing-library/react'
import { GameSummary } from './GameSummary'

describe('GameSummary', () => {
  it('renders value match count', () => {
    render(<GameSummary valueMatches={5} suitMatches={3} />)
    expect(screen.getByText('VALUE MATCHES: 5')).toBeInTheDocument()
  })

  it('renders suit match count', () => {
    render(<GameSummary valueMatches={5} suitMatches={3} />)
    expect(screen.getByText('SUIT MATCHES: 3')).toBeInTheDocument()
  })

  it('renders zero counts', () => {
    render(<GameSummary valueMatches={0} suitMatches={0} />)
    expect(screen.getByText('VALUE MATCHES: 0')).toBeInTheDocument()
    expect(screen.getByText('SUIT MATCHES: 0')).toBeInTheDocument()
  })

  it('renders both counts together', () => {
    render(<GameSummary valueMatches={12} suitMatches={7} />)
    expect(screen.getByText('VALUE MATCHES: 12')).toBeInTheDocument()
    expect(screen.getByText('SUIT MATCHES: 7')).toBeInTheDocument()
  })
})
