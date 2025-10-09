// SPDX-License-Identifier: AGPL-3.0-or-later
import { useDebounceFn } from "@vueuse/core";

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
