<template>
  <Combobox :id="id" v-model="internalSelectedOptions" as="div" multiple>
    <div class="relative">
      <!-- Pass the setupInputWrapper function as the ref for the container -->
      <ComboboxInput
        :ref="setupInputWrapper"
        v-slot="{ id: inputId, onBlur }"
        as="div"
        class="flex"
      >
        <!--
          Bind directly to formInputRef.
          Vue automatically assigns the component instance to formInputRef.value
        -->
        <FormTextInput
          :id="inputId"
          ref="formInputRef"
          @update:modelValue="handleInput"
          :label="label"
          :modelValue="query"
          :onBlur="onBlur"
          :placeholder="label"
        />
      </ComboboxInput>

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

        <!-- Infinite Scroll Sentinel -->
        <li
          v-if="infinite"
          ref="sentinel"
          class="flex justify-center py-2 pl-10 pr-4 text-sm text-gray-500"
        >
          <slot v-if="showLoadingSlot" name="loading"> Loading... </slot>
        </li>
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

  // Infinite scroll props
  infinite?: boolean;
  fetchMore?: () => void;
  canFetchMore?: boolean;
  threshold?: number | number[];
  rootMargin?: string;
  showLoadingSlot?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  hasColOptions: true,
  infinite: false,
  canFetchMore: true,
  threshold: 0.1,
  rootMargin: "0px",
  showLoadingSlot: true,
});

const emit = defineEmits<{
  (e: "update:selectedOptions", value: unknown[]): void;
  (e: "update:filterValue", value: string): void;
  (e: "load-more"): void;
}>();

const query = ref("");
const sentinel = ref<HTMLElement | null>(null);

// --- Input Reference & Selection Logic ---
// Reference to the FormTextInput component
const formInputRef = ref<{ $el?: HTMLElement } | null>(null);
// Reference to the actual native input element inside FormTextInput
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const actualInputRef = ref<any>(null);

// This function is passed as the `ref` for the ComboboxInput wrapper.
// It patches the wrapper's `setSelectionRange` method to forward calls to the inner input.
function setupInputWrapper(el: unknown) {
  if (!el) return;

  // Get the DOM element of the wrapper
  const element = ((el as { $el?: HTMLElement })?.$el || el) as HTMLElement & {
    setSelectionRange?: (
      selectionStart: number,
      selectionEnd: number,
      selectionDirection?: "forward" | "backward" | "none"
    ) => void;
  };

  // If the wrapper doesn't have setSelectionRange, we add a shim.
  if (element && !element.setSelectionRange) {
    element.setSelectionRange = (
      selectionStart: number,
      selectionEnd: number,
      selectionDirection?: "forward" | "backward" | "none"
    ) => {
      // Try to get the input from our cached ref or look it up
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
          // Ignore errors
        }
      }
    };
  }
}

// Watch the component ref to cache the native input as soon as it's available
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
// -----------------------------------------

// --- Infinite Scroll Logic ---
const enabled = computed(() => props.infinite);
const canFetchMoreRef = computed(() => props.canFetchMore);

const handleFetchMore = () => {
  if (props.fetchMore) {
    props.fetchMore();
  } else {
    emit("load-more");
  }
};

useCustomInfiniteScroll({
  sentinel,
  fetchMore: handleFetchMore,
  canFetchMore: canFetchMoreRef,
  enabled,
  threshold: props.threshold,
  rootMargin: props.rootMargin,
});
// -----------------------------

const onClick = (option: Option) => {
  internalSelectedOptions.value = internalSelectedOptions.value.filter(
    (o: Option) => o.id !== option.id
  );
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
    if (props.selectedOptions && props.selectedOptions.length === 0) {
      return [];
    }
    return props.options.filter((option: Option) =>
      (props.selectedOptions as unknown[]).includes(option.value)
    );
  },
  set(newOptions) {
    const values = (newOptions as Option[]).map((option) => option.value);
    if (JSON.stringify(values) !== JSON.stringify(props.selectedOptions)) {
      emit("update:selectedOptions", values);
    }
  },
});
</script>
