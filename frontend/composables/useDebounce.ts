export const useDebounce = () => {
  const debounce = <T extends (...args: unknown[]) => void>(
    callback: T,
    delay: number
  ) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback(...args);
        timeoutId = null;
      }, delay);
    };
  };

  return { debounce };
};
