import type { Card } from '@/api/deckApi'

interface CardSlotProps {
  card: Card | null
  label: string
}

export function CardSlot({ card, label }: CardSlotProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      {card ? (
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
