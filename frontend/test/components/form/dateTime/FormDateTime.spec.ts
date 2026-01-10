// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import FormDateTime from "../../../../app/components/form/dateTime/FormDateTime.vue"
import { useColor } from "../../../../app/composables/useColor";
import render from "../../../../test/render";

/**
 * TODO:
 * - Finish style testing
 * - Write accessibility tests
 * - Finish props testing (edge cases and mode & model value)
 * 
 */

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
        await render(FormDateTime, {
            props: {
                id: 'test-id',
                modelValue: null
            },
        });
        const element = document.getElementById('test-id');
        // Check if the component is rendered
        expect(element).toBeTruthy();
    });
    it("renders with props.modelValue set to undefined", async () => {
        await render(FormDateTime, {
            props: {
                id: 'test-id',
                modelValue: undefined
            },
        });
        const element = document.getElementById('test-id');
        expect(element).toBeTruthy();
    })
    it("renders with props.modelValue set to a date object (yyyy-mm-dd)", async () => {
        await render(FormDateTime, {
            props: {
                id: 'test-id',
                modelValue: new Date(2025, 0, 9)
            },
        });
        const element = document.getElementById('test-id');
        // Check if the component is rendered
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
            props: { id: 'test-id' }
        });
        const dayButton = container.querySelector('.vc-day-content');
        if(dayButton){
            await fireEvent.click(dayButton);
            expect(emitted()['update:modelValue']).toBeTruthy();
        }
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
        expect(calendar?.classList.contains('vc-dark')).toBe(true);
    });

    // MARK: Accessibility
    
    //it("has correct aria attributes");

    //it("has proper keyboard navigation");

    // MARK: Edge Cases
    
    //it("deals with edge cases on events as expected")
})