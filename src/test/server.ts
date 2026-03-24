import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import type { Card } from '@/api/deckApi'

export const MOCK_DECK_ID = 'test-deck-id'

export function makeCard(code: string, value: string, suit: string): Card {
  return { code, image: `https://deckofcardsapi.com/static/img/${code}.png`, value, suit }
}

// A fixed sequence of 52 distinct cards used by default draw handler
const CARD_SEQUENCE: Card[] = [
  makeCard('AS', 'ACE', 'SPADES'),
  makeCard('KH', 'KING', 'HEARTS'),
  makeCard('QD', 'QUEEN', 'DIAMONDS'),
  makeCard('JC', 'JACK', 'CLUBS'),
  makeCard('0S', '10', 'SPADES'),
  makeCard('9H', '9', 'HEARTS'),
  makeCard('8D', '8', 'DIAMONDS'),
  makeCard('7C', '7', 'CLUBS'),
  makeCard('6S', '6', 'SPADES'),
  makeCard('5H', '5', 'HEARTS'),
  makeCard('4D', '4', 'DIAMONDS'),
  makeCard('3C', '3', 'CLUBS'),
  makeCard('2S', '2', 'SPADES'),
  ...Array.from({ length: 39 }, (_, i) => makeCard(`X${i}`, `V${i}`, 'CLUBS')),
]

let drawCursor = 0

export function resetDrawCursor() {
  drawCursor = 0
}

export const handlers = [
  http.get('https://deckofcardsapi.com/api/deck/new/shuffle/', () =>
    HttpResponse.json({ deck_id: MOCK_DECK_ID, remaining: 52, shuffled: true })
  ),

  http.get('https://deckofcardsapi.com/api/deck/:deckId/draw/', ({ request }) => {
    const url = new URL(request.url)
    const count = parseInt(url.searchParams.get('count') ?? '1', 10)
    const cards = CARD_SEQUENCE.slice(drawCursor, drawCursor + count)
    drawCursor += count
    const remaining = Math.max(0, 52 - drawCursor)
    return HttpResponse.json({ cards, remaining })
  }),
]

export const server = setupServer(...handlers)
