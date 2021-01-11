import { useState, useEffect } from 'react';

export const useDebounce = (value: string, time: number) => {
  const [debouncedValue, setDebouncedValue] = useState<typeof value>('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, time);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, time]);

  return debouncedValue;
};
