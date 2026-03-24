import { Spinner } from '@/components/Spinner'

interface LoadingOverlayProps {
  visible: boolean
}

export function LoadingOverlay({ visible }: LoadingOverlayProps) {
  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <Spinner className="w-10 h-10 text-white" />
    </div>
  )
}
