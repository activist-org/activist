<template>
  <Combobox v-model="selectedOptions" :id="id" multiple as="div">
    <ComboboxInput v-slot="{ id: inputId, onBlur }" as="div" class="flex">
      >
      <FormTextInput
        @update:modelValue="(val) => (query = val)"
        :id="inputId"
        :label="label"
        :placeholder="label"
        :onBlur="onBlur"
        :modelValue="query"
      />
    </ComboboxInput>
    <ComboboxOptions>
      <ComboboxOption
        v-for="option in filteredOptions"
        v-slot="{ selected, active }"
        :key="option.id"
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
    <ul v-if="selectedOptions.length > 0" class="mt-4 flex flex-col space-y-2">
      <li v-for="option in selectedOptions" :key="option.id">
        <Shield
          @click="() => onClick(option)"
          :key="option.id + '-selected-only'"
          :label="option.label"
          class="mobileTopic max-sm:w-full"
          :active="true"
          :isSelector="true"
          :icon="IconMap.GLOBE"
        />
      </li>
    </ul>
  </Combobox>
</template>

<script setup lang="ts">
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/vue";

import { IconMap } from "~/types/icon-map";
interface Option {
  id: number;
  label: string;
  value: unknown;
}
interface Props {
  options: Option[];
  id: string;
  label: string;
}
const props = defineProps<Props>();
const selectedOptions = ref<Option[]>([]);
const query = ref("");
const onClick = (option: Option) => {
  selectedOptions.value = selectedOptions.value.filter(
    (o) => o.id !== option.id
  );
};
const emit = defineEmits<{
  (e: "update:selectedOptions", value: unknown[]): void;
}>();
watch(selectedOptions, (newValue: unknown) => {
  const values = (newValue as Option[]).map((option) => option.value);
  emit("update:selectedOptions", values);
});
const filteredOptions = computed(() =>
  query.value !== ""
    ? props.options.filter((option) =>
        option.label.toLowerCase().includes(query.value.toLowerCase())
      )
    : props.options
);
</script>
