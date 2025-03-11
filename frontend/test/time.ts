export function fakeWait(ms: number, fn?: () => Promise<void>) {
  vi.useFakeTimers();
  if (fn) {
    fn();
  }
  vi.advanceTimersByTime(ms);
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
}
