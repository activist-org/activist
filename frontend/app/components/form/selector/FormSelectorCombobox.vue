<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Combobox :id="id" v-model="internalSelectedOptions" as="div" multiple>
    <div class="relative">
      <ComboboxInput
        :ref="setupInputWrapper"
        v-slot="{ id: inputId, onBlur }"
        as="div"
        class="flex"
      >
        <FormTextInput
          :id="inputId"
          :ref="
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (el: any) => {
              formInputRef = el;
            }
          "
          @update:modelValue="(val) => (query = val)"
          :label="label"
          :modelValue="query"
          :onBlur="onBlur"
          :placeholder="label"
        />
      </ComboboxInput>
      <!-- Minimal visible button to open combobox for programmatic control -->
      <ComboboxButton
        :aria-label="label"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-text dark:text-cta-orange"
      >
        <Icon :name="IconMap.CHEVRON_EXPAND" />
      </ComboboxButton>
      <ComboboxOptions
        :id="`${id}-options`"
        class="elem-shadow-lg absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-layer-1 text-base ring-1 ring-black/5 focus:outline-none sm:text-sm"
      >
        <ComboboxOption
          v-for="option in filteredOptions"
          :key="option.id"
          v-slot="{ selected, active }"
          as="template"
          :value="option"
        >
          <li
            class="relative cursor-default select-none py-2 pl-10 pr-4"
            :class="{
              'bg-cta-orange/80 text-primary-text dark:bg-cta-orange/40 dark:text-cta-orange':
                active,
              'text-primary-text': !active,
            }"
          >
            <span class="block truncate">
              {{ $t(option.label) }}
            </span>
            <span
              v-if="selected"
              class="absolute inset-y-0 left-0 flex items-center pl-3"
              :class="{
                'text-primary-text dark:text-cta-orange': active,
                'text-cta-orange dark:text-cta-orange': !active,
              }"
            >
              <Icon :name="IconMap.CHECK" />
            </span>
          </li>
        </ComboboxOption>
      </ComboboxOptions>
    </div>
    <ul
      v-if="internalSelectedOptions.length > 0"
      class="mt-2 flex"
      :class="{
        'flex-col space-y-2': hasColOptions,
        'space-x-1': !hasColOptions,
      }"
    >
      <li v-for="option in internalSelectedOptions" :key="option.id">
        <Shield
          :key="option.id + '-selected-only'"
          @click="() => onClick(option)"
          :active="true"
          class="mobileTopic max-sm:w-full"
          :icon="IconMap.GLOBE"
          :isSelector="true"
          :label="option.label"
        />
      </li>
    </ul>
  </Combobox>
</template>

<script setup lang="ts">
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue";

interface Option {
  id: number | string;
  label: string;
  value: unknown;
}

interface Props {
  options: Option[];
  selectedOptions: unknown[];
  id: string;
  label: string;
  hasColOptions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  hasColOptions: true,
});
const query = ref("");
const formInputRef = ref<{ $el?: HTMLElement } | null>(null);
// Use any type to avoid strict Headless UI type conflicts with DOM types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const actualInputRef = ref<any>(null);

// Workaround: Headless UI tries to call setSelectionRange on the wrapper div
// when using as="div", but divs don't have this method. We forward the call
// to the actual input element inside FormTextInput.
function setupInputWrapper(el: unknown) {
  if (!el) return;

  // Get the actual DOM element (could be component instance or DOM element)
  const element = ((el as { $el?: HTMLElement })?.$el || el) as HTMLElement & {
    setSelectionRange?: (
      selectionStart: number,
      selectionEnd: number,
      selectionDirection?: "forward" | "backward" | "none"
    ) => void;
  };

  // Forward setSelectionRange to the actual input element
  if (element && !element.setSelectionRange) {
    element.setSelectionRange = (
      selectionStart: number,
      selectionEnd: number,
      selectionDirection?: "forward" | "backward" | "none"
    ) => {
      // Use cached input reference if available, otherwise find it
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
          // Silently ignore if selection range can't be set
        }
      }
    };
  }

  // Try to find and cache the input element immediately
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

// Watch for formInputRef changes and cache the input element immediately
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

const onClick = (option: Option) => {
  internalSelectedOptions.value = internalSelectedOptions.value.filter(
    (o: Option) => o.id !== option.id
  );
};

const emit = defineEmits<{
  (e: "update:selectedOptions", value: unknown[]): void;
}>();

const filteredOptions = computed(() =>
  query.value !== ""
    ? props.options.filter((option: Option) =>
        option.label.toLowerCase().includes(query.value.toLowerCase())
      )
    : props.options
);

const internalSelectedOptions = computed({
  get() {
    if (props.selectedOptions && props.selectedOptions.length === 0) {
      return [];
    }
    // Always compute from prop.
    return props.options.filter((option: Option) =>
      (props.selectedOptions as unknown[]).includes(option.value)
    );
  },
  set(newOptions) {
    const values = (newOptions as Option[]).map((option) => option.value);
    // Only emit if value actually changed.
    if (JSON.stringify(values) !== JSON.stringify(props.selectedOptions)) {
      emit("update:selectedOptions", values);
    }
  },
});
</script>
