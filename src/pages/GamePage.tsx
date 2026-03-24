import { useEffect, useState } from 'react'
import { useInitDeckQuery, useLazyDrawCardQuery } from '@/api/deckApi'
import type { Card } from '@/api/deckApi'
import { CardSlot } from '@/components/CardSlot'
import { SnapMessage } from '@/components/SnapMessage'
import { GameSummary } from '@/components/GameSummary'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { useDelayedFlag } from '@/hooks/useDelayedFlag'

export function GamePage() {
  const [previousCard, setPreviousCard] = useState<Card | null>(null)
  const [currentCard, setCurrentCard] = useState<Card | null>(null)
  const [remaining, setRemaining] = useState(52)
  const [valueMatches, setValueMatches] = useState(0)
  const [suitMatches, setSuitMatches] = useState(0)
  const [snapValue, setSnapValue] = useState(false)
  const [snapSuit, setSnapSuit] = useState(false)

  const { data: deckData, isLoading: isDeckLoading } = useInitDeckQuery()
  const [triggerDraw, { isFetching }] = useLazyDrawCardQuery()

  useEffect(() => {
    if (!deckData?.deck_id) return
    triggerDraw({ deckId: deckData.deck_id, count: 2 }, false).then((result) => {
      if (!result.data) return
      const [first, second] = result.data.cards
      setPreviousCard(first)
      setCurrentCard(second)
      setRemaining(result.data.remaining)
    })
  }, [deckData?.deck_id])

  const handleDraw = async () => {
    if (!deckData?.deck_id) return

    const result = await triggerDraw({ deckId: deckData.deck_id }, false)
    if (!result.data) return

    const drawn = result.data.cards[0]
    const newRemaining = result.data.remaining

    const isSnapValue = currentCard !== null && drawn.value === currentCard.value
    const isSnapSuit = currentCard !== null && drawn.suit === currentCard.suit

    setPreviousCard(currentCard)
    setCurrentCard(drawn)
    setRemaining(newRemaining)
    setSnapValue(isSnapValue)
    setSnapSuit(isSnapSuit)
    if (isSnapValue) setValueMatches((n) => n + 1)
    if (isSnapSuit) setSuitMatches((n) => n + 1)
  }

  const isFinished = remaining === 0

  const isLoading = isDeckLoading || isFetching
  const showOverlay = useDelayedFlag(isLoading, 300)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LoadingOverlay visible={showOverlay} />

      <header className="px-6 py-4">
        <h1 className="text-2xl font-bold tracking-tight">SNAP!</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center gap-8 px-4">
        {isDeckLoading ? (
          <div className="flex gap-8 items-end">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="w-16 h-4 rounded" />
              <Skeleton className="w-28 h-40 rounded" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="w-16 h-4 rounded" />
              <Skeleton className="w-28 h-40 rounded" />
            </div>
          </div>
        ) : (
          <div className="flex gap-8 items-end">
            <CardSlot card={previousCard} label="Previous" />
            <CardSlot card={currentCard} label="Current" />
          </div>
        )}

        <div className="h-10 flex items-center justify-center">
          <SnapMessage snapValue={snapValue} snapSuit={snapSuit} />
        </div>

        {isFinished ? (
          <GameSummary valueMatches={valueMatches} suitMatches={suitMatches} />
        ) : (
          <Button
            onClick={handleDraw}
            disabled={isLoading}
            size="lg"
          >
            Draw card
          </Button>
        )}
      </main>
    </div>
  )
}
