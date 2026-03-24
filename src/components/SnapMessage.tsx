import { Badge } from '@/components/ui/badge'

interface SnapMessageProps {
  snapValue: boolean
  snapSuit: boolean
}

export function SnapMessage({ snapValue, snapSuit }: SnapMessageProps) {
  if (!snapValue && !snapSuit) return null

  const message = snapValue ? 'SNAP VALUE!' : 'SNAP SUIT!'

  return (
    <Badge className="text-base px-4 py-1.5 animate-bounce">
      {message}
    </Badge>
  )
}
