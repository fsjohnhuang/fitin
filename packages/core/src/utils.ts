/**
 * Creates a debounced version of the provided function.
 * The debounced function delays invoking fn until after wait milliseconds
 * have elapsed since the last time it was invoked.
 * @param fn - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns A debounced version of the function
 * @example
 * const debouncedFn = debounce(fn, 100);
 * window.addEventListener('resize', debouncedFn);
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return function (...args: Parameters<T>): void {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = undefined;
    }, wait);
  };
}

/**
 * Creates a memoized version of the provided function.
 * The memoized function caches the return value for each set of arguments
 * and returns the cached value when called with the same arguments.
 * @param fn - The function to memoize
 * @returns A memoized version of the function
 * @example
 * const memoizedFn = memoize((n: number) => expensiveCalc(n));
 * memoizedFn(1); // computes and caches
 * memoizedFn(1); // returns cached value
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  max = 1000,
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();

  return function (...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    if (cache.size > max) {
      cache.clear();
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Creates a throttled version of the provided function.
 * The throttled function invokes fn at most once per every wait milliseconds.
 * @param fn - The function to throttle
 * @param wait - The number of milliseconds between invocations
 * @returns A throttled version of the function
 * @example
 * const throttledFn = throttle(fn, 100);
 * window.addEventListener('scroll', throttledFn);
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: undefined | Parameters<T> = undefined;
  let lastTime: number | undefined;

  let disposeTimeout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
      lastArgs = undefined;
    }
  };

  return function (...args: Parameters<T>): void {
    const now = Date.now();
    if (lastTime === undefined || now - lastTime >= wait) {
      disposeTimeout();

      lastTime = now;
      fn(...args);
    } else {
      lastArgs = args;
      let timeout = wait - (now - lastTime);
      let callback = () => {
        lastArgs ? fn(...lastArgs) : fn();
        disposeTimeout();
      };
      if (timeout <= 20) {
        callback();
      } else if (!timeoutId) {
        timeoutId = setTimeout(callback, timeout);
      }
    }
  };
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function computeAspectRatio(
  width: number,
  height: number,
): { width: number; height: number } {
  const divisor = gcd(width, height);

  return {
    width: width / divisor,
    height: height / divisor,
  };
}

export function assign(target: object, ...sources: object[]) {
  const cleanSources = sources.map((source) =>
    Object.fromEntries(
      Object.entries(source).filter(([_, value]) => value !== undefined),
    ),
  );
  return Object.assign(target, ...cleanSources);
}
