import { useEffect, useState } from 'react';

/**
 * Custom hook for debouncing a value.
 * Useful for search inputs or other high-frequency changes that
 * should trigger a side effect after a delay.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
