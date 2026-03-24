import { renderHook } from '@testing-library/react'
import { useNetworkAlert } from './useNetworkAlert'

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    dismiss: vi.fn(),
  },
}))

import { toast } from 'sonner'

describe('useNetworkAlert', () => {
  const mockToast = toast as {
    error: ReturnType<typeof vi.fn>
    success: ReturnType<typeof vi.fn>
    dismiss: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true, configurable: true })
  })

  it('does not fire any toast when online at mount', () => {
    renderHook(() => useNetworkAlert())
    expect(mockToast.error).not.toHaveBeenCalled()
  })

  it('fires error toast immediately when offline at mount', () => {
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true })
    renderHook(() => useNetworkAlert())
    expect(mockToast.error).toHaveBeenCalledWith(
      'No internet connection',
      expect.objectContaining({ id: 'network-offline' })
    )
  })

  it('fires error toast when offline event is dispatched', () => {
    renderHook(() => useNetworkAlert())
    window.dispatchEvent(new Event('offline'))
    expect(mockToast.error).toHaveBeenCalledWith(
      'No internet connection',
      expect.objectContaining({ id: 'network-offline', duration: Infinity })
    )
  })

  it('dismisses offline toast and shows success when online event is dispatched', () => {
    renderHook(() => useNetworkAlert())
    window.dispatchEvent(new Event('offline'))
    window.dispatchEvent(new Event('online'))
    expect(mockToast.dismiss).toHaveBeenCalledWith('network-offline')
    expect(mockToast.success).toHaveBeenCalledWith('Connection restored')
  })

  it('removes event listeners on unmount', () => {
    const { unmount } = renderHook(() => useNetworkAlert())
    unmount()
    window.dispatchEvent(new Event('offline'))
    expect(mockToast.error).not.toHaveBeenCalled()
  })
})
