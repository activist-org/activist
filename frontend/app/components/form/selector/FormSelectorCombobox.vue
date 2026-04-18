<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Combobox
    :id="id"
    v-model="internalSelectedOptions"
    @click.stop
    as="div"
    :disabled="disabled"
    :multiple="isMultiSelect"
  >
    <div class="relative">
      <ComboboxInput
        :ref="setupInputWrapper"
        v-slot="{ id: inputId, onBlur }"
        @click.stop
        as="div"
        class="flex"
      >
        <FormTextInput
          :id="inputId"
          ref="formInputRef"
          @update:modelValue="handleInput"
          :disabled="disabled"
          :label="label"
          :modelValue="query"
          :onBlur="onBlur"
        />
      </ComboboxInput>
      <ComboboxButton
        @click.stop.prevent
        :aria-label="label"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-text dark:text-cta-orange"
        type="button"
      >
        <Icon
          v-if="isMultiSelect ? true : !internalSelectedOptions"
          :name="IconMap.CHEVRON_EXPAND"
        />
        <Icon
          v-else
          @click.stop.prevent="internalSelectedOptions = null"
          :name="IconMap.X_LG"
        />
      </ComboboxButton>
      <ComboboxOptions
        :id="`${id}-options`"
        class="elem-shadow-lg z-100 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-layer-1 text-base ring-1 ring-black/5 focus:outline-none sm:text-sm"
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
              {{ option.label }}
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
        <li
          v-if="infinite"
          ref="sentinel"
          class="flex justify-center py-2 pl-10 pr-4 text-sm text-gray-500"
        >
          <slot v-if="showLoadingSlot" name="loading">
            {{ $t("i18n.components.form_selector_combobox.loading") }}
          </slot>
        </li>
      </ComboboxOptions>
    </div>
    <ul
      v-if="
        internalSelectedOptions &&
        Array.isArray(internalSelectedOptions) &&
        internalSelectedOptions.length > 0 &&
        isMultiSelect
      "
      class="mt-2 flex"
      :class="{
        'flex-col space-y-2': hasColOptions,
        'space-x-1': !hasColOptions,
      }"
    >
      <li v-for="option in internalSelectedOptions" :key="option.id">
        <Shield
          :key="option.id + '-selected-only'"
          @click.stop="() => onClick(option)"
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
  isMultiSelect?: boolean;
  infinite?: boolean;
  fetchMore?: () => void;
  canFetchMore?: boolean;
  threshold?: number | number[];
  rootMargin?: string;
  showLoadingSlot?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  hasColOptions: true,
  infinite: false,
  canFetchMore: true,
  threshold: 0.1,
  rootMargin: "0px",
  showLoadingSlot: true,
  isMultiSelect: true,
});

const emit = defineEmits<{
  (e: "update:selectedOptions", value: unknown[]): void;
  (e: "update:filterValue", value: string): void;
  (e: "load-more"): void;
  (e: "update:selectedOption", value: unknown): void;
}>();

const query = ref("");
const sentinel = ref(null);
const formInputRef = ref<{ $el?: HTMLElement } | null>(null);
const actualInputRef = ref<HTMLInputElement | null>(null);

/**
 * Sets up the input wrapper for the ComboboxInput component. This function is responsible for ensuring that the actual input element within the ComboboxInput is accessible and can have its selection range set properly. It checks if the provided element has a setSelectionRange method, and if not, it attempts to find the input element within the ComboboxInput's $el and assigns it to actualInputRef. This allows for proper handling of text selection within the input field, even when using a custom wrapper component.
 * @param el The element reference passed from the ComboboxInput component. This can be either the element itself or an object containing a $el property that references the actual DOM element. The function processes this reference to ensure that the input element is correctly identified and can be manipulated for text selection purposes.
 */
function setupInputWrapper(el: unknown) {
  if (!el) return;
  const element = ((el as { $el?: HTMLElement })?.$el || el) as HTMLElement & {
    setSelectionRange?: (
      selectionStart: number,
      selectionEnd: number,
      selectionDirection?: "forward" | "backward" | "none"
    ) => void;
  };

  if (element && !element.setSelectionRange) {
    element.setSelectionRange = (
      selectionStart: number,
      selectionEnd: number,
      selectionDirection?: "forward" | "backward" | "none"
    ) => {
      let inputElement = actualInputRef.value;
      if (!inputElement && formInputRef.value?.$el) {
        inputElement = formInputRef.value.$el.querySelector(
          "input"
        ) as HTMLInputElement | null;
        if (inputElement) actualInputRef.value = inputElement;
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
          /* ignore */
        }
      }
    };
  }
}

watch(
  formInputRef,
  (newRef) => {
    if (newRef?.$el && !actualInputRef.value) {
      nextTick(() => {
        const inputElement = newRef.$el?.querySelector(
          "input"
        ) as HTMLInputElement | null;
        if (inputElement) actualInputRef.value = inputElement;
      });
    }
  },
  { immediate: true }
);

const enabled = computed(() => props.infinite);
const canFetchMoreRef = computed(() => props.canFetchMore);

const handleFetchMore = () => {
  if (props.fetchMore) props.fetchMore();
  else emit("load-more");
};

useCustomInfiniteScroll({
  sentinel,
  fetchMore: handleFetchMore,
  canFetchMore: canFetchMoreRef,
  enabled,
  threshold: props.threshold,
  rootMargin: props.rootMargin,
});

const onClick = (option: Option) => {
  if (
    internalSelectedOptions.value &&
    Array.isArray(internalSelectedOptions.value)
  ) {
    internalSelectedOptions.value = internalSelectedOptions.value.filter(
      (o: Option) => o.id !== option.id
    );
  }
};

const handleInput = (val: string) => {
  query.value = val;
  emit("update:filterValue", val);
};

const filteredOptions = computed(() =>
  query.value !== ""
    ? props.options.filter((option: Option) =>
        option.label.toLowerCase().includes(query.value.toLowerCase())
      )
    : props.options
);

const internalSelectedOptions = computed({
  get() {
    const selected = props.options.filter((option: Option) =>
      (props.selectedOptions as unknown[]).includes(option.value)
    );
    if (!props.isMultiSelect) return selected.length > 0 ? selected[0] : null;
    return selected;
  },
  set(newOptions) {
    if (props.isMultiSelect) {
      const values = (newOptions as Option[]).map((option) => option.value);
      if (JSON.stringify(values) !== JSON.stringify(props.selectedOptions)) {
        emit("update:selectedOptions", values);
      }
      return;
    }
    const option = newOptions as unknown as Option | null;
    const value = option?.value || null;
    query.value = option?.label || "";
    if (value !== (props.selectedOptions as unknown[])[0]) {
      emit("update:selectedOption", value);
    }
  },
});

watch(
  internalSelectedOptions,
  (newVal) => {
    if (!props.isMultiSelect && newVal) {
      const option = newVal as Option;
      if (option.label && query.value !== option.label) {
        query.value = option.label;
      }
    }
  },
  { immediate: true }
);
</script>
