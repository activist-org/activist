// SPDX-License-Identifier: AGPL-3.0-or-later
import { useDebounceFn } from "@vueuse/core";

/**
 * Composable for handling form input updates with optional debouncing in the frontend application. This composable provides a function to update the model value based on user input events, with support for different input types such as text, checkbox, and radio buttons. The updateValue function processes the input event, determines the appropriate value to emit based on the input type, and emits an "update:modelValue" event with the new value. If debouncing is enabled, the input value will be emitted after a delay of 1000 milliseconds to prevent excessive updates during rapid user input. The composable returns the updateValue function for use in form components that require handling of user input with optional debouncing.
 * @param props An object containing the props passed to the component, which may include a value prop that is used to determine the value to emit for radio button inputs.
 * @param emit A function to emit events from the component, specifically used to emit the "update:modelValue" event with the new value when the input is updated.
 * @param isDebounceEnabled An optional boolean parameter that determines whether debouncing should be applied to the input updates, with a default value of false. If set to true, the input value will be emitted after a delay of 1000 milliseconds to prevent excessive updates during rapid user input.
 * @returns An object containing the updateValue function for handling input events and updating the model value, which can be used in form components to manage user input with optional debouncing functionality.
 */
export default function useFormInput(
  props: Record<string, unknown>,
  emit: (event: "update:modelValue", value: string | boolean) => void,
  isDebounceEnabled?: boolean
): { updateValue: (event: Event) => void } {
  const inputDebounce = useDebounceFn((val: string | boolean) => {
    emit("update:modelValue", val);
  }, 1000);

  const updateValue = (event: Event): void => {
    let val: string | boolean = (event.target as HTMLInputElement).value;

    if ((event.target as HTMLInputElement).type === "checkbox") {
      val = (event.target as HTMLInputElement).checked;
    }

    if ((event.target as HTMLInputElement).type === "radio") {
      val = String(props.value);
    }
    if ((event.target as HTMLInputElement).type === "text") {
      val = (event.target as HTMLInputElement).value;
    }
    if (isDebounceEnabled) {
      inputDebounce(val);
      return;
    }
    emit("update:modelValue", val);
  };

  return { updateValue };
}
