import { useEffect, useState } from 'react'

/**
 * Debounces a value by the given delay (default 500ms).
 * Useful for deferring API calls on user input.
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
