import type { Card } from '@/api/deckApi'
import { Skeleton } from '@/components/ui/skeleton'

interface CardSlotProps {
  card: Card | null
  label: string
  isLoading?: boolean
}

export function CardSlot({ card, label, isLoading = false }: CardSlotProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      {isLoading ? (
        <Skeleton className="w-28 h-40 rounded" />
      ) : card ? (
        <img
          src={card.image}
          alt={`${card.value} of ${card.suit}`}
          className="w-28 h-auto rounded shadow-md"
        />
      ) : (
        <div className="w-28 h-40 rounded border-2 border-dashed border-muted-foreground/40 bg-muted/20" />
      )}
    </div>
  )
}
