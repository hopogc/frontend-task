import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { renderWithProviders } from '@/test/utils'
import { server, makeCard, MOCK_DECK_ID, resetDrawCursor } from '@/test/server'
import { GamePage } from './GamePage'

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn(), dismiss: vi.fn() },
  Toaster: () => null,
}))

beforeEach(() => {
  resetDrawCursor()
  vi.clearAllMocks()
})

describe('GamePage', () => {
  describe('initial render', () => {
    it('shows skeleton loaders while the deck is initialising', () => {
      // Use a delayed response so loading state is observable
      server.use(
        http.get('https://deckofcardsapi.com/api/deck/new/shuffle/', async () => {
          await new Promise((r) => setTimeout(r, 50))
          return HttpResponse.json({ deck_id: MOCK_DECK_ID, remaining: 52, shuffled: true })
        })
      )
      renderWithProviders(<GamePage />)
      expect(document.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0)
    })

    it('renders the SNAP! heading', async () => {
      renderWithProviders(<GamePage />)
      expect(screen.getByText('SNAP!')).toBeInTheDocument()
    })

    it('shows two cards after initialisation', async () => {
      renderWithProviders(<GamePage />)
      // default handler draws ACE of SPADES and KING of HEARTS as the initial 2 cards
      await screen.findByAltText('ACE of SPADES')
      expect(screen.getByAltText('KING of HEARTS')).toBeInTheDocument()
    })

    it('shows the Draw card button after initialisation', async () => {
      renderWithProviders(<GamePage />)
      await screen.findByRole('button', { name: /draw card/i })
    })
  })

  describe('drawing a card', () => {
    it('replaces the current card with the newly drawn card', async () => {
      renderWithProviders(<GamePage />)
      await screen.findByAltText('ACE of SPADES')

      const button = screen.getByRole('button', { name: /draw card/i })
      await userEvent.click(button)

      // After clicking, QUEEN of DIAMONDS is drawn (3rd card in sequence)
      await screen.findByAltText('QUEEN of DIAMONDS')
    })

    it('moves the current card to the previous slot', async () => {
      renderWithProviders(<GamePage />)
      await screen.findByAltText('KING of HEARTS')

      await userEvent.click(screen.getByRole('button', { name: /draw card/i }))

      // KING of HEARTS (was Current) should now be Previous
      await waitFor(() => {
        expect(screen.getByAltText('KING of HEARTS')).toBeInTheDocument()
      })
    })
  })

  describe('snap detection', () => {
    it('shows SNAP VALUE! when the drawn card matches the previous value', async () => {
      server.use(
        http.get(`https://deckofcardsapi.com/api/deck/${MOCK_DECK_ID}/draw/`, ({ request }) => {
          const count = parseInt(new URL(request.url).searchParams.get('count') ?? '1', 10)
          if (count === 2) {
            return HttpResponse.json({
              cards: [makeCard('AS', 'ACE', 'SPADES'), makeCard('AH', 'ACE', 'HEARTS')],
              remaining: 50,
            })
          }
          return HttpResponse.json({
            cards: [makeCard('AD', 'ACE', 'DIAMONDS')],
            remaining: 49,
          })
        })
      )

      renderWithProviders(<GamePage />)
      await screen.findByAltText('ACE of HEARTS')

      await userEvent.click(screen.getByRole('button', { name: /draw card/i }))
      await screen.findByText('SNAP VALUE!')
    })

    it('shows SNAP SUIT! when the drawn card matches the previous suit', async () => {
      server.use(
        http.get(`https://deckofcardsapi.com/api/deck/${MOCK_DECK_ID}/draw/`, ({ request }) => {
          const count = parseInt(new URL(request.url).searchParams.get('count') ?? '1', 10)
          if (count === 2) {
            return HttpResponse.json({
              cards: [makeCard('AS', 'ACE', 'SPADES'), makeCard('KS', 'KING', 'SPADES')],
              remaining: 50,
            })
          }
          return HttpResponse.json({
            cards: [makeCard('QS', 'QUEEN', 'SPADES')],
            remaining: 49,
          })
        })
      )

      renderWithProviders(<GamePage />)
      await screen.findByAltText('KING of SPADES')

      await userEvent.click(screen.getByRole('button', { name: /draw card/i }))
      await screen.findByText('SNAP SUIT!')
    })

    it('shows no snap message when neither value nor suit matches', async () => {
      renderWithProviders(<GamePage />)
      // Default sequence: ACE/SPADES, KING/HEARTS, QUEEN/DIAMONDS — no match
      await screen.findByAltText('KING of HEARTS')

      await userEvent.click(screen.getByRole('button', { name: /draw card/i }))
      await screen.findByAltText('QUEEN of DIAMONDS')

      expect(screen.queryByText('SNAP VALUE!')).not.toBeInTheDocument()
      expect(screen.queryByText('SNAP SUIT!')).not.toBeInTheDocument()
    })
  })

  describe('game end', () => {
    it('hides Draw card button and shows summary when deck is exhausted', async () => {
      server.use(
        http.get(`https://deckofcardsapi.com/api/deck/${MOCK_DECK_ID}/draw/`, ({ request }) => {
          const count = parseInt(new URL(request.url).searchParams.get('count') ?? '1', 10)
          if (count === 2) {
            return HttpResponse.json({
              cards: [makeCard('AS', 'ACE', 'SPADES'), makeCard('KH', 'KING', 'HEARTS')],
              remaining: 50,
            })
          }
          // Single draw returns remaining=0 to simulate deck exhaustion
          return HttpResponse.json({
            cards: [makeCard('QD', 'QUEEN', 'DIAMONDS')],
            remaining: 0,
          })
        })
      )

      renderWithProviders(<GamePage />)
      // Wait for initial 2-card draw to complete before clicking
      await screen.findByAltText('KING of HEARTS')

      await userEvent.click(screen.getByRole('button', { name: /draw card/i }))

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /draw card/i })).not.toBeInTheDocument()
      })
      expect(screen.getByText(/VALUE MATCHES:/)).toBeInTheDocument()
      expect(screen.getByText(/SUIT MATCHES:/)).toBeInTheDocument()
    })
  })

  describe('error handling', () => {
    it('shows an error toast when deck initialisation fails', async () => {
      const { toast } = await import('sonner')
      server.use(
        http.get('https://deckofcardsapi.com/api/deck/new/shuffle/', () =>
          HttpResponse.error()
        )
      )

      renderWithProviders(<GamePage />)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Failed to load deck',
          expect.objectContaining({ description: expect.any(String) })
        )
      })
    })

    it('shows an error toast when drawing a card fails', async () => {
      const { toast } = await import('sonner')
      server.use(
        http.get(`https://deckofcardsapi.com/api/deck/${MOCK_DECK_ID}/draw/`, ({ request }) => {
          const count = parseInt(new URL(request.url).searchParams.get('count') ?? '1', 10)
          if (count === 2) {
            return HttpResponse.json({
              cards: [makeCard('AS', 'ACE', 'SPADES'), makeCard('KH', 'KING', 'HEARTS')],
              remaining: 50,
            })
          }
          return HttpResponse.error()
        })
      )

      renderWithProviders(<GamePage />)
      // Wait for initial 2-card draw before clicking
      await screen.findByAltText('KING of HEARTS')

      await userEvent.click(screen.getByRole('button', { name: /draw card/i }))

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Failed to draw card',
          expect.objectContaining({ description: expect.any(String) })
        )
      })
    })
  })
})
