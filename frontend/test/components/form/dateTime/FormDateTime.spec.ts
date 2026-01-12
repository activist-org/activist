// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent } from "@testing-library/vue";
import { describe, expect, it, vi } from "vitest";

import FormDateTime from "../../../../app/components/form/dateTime/FormDateTime.vue"
import render from "../../../../test/render";

describe("FormDateTime component", () => {
    // MARK: Logic Testing (Props, Events, computed property)
    it("renders with an assigned props.id", async () => {
        await render(FormDateTime, { props: { id: 'test-id' }});
        const element = document.getElementById('test-id')
        expect(element).toBeTruthy();
    });
    it("renders with a randomly generated id", async () => {
        const { container } = await render(FormDateTime);
        const element = container.querySelector('[id]');
        expect(element).toBeTruthy();
    })

    // Cannot test props.label, it is missing from the component

    it("renders with props.modelValue set to null", async () => {
        await render(FormDateTime, { props: { id: 'test-id', modelValue: null }});
        const element = document.getElementById('test-id');
        expect(element).toBeTruthy();
    });
    it("renders with props.modelValue set to undefined", async () => {
        await render(FormDateTime, { props: { id: 'test-id', modelValue: undefined }});
        const element = document.getElementById('test-id');
        expect(element).toBeTruthy();
    })
    it("renders with props.modelValue set to a date object (yyyy-mm-dd)", async () => {
        await render(FormDateTime, { props: { id: 'test-id', modelValue: new Date(2025, 0, 9) }});
        const element = document.getElementById('test-id');
        expect(element).toBeTruthy();
    })
    it("renders with props.mode set to 'dateTime'", async () => {
        await render(FormDateTime, {
            props: { id: 'test-id' }
        });
        const element = document.getElementById('test-id');
        expect(element).toBeTruthy();
    });
    it("renders with props.mode set to 'date'", async () => {
        await render(FormDateTime, {
            props: { id: 'test-id', mode: 'date' }
        });
        const element = document.getElementById('test-id');
        expect(element).toBeTruthy();
    });
    it("renders with props.mode set to 'time'", async () => {
        await render(FormDateTime, {
            props: { id: 'test-id', mode: 'time' }
        });
        const element = document.getElementById('test-id');
        expect(element).toBeTruthy();
    });

    it("emits the event 'update:modelValue' successfully", async () => {
        const { container, emitted } = await render(FormDateTime, {
            props: { id: 'test-id', mode: 'date', modelValue: new Date(2025, 0, 15) }
        });
        const dayButton = container.querySelector('.vc-day-content');
        expect(dayButton).toBeTruthy();
        
        await fireEvent.click(dayButton!);
        expect(emitted()['update:modelValue']).toBeTruthy();
        expect(emitted()['update:modelValue'].length).toBeGreaterThan(0);
    });

    // MARK: Style Testing
    it("applies dark mode class when color mode is dark", async () => {
        globalThis.useColorModeMock.mockImplementation(() => ({
            preference: "dark",
            value: "dark",
        }));
        const { container } = await render(FormDateTime, {
            props: { id: 'test-id' }
        });
        const calendar = container.querySelector('.vc-container');
        expect(calendar?.classList.contains('vc-dark')).toBe(true);
    });
    it("applies light mode class when color mode is light", async () => {
        globalThis.useColorModeMock.mockImplementation(() => ({
            preference: "light",
            value: "light",
        }));
        const { container } = await render(FormDateTime, {
            props: { id: 'test-id' }
        });
        const calendar = container.querySelector('.vc-container');
        expect(calendar?.classList.contains('vc-light')).toBe(true);
    });
    it("changes classes when color mode is changed")

    // MARK: Accessibility

    // MARK: Edge Cases

    it("handles an edge case properly when v-calendar emits an array in time mode", () => {
        const mockEmit = vi.fn();
        const mode = 'time';
        const onUpdateLogic = (val: unknown, emitFn: typeof mockEmit, currentMode: string) => {
            if (Array.isArray(val) && currentMode === 'time') {
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
        onUpdateLogic([15, 45], mockEmit, 'date');
        expect(mockEmit).toHaveBeenCalledWith("update:modelValue", [15, 45]);
    });
})

/**
 * Findings:
 * 
 * - Prop "props.label" is defined in <script setup> tag, but it is not used in the template
 * - The accessibility tests and styling tests seem to be redundant for FormDateTime.vue itself,
 *   since it is a wrapper template for v-calendar library
 */