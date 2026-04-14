// SPDX-License-Identifier: AGPL-3.0-or-later
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDebounce } from "../../app/composables/generic/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  it("returns a debounce function", () => {
    const { debounce } = useDebounce();

    expect(typeof debounce).toBe("function");
  });

  it("returns a wrapped function when debounce is called", () => {
    const callback = vi.fn();
    const { debounce } = useDebounce();

    const debounced = debounce(callback, 200);

    expect(typeof debounced).toBe("function");
  });

  it("does not call the callback immediately", () => {
    const callback = vi.fn();
    const { debounce } = useDebounce();
    const debounced = debounce(callback, 200);

    debounced();

    expect(callback).not.toHaveBeenCalled();
  });

  it("calls the callback after the specified delay", () => {
    const callback = vi.fn();
    const { debounce } = useDebounce();
    const debounced = debounce(callback, 200);

    debounced("save");

    vi.advanceTimersByTime(199);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("save");
  });

  it("clears the previous timeout when called again before delay expires", () => {
    const callback = vi.fn();
    const { debounce } = useDebounce();
    const debounced = debounce(callback, 200);

    debounced("first");
    vi.advanceTimersByTime(100);

    debounced("second");
    vi.advanceTimersByTime(199);

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("second");
  });

  it("uses only the latest arguments from rapid successive calls", () => {
    const callback = vi.fn();
    const { debounce } = useDebounce();
    const debounced = debounce(callback, 200);

    debounced("draft-1");
    debounced("draft-2");
    debounced("final-draft");

    vi.advanceTimersByTime(200);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("final-draft");
  });

  it("passes multiple arguments correctly", () => {
    const callback = vi.fn();
    const { debounce } = useDebounce();
    const debounced = debounce(callback, 200);

    debounced("rename", "/tmp/a.txt", "/tmp/b.txt");

    vi.advanceTimersByTime(200);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("rename", "/tmp/a.txt", "/tmp/b.txt");
  });

  it("supports multiple independent debounce cycles", () => {
    const callback = vi.fn();
    const { debounce } = useDebounce();
    const debounced = debounce(callback, 200);

    debounced("save-1");
    vi.advanceTimersByTime(200);

    debounced("save-2");
    vi.advanceTimersByTime(200);

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenNthCalledWith(1, "save-1");
    expect(callback).toHaveBeenNthCalledWith(2, "save-2");
  });

  it("works with a zero-millisecond delay", () => {
    const callback = vi.fn();
    const { debounce } = useDebounce();
    const debounced = debounce(callback, 0);

    debounced("instant");

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(0);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("instant");
  });

  it("does not call the callback if the timer has not fully elapsed", () => {
    const callback = vi.fn();
    const { debounce } = useDebounce();
    const debounced = debounce(callback, 300);

    debounced("pending");
    vi.advanceTimersByTime(299);

    expect(callback).not.toHaveBeenCalled();
  });

  it("debounces file operation scenarios and executes only the last operation", () => {
    const callback = vi.fn();
    const { debounce } = useDebounce();
    const debounced = debounce(callback, 250);

    debounced({ type: "save", path: "/docs/file.txt" });
    debounced({
      type: "rename",
      path: "/docs/file.txt",
      nextPath: "/docs/file-renamed.txt",
    });
    debounced({ type: "delete", path: "/docs/file-renamed.txt" });

    vi.advanceTimersByTime(250);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({
      type: "delete",
      path: "/docs/file-renamed.txt",
    });
  });

  it.skip("handles errors thrown by the callback without breaking the debounce", () => {
    const error = new Error("callback failed");
    const callback = vi.fn();

    callback.mockImplementationOnce(() => {
      throw error;
    });
    callback.mockImplementationOnce(() => {});

    const { debounce } = useDebounce();
    const debounced = debounce(callback, 100);

    debounced("save");
    vi.advanceTimersByTime(100);

    debounced("retry");
    vi.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenNthCalledWith(1, "save");
    expect(callback).toHaveBeenNthCalledWith(2, "retry");

    expect(callback.mock.results[0].type).toBe("throw");
    expect(callback.mock.results[0].value).toBe(error);

    expect(callback.mock.results[1].type).toBe("return");
  });

  it.skip("can be scheduled again after a callback error", () => {
    const error = new Error("first failure");
    const callback = vi.fn();

    callback.mockImplementationOnce(() => {
      throw error;
    });
    callback.mockImplementationOnce(() => {});
    callback.mockImplementationOnce(() => {});

    const { debounce } = useDebounce();
    const debounced = debounce(callback, 100);

    debounced("attempt-1");
    vi.advanceTimersByTime(100);

    debounced("attempt-2");
    vi.advanceTimersByTime(100);

    debounced("attempt-3");
    vi.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenNthCalledWith(1, "attempt-1");
    expect(callback).toHaveBeenNthCalledWith(2, "attempt-2");
    expect(callback).toHaveBeenNthCalledWith(3, "attempt-3");
  });

  it("maintains separate timeouts for different debounced functions", () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const { debounce } = useDebounce();

    const debounced1 = debounce(callback1, 100);
    const debounced2 = debounce(callback2, 200);

    debounced1("fn1");
    debounced2("fn2");

    vi.advanceTimersByTime(100);

    expect(callback1).toHaveBeenCalledWith("fn1");
    expect(callback2).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(callback2).toHaveBeenCalledWith("fn2");
  });

  it("accepts callbacks with any number of arguments", () => {
    const callback = vi.fn();
    const { debounce } = useDebounce();
    const debounced = debounce(callback, 100);

    debounced();
    debounced(1);
    debounced(1, 2);
    debounced(1, 2, 3);
    debounced(1, 2, 3, 4);

    vi.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(1, 2, 3, 4);
  });
});
