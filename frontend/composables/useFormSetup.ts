import { useDebounceFn } from "@vueuse/core";

export default function useFormInput(
  props: record<string, unknown>,
  emit: any,
  isDebounceEnabled?: boolean
): { updateValue: (event: event) => void } {
  const inputDebounce = useDebounceFn((val: any) => {
    emit("update:modelValue", val);
  }, 1000);

  const updateValue = (event: event): void => {
    let val: any = (event.target as htmlinputelement).value;

    if ((event.target as htmlinputelement).type === "checkbox") {
      val = (event.target as htmlinputelement).checked;
    }

    if ((event.target as htmlinputelement).type === "radio") {
      val = props.value;
    }
    if ((event.target as htmlinputelement).type === "text") {
      val = (event.target as htmlinputelement).value;
    }
    if (isDebounceEnabled) {
      inputDebounce(val);
      return;
    }
    emit("update:modelValue", val);
  };

  return { updateValue };
}
