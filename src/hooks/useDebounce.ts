// ============================================
// useDebounce.ts - Debounce Hook for Search
// ============================================
import { useEffect, useState } from 'react';

/**
 * Debounce hook to delay execution of a value change
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns Debounced value
 * 
 * @example
 * ```tsx
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 500);
 * 
 * // Use debouncedSearch in your query
 * const { data } = useQuery({ search: debouncedSearch });
 * ```
 */
export const useDebounce = <T,>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout
    const debounceTimer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes before delay expires
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Alternative debounce hook with loading state
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns Object with debounced value and isDebouncing flag
 * 
 * @example
 * ```tsx
 * const [search, setSearch] = useState('');
 * const { debouncedValue, isDebouncing } = useDebouncedValue(search, 500);
 * 
 * // Show loading indicator while debouncing
 * {isDebouncing && <Spinner />}
 * ```
 */
export const useDebouncedValue = <T,>(
  value: T,
  delay: number = 500
): { debouncedValue: T; isDebouncing: boolean } => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    // Set debouncing to true when value changes
    setIsDebouncing(true);

    const debounceTimer = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [value, delay]);

  return { debouncedValue, isDebouncing };
};