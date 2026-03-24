import { useEffect, useState } from 'react'

export function useDelayedFlag(active: boolean, delayMs: number): boolean {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!active) return

    const timer = setTimeout(() => setShow(true), delayMs)
    return () => {
      clearTimeout(timer)
      setShow(false)
    }
  }, [active, delayMs])

  return show
}
