interface GameSummaryProps {
  valueMatches: number
  suitMatches: number
}

export function GameSummary({ valueMatches, suitMatches }: GameSummaryProps) {
  return (
    <div className="text-center space-y-1">
      <p className="font-semibold text-foreground">VALUE MATCHES: {valueMatches}</p>
      <p className="font-semibold text-foreground">SUIT MATCHES: {suitMatches}</p>
    </div>
  )
}
