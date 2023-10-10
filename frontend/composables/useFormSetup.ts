import { useDebounceFn } from "@vueuse/core";

export default function useFormInput(
  props: Record<string, unknown>,
  emit: any,
  isDebounceEnabled?: boolean
): { updateValue: (event: Event) => void } {
  const inputDebounce = useDebounceFn((val: any) => {
    emit("update:modelValue", val);
  }, 1000);

  const updateValue = (event: Event): void => {
    let val: any = (event.target as HTMLInputElement).value;

    if ((event.target as HTMLInputElement).type === "checkbox") {
      val = (event.target as HTMLInputElement).checked;
    }

    if ((event.target as HTMLInputElement).type === "radio") {
      val = props.value;
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
