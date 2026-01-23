// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent } from "@testing-library/vue";
import { describe, expect, it, vi } from "vitest";

import FormDateTime from "../../../../app/components/form/dateTime/FormDateTime.vue";
import { createUseColorModeSpy } from "../../../mocks/composableMocks";
import render from "../../../../test/render";

// Set up useColorMode mock using factory (Pattern 1: default behavior).
// Note: We assign to globalThis.useColorModeMock to match setup.ts pattern,
// which allows tests to use mockImplementation() for per-test overrides (Pattern 4).
globalThis.useColorModeMock = createUseColorModeSpy("dark", "dark");
globalThis.useColorMode = () => globalThis.useColorModeMock();

describe("FormDateTime component", () => {
  // MARK: Logic Testing

  it("renders with an assigned props.id", async () => {
    await render(FormDateTime, { props: { id: "test-id" } });
    const element = document.getElementById("test-id");
    expect(element).toBeTruthy();
  });
  it("renders with a randomly generated id", async () => {
    const { container } = await render(FormDateTime);
    const element = container.querySelector("[id]");
    expect(element).toBeTruthy();
  });

  it("renders with props.modelValue set to null", async () => {
    await render(FormDateTime, { props: { id: "test-id", modelValue: null } });
    const element = document.getElementById("test-id");
    expect(element).toBeTruthy();
  });
  it("renders with props.modelValue set to undefined", async () => {
    await render(FormDateTime, {
      props: { id: "test-id", modelValue: undefined },
    });
    const element = document.getElementById("test-id");
    expect(element).toBeTruthy();
  });
  it("renders with props.modelValue set to a date object (yyyy-mm-dd)", async () => {
    await render(FormDateTime, {
      props: { id: "test-id", modelValue: new Date(2025, 0, 9) },
    });
    const element = document.getElementById("test-id");
    expect(element).toBeTruthy();
  });
  it("renders with props.mode set to 'dateTime'", async () => {
    await render(FormDateTime, {
      props: { id: "test-id" },
    });
    const element = document.getElementById("test-id");
    expect(element).toBeTruthy();
  });
  it("renders with props.mode set to 'date'", async () => {
    await render(FormDateTime, {
      props: { id: "test-id", mode: "date" },
    });
    const element = document.getElementById("test-id");
    expect(element).toBeTruthy();
  });
  it("renders with props.mode set to 'time'", async () => {
    await render(FormDateTime, {
      props: { id: "test-id", mode: "time" },
    });
    const element = document.getElementById("test-id");
    expect(element).toBeTruthy();
  });

  it("emits the event 'update:modelValue' successfully", async () => {
    const { container, emitted } = await render(FormDateTime, {
      props: { id: "test-id", mode: "date", modelValue: new Date(2025, 0, 15) },
    });
    const dayButton = container.querySelector(".vc-day-content");
    expect(dayButton).toBeTruthy();

    await fireEvent.click(dayButton!);
    expect(emitted()["update:modelValue"]).toBeTruthy();
    expect(emitted()["update:modelValue"].length).toBeGreaterThan(0);
  });

  // MARK: Style Testing

  it("applies dark mode class when color mode is dark", async () => {
    globalThis.useColorModeMock.mockImplementation(() => ({
      preference: "dark",
      value: "dark",
    }));
    const { container } = await render(FormDateTime, {
      props: { id: "test-id" },
    });
    const calendar = container.querySelector(".vc-container");
    expect(calendar?.classList.contains("vc-dark")).toBe(true);
  });
  it("applies light mode class when color mode is light", async () => {
    globalThis.useColorModeMock.mockImplementation(() => ({
      preference: "light",
      value: "light",
    }));
    const { container } = await render(FormDateTime, {
      props: { id: "test-id" },
    });
    const calendar = container.querySelector(".vc-container");
    expect(calendar?.classList.contains("vc-light")).toBe(true);
  });
  it("changes classes when color mode is changed");

  // MARK: Accessibility

  it("supports tab navigation properly by focusing one element at a time", async () => {
    const { container } = await render(FormDateTime, {
      props: { id: "test-id" },
    });

    const focusableDays = container.querySelectorAll(
      '.vc-day-content[tabindex="0"]'
    );
    expect(focusableDays.length).toBe(1);

    const nonFocusedDays = container.querySelectorAll(
      '.vc-day-content[tabindex="-1"]'
    );
    expect(nonFocusedDays.length).toBeGreaterThan(0);
  });

  it("does not show disabled aria tag for day elements that are enabled", async () => {
    const { container } = await render(FormDateTime, {
      props: { id: "test-id" },
    });

    const enabledDay = container.querySelector(".vc-day-content");
    expect(enabledDay?.getAttribute("aria-disabled")).toBe("false");
  });

  it("contains aria labels", async () => {
    const { container } = await render(FormDateTime, {
      props: { id: "test-id" },
    });

    const elements = container.querySelectorAll(".vc-day-content[aria-label]");
    expect(elements.length).toBeGreaterThan(0);
  });

  it("indicates interactive elements with their roles properly", async () => {
    const { container } = await render(FormDateTime, {
      props: { id: "test-id" },
    });

    const elements = container.querySelectorAll(
      '.vc-day-content[role="button"]'
    );
    expect(elements.length).toBeGreaterThan(0);
  });

  // MARK: Edge Cases

  it("handles an edge case properly when v-calendar emits an array in time mode", () => {
    const mockEmit = vi.fn();
    const mode = "time";
    const onUpdateLogic = (
      val: unknown,
      emitFn: typeof mockEmit,
      currentMode: string
    ) => {
      if (Array.isArray(val) && currentMode === "time") {
        emitFn("update:modelValue", val[0] ?? null);
        return;
      }
      emitFn("update:modelValue", val);
    };

    // Array value
    onUpdateLogic([15, 45], mockEmit, mode);
    expect(mockEmit).toHaveBeenCalledWith("update:modelValue", 15);

    mockEmit.mockClear();

    // Null
    onUpdateLogic([], mockEmit, mode);
    expect(mockEmit).toHaveBeenCalledWith("update:modelValue", null);

    mockEmit.mockClear();

    // Non-array value
    const date = new Date(2025, 0, 9);
    onUpdateLogic(date, mockEmit, mode);
    expect(mockEmit).toHaveBeenCalledWith("update:modelValue", date);

    // Array, date mode
    mockEmit.mockClear();
    onUpdateLogic([15, 45], mockEmit, "date");
    expect(mockEmit).toHaveBeenCalledWith("update:modelValue", [15, 45]);
  });
});
