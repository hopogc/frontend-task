import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Card {
  code: string
  image: string
  value: string
  suit: string
}

interface DeckResponse {
  deck_id: string
  remaining: number
  shuffled: boolean
}

interface DrawResponse {
  cards: Card[]
  remaining: number
}

export const deckApi = createApi({
  reducerPath: 'deckApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://deckofcardsapi.com/api/' }),
  endpoints: (builder) => ({
    initDeck: builder.query<DeckResponse, void>({
      query: () => 'deck/new/shuffle/?deck_count=1',
    }),
    drawCard: builder.query<DrawResponse, string>({
      query: (deckId) => `deck/${deckId}/draw/?count=1`,
    }),
  }),
})

export const { useInitDeckQuery, useLazyDrawCardQuery } = deckApi
