type FormInputRef = { $el?: HTMLElement };

/**
 * Composable to manage a wrapper ref used by Headless UI when using as="div",
 * forwarding setSelectionRange calls to the actual input element inside a
 * custom FormTextInput component and caching that actual input element.
 */
export function useComboboxInput() {
  const formInputRef = ref<FormInputRef>(null);
  const actualInputRef = ref<HTMLInputElement | null>(null);

  function setupInputWrapper(el: unknown) {
    if (!el) return;

    // Get the actual DOM element (could be component instance or DOM element).
    const element = ((el as { $el?: HTMLElement })?.$el || el) as HTMLElement & {
      setSelectionRange?: (
        selectionStart: number,
        selectionEnd: number,
        selectionDirection?: "forward" | "backward" | "none"
      ) => void;
    };

    // Forward setSelectionRange to the actual input element.
    if (element && !element.setSelectionRange) {
      element.setSelectionRange = (
        selectionStart: number,
        selectionEnd: number,
        selectionDirection?: "forward" | "backward" | "none"
      ) => {
        // Use cached input reference if available, otherwise find it.
        let inputElement = actualInputRef.value;
        if (!inputElement && formInputRef.value?.$el) {
          inputElement = formInputRef.value.$el.querySelector(
            "input"
          ) as HTMLInputElement | null;
          if (inputElement) {
            actualInputRef.value = inputElement;
          }
        }

        if (
          inputElement &&
          typeof inputElement.setSelectionRange === "function"
        ) {
          try {
            inputElement.setSelectionRange(
              selectionStart,
              selectionEnd,
              selectionDirection
            );
          } catch {
            // Silently ignore if selection range can't be set.
          }
        }
      };
    }

    // Try to find and cache the input element immediately.
    nextTick(() => {
      if (formInputRef.value?.$el && !actualInputRef.value) {
        const inputElement = formInputRef.value.$el.querySelector(
          "input"
        ) as HTMLInputElement | null;
        if (inputElement) {
          actualInputRef.value = inputElement;
        }
      }
    });
  }

  // Watch for formInputRef changes and cache the input element immediately.
  watch(
    formInputRef,
    (newRef) => {
      if (newRef?.$el && !actualInputRef.value) {
        nextTick(() => {
          const inputElement = newRef.$el?.querySelector(
            "input"
          ) as HTMLInputElement | null;
          if (inputElement) {
            actualInputRef.value = inputElement;
          }
        });
      }
    },
    { immediate: true }
  );

  return {
    formInputRef,
    actualInputRef,
    setupInputWrapper,
  };
}
