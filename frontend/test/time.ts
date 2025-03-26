// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Use to replace timers during an action or actions that trigger timers in a component.
 *
 * Needed to isolate fake timers from other test utils that use timers.  For example:
 * In @testing-library/vue": "8.1.0 the waitFor function will hang when timers are mocked.
 *
 * @param ms milliseconds to advance fake timers
 * @param fn action that triggers a timer in a component
 */
export async function fakeWait(ms: number, fn?: () => Promise<void>) {
  vi.useFakeTimers();
  if (fn) {
    await fn();
  }
  vi.advanceTimersByTime(ms);
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
}
