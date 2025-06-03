import { useEffect, RefObject } from 'react'

interface UseClickOutsideOptions {
  ref: RefObject<HTMLElement | null>
  handler: () => void
  enabled?: boolean
}

export const useClickOutside = ({ ref, handler, enabled = true }: UseClickOutsideOptions) => {
  useEffect(() => {
    if (!enabled) return

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, handler, enabled])
}
