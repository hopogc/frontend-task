import { useEffect, useState } from 'react'

export function useDelayedFlag(active: boolean, delayMs: number): boolean {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!active) {
      setShow(false)
      return
    }

    const timer = setTimeout(() => setShow(true), delayMs)
    return () => clearTimeout(timer)
  }, [active, delayMs])

  return show
}
