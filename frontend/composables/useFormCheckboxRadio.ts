import { useDebounceFn } from "@vueuse/core";
import { ref, watch } from "vue";

interface Props {
  modelValue: string | string[];
}

export default function useFormCheckboxRadio(
  props: Props,
  emit: (event: string, ...args: any[]) => void
) {
  const selectedValue = ref<string | string[]>(props.modelValue);
  const customValue = ref<string>("");
  const showAdditionalInput = ref<boolean>(false);

  const updateValue = (value: string | string[]) => {
    console.log(value, "updateValue");

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

  function emitValue() {
    const val = showAdditionalInput.value
      ? customValue.value
      : selectedValue.value;

    if (!val) {
      return;
    }
    emit("update:modelValue", val);
  }

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
    () => props.modelValue,
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
    emitValue,
    toggleAdditionalInput,
    toggleCheckbox,
  };
}
