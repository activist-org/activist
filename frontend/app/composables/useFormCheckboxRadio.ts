// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Composable for managing the state and behavior of checkbox and radio button inputs in a form within the frontend application. This composable provides reactive properties and functions to handle the selection of checkbox and radio button values, including support for multiple selections in the case of checkboxes. The composable manages the selected value(s), allows toggling of additional input fields for custom values, and emits updates to the parent component when the selection changes. It also includes a debounced function to emit updates after a delay when the user is typing in a custom input field. The composable returns these properties and functions for use in form components that require checkbox and radio button functionality.
 * @param value The initial value for the checkbox or radio button input, which can be a string for radio buttons or an array of strings for checkboxes, representing the selected value(s) when the component is initialized.
 * @param emit A function to emit events from the component, specifically used to emit the "update:modelValue" event with the new value when the selection changes or when a custom value is entered.
 * @returns An object containing reactive properties and functions for managing checkbox and radio button inputs, including selectedValue for tracking the current selection, updateValue for updating the selection, isSelected for checking if a value is selected, customValue for handling additional input values, showAdditionalInput for toggling the visibility of the additional input field, inputDebounce for debouncing updates from the custom input field, toggleAdditionalInput for toggling the additional input field, and toggleCheckbox for managing checkbox selections.
 */
export default function useFormCheckboxRadio(
  value: string | string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit: (event: "update:modelValue", ...args: any[]) => void
) {
  const selectedValue = ref<string | string[]>(value);
  const customValue = ref<string>("");
  const showAdditionalInput = ref<boolean>(false);

  const updateValue = (value: string | string[]) => {
    selectedValue.value = value;
    emitValue();
  };

  const isSelected = (value: string) => {
    if (Array.isArray(selectedValue.value)) {
      return selectedValue.value.includes(value);
    } else {
      return selectedValue.value === value;
    }
  };

  const inputDebounce = useDebounceFn(() => {
    emitValue();
  }, 1000);

  /**
   *
   */
  function emitValue() {
    const val = showAdditionalInput.value
      ? customValue.value
      : selectedValue.value;

    if (!val) {
      return;
    }
    emit("update:modelValue", val);
  }

  /**
   *
   */
  function toggleAdditionalInput() {
    showAdditionalInput.value = !showAdditionalInput.value;
    emitValue();
  }

  const toggleCheckbox = (value: string) => {
    if (!Array.isArray(selectedValue.value)) {
      selectedValue.value = [];
    }
    if (isSelected(value)) {
      const index = selectedValue.value.indexOf(value);
      if (index !== -1) {
        selectedValue.value.splice(index, 1);
      }
    } else {
      selectedValue.value.push(value);
    }

    updateValue(selectedValue.value);
  };

  watch(
    () => value,
    (newValue) => {
      selectedValue.value = newValue;
    }
  );

  return {
    selectedValue,
    updateValue,
    isSelected,
    customValue,
    showAdditionalInput,
    inputDebounce,
    toggleAdditionalInput,
    toggleCheckbox,
  };
}
