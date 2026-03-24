import { act, renderHook } from '@testing-library/react'
import { useDelayedFlag } from './useDelayedFlag'

describe('useDelayedFlag', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns false immediately when active is true', () => {
    const { result } = renderHook(() => useDelayedFlag(true, 300))
    expect(result.current).toBe(false)
  })

  it('returns false immediately when active is false', () => {
    const { result } = renderHook(() => useDelayedFlag(false, 300))
    expect(result.current).toBe(false)
  })

  it('returns true after the delay elapses', () => {
    const { result } = renderHook(() => useDelayedFlag(true, 300))
    expect(result.current).toBe(false)

    act(() => { vi.advanceTimersByTime(300) })
    expect(result.current).toBe(true)
  })

  it('does not become true before the delay elapses', () => {
    const { result } = renderHook(() => useDelayedFlag(true, 300))

    act(() => { vi.advanceTimersByTime(299) })
    expect(result.current).toBe(false)
  })

  it('resets to false immediately when active becomes false', () => {
    const { result, rerender } = renderHook(
      ({ active }: { active: boolean }) => useDelayedFlag(active, 300),
      { initialProps: { active: true } }
    )
    act(() => { vi.advanceTimersByTime(300) })
    expect(result.current).toBe(true)

    rerender({ active: false })
    expect(result.current).toBe(false)
  })

  it('cancels the timer when active goes false before the delay', () => {
    const { result, rerender } = renderHook(
      ({ active }: { active: boolean }) => useDelayedFlag(active, 300),
      { initialProps: { active: true } }
    )

    act(() => { vi.advanceTimersByTime(200) })
    rerender({ active: false })

    act(() => { vi.advanceTimersByTime(200) })
    expect(result.current).toBe(false)
  })

  it('respects different delay values', () => {
    const { result } = renderHook(() => useDelayedFlag(true, 1000))

    act(() => { vi.advanceTimersByTime(999) })
    expect(result.current).toBe(false)

    act(() => { vi.advanceTimersByTime(1) })
    expect(result.current).toBe(true)
  })
})
