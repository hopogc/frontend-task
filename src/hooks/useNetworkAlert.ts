import { useEffect } from 'react'
import { toast } from 'sonner'

export function useNetworkAlert() {
  useEffect(() => {
    const handleOffline = () => {
      toast.error('No internet connection', {
        description: 'Please check your network and try again.',
        duration: Infinity,
        id: 'network-offline',
      })
    }

    const handleOnline = () => {
      toast.dismiss('network-offline')
      toast.success('Connection restored')
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    if (!navigator.onLine) handleOffline()

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])
}
