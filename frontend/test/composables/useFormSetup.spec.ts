// SPDX-License-Identifier: AGPL-3.0-or-later
import { useDebounceFn } from "@vueuse/core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import useFormInput from "~/app/composables/useFormSetup";

const debounceRunnerMock = vi.fn<(value: string | boolean) => void>();
let capturedDebounceCallback: ((value: string | boolean) => void) | null = null;

vi.mock("@vueuse/core", () => ({
  useDebounceFn: vi.fn((callback: (value: string | boolean) => void) => {
    capturedDebounceCallback = callback;
    return debounceRunnerMock;
  }),
}));

const useDebounceFnSpy = vi.mocked(useDebounceFn);

const buildInputEvent = (target: Partial<HTMLInputElement>): Event =>
  ({
    target: target as HTMLInputElement,
  }) as unknown as Event;

describe("useFormSetup", () => {
  const emit = vi.fn();

  beforeEach(() => {
    emit.mockClear();
    useDebounceFnSpy.mockClear();
    debounceRunnerMock.mockClear();
    capturedDebounceCallback = null;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("emits updated value for text inputs immediately when debounce disabled", () => {
    const { updateValue } = useFormInput({}, emit, false);
    const event = buildInputEvent({
      type: "text",
      value: "Activist",
    });

    updateValue(event);

    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith("update:modelValue", "Activist");
    expect(debounceRunnerMock).not.toHaveBeenCalled();
  });

  it("emits boolean state for checkbox inputs", () => {
    const { updateValue } = useFormInput({}, emit);
    const event = buildInputEvent({
      type: "checkbox",
      checked: true,
      value: "ignored",
    });

    updateValue(event);

    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith("update:modelValue", true);
  });

  it("emits props.value for radio inputs", () => {
    const props = { value: "radio-choice" };
    const { updateValue } = useFormInput(props, emit);
    const event = buildInputEvent({
      type: "radio",
      value: "unused",
    });

    updateValue(event);

    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith("update:modelValue", "radio-choice");
  });

  it("debounces updates when enabled and emits after debounce callback executes", () => {
    const { updateValue } = useFormInput({}, emit, true);
    const event = buildInputEvent({
      type: "text",
      value: "delayed",
    });

    updateValue(event);

    expect(debounceRunnerMock).toHaveBeenCalledTimes(1);
    expect(debounceRunnerMock).toHaveBeenCalledWith("delayed");
    expect(emit).not.toHaveBeenCalled();
    expect(typeof capturedDebounceCallback).toBe("function");

    capturedDebounceCallback?.("delayed");
    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith("update:modelValue", "delayed");
  });
});
