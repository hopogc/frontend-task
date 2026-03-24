import { configureStore } from '@reduxjs/toolkit'
import { http, HttpResponse } from 'msw'
import { deckApi } from './deckApi'
import { server } from '@/test/server'

function makeTestStore() {
  return configureStore({
    reducer: { [deckApi.reducerPath]: deckApi.reducer },
    middleware: (getDefault) => getDefault().concat(deckApi.middleware),
  })
}

describe('deckApi', () => {
  describe('initDeck endpoint', () => {
    it('requests the shuffle endpoint with deck_count=1', async () => {
      let capturedUrl = ''
      server.use(
        http.get('https://deckofcardsapi.com/api/deck/new/shuffle/', ({ request }) => {
          capturedUrl = request.url
          return HttpResponse.json({ deck_id: 'abc', remaining: 52, shuffled: true })
        })
      )

      const store = makeTestStore()
      await store.dispatch(deckApi.endpoints.initDeck.initiate())

      expect(capturedUrl).toContain('deck_count=1')
    })

    it('returns deck_id and remaining from the response', async () => {
      server.use(
        http.get('https://deckofcardsapi.com/api/deck/new/shuffle/', () =>
          HttpResponse.json({ deck_id: 'my-deck', remaining: 52, shuffled: true })
        )
      )

      const store = makeTestStore()
      const result = await store.dispatch(deckApi.endpoints.initDeck.initiate())
      expect(result.data).toMatchObject({ deck_id: 'my-deck', remaining: 52 })
    })
  })

  describe('drawCard endpoint', () => {
    it('requests draw with count=1 by default', async () => {
      let capturedUrl = ''
      server.use(
        http.get('https://deckofcardsapi.com/api/deck/:deckId/draw/', ({ request }) => {
          capturedUrl = request.url
          return HttpResponse.json({ cards: [], remaining: 51 })
        })
      )

      const store = makeTestStore()
      await store.dispatch(deckApi.endpoints.drawCard.initiate({ deckId: 'test-deck' }))

      expect(capturedUrl).toContain('count=1')
    })

    it('requests draw with the specified count', async () => {
      let capturedUrl = ''
      server.use(
        http.get('https://deckofcardsapi.com/api/deck/:deckId/draw/', ({ request }) => {
          capturedUrl = request.url
          return HttpResponse.json({ cards: [], remaining: 50 })
        })
      )

      const store = makeTestStore()
      await store.dispatch(deckApi.endpoints.drawCard.initiate({ deckId: 'test-deck', count: 2 }))

      expect(capturedUrl).toContain('count=2')
    })

    it('includes the deck id in the URL', async () => {
      let capturedUrl = ''
      server.use(
        http.get('https://deckofcardsapi.com/api/deck/:deckId/draw/', ({ request }) => {
          capturedUrl = request.url
          return HttpResponse.json({ cards: [], remaining: 51 })
        })
      )

      const store = makeTestStore()
      await store.dispatch(deckApi.endpoints.drawCard.initiate({ deckId: 'specific-deck-id' }))

      expect(capturedUrl).toContain('specific-deck-id')
    })

    it('returns drawn cards in the response', async () => {
      server.use(
        http.get('https://deckofcardsapi.com/api/deck/:deckId/draw/', () =>
          HttpResponse.json({
            cards: [{ code: 'AS', image: 'img.png', value: 'ACE', suit: 'SPADES' }],
            remaining: 51,
          })
        )
      )

      const store = makeTestStore()
      const result = await store.dispatch(
        deckApi.endpoints.drawCard.initiate({ deckId: 'test-deck' })
      )

      expect(result.data?.cards).toHaveLength(1)
      expect(result.data?.cards[0]).toMatchObject({ value: 'ACE', suit: 'SPADES' })
    })
  })
})
