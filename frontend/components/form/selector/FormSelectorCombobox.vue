<template>
  <Combobox v-model="selectedPeople" multiple>
    <ComboboxInput as="template">
      <ComboboxInput as="template">
        <FormTextInput
          @update:modelValue="(val) => (query = val)"
          label="People"
          placeholder="People"
          :modelValue="query"
        />
      </ComboboxInput>
    </ComboboxInput>
    <ComboboxOptions>
      <ComboboxOption
        v-for="person in filteredPeople"
        v-slot="{ selected, active }"
        :key="person.id"
        as="template"
        :value="person"
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
            {{ $t(person.name) }}
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
    <ul v-if="selectedPeople.length > 0" class="mt-4 flex flex-col space-y-2">
      <li v-for="person in selectedPeople" :key="person.id">
        <Shield
          @click="() => onClick(person)"
          :key="person.id + '-selected-only'"
          :label="person.name"
          class="mobileTopic max-sm:w-full"
          :active="true"
          :isSelector="true"
          :icon="IconMap.GLOBE"
        />
      </li>
    </ul>
  </Combobox>
</template>

<script setup>
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/vue";

import { IconMap } from "~/types/icon-map";
const people = [
  { id: 1, name: "Durward Reynolds" },
  { id: 2, name: "Kenton Towne" },
  { id: 3, name: "Therese Wunsch" },
  { id: 4, name: "Benedict Kessler" },
  { id: 5, name: "Katelyn Rohan" },
];
const selectedPeople = ref([people[0]]);
const query = ref("");
const onClick = (person) => {
  selectedPeople.value = selectedPeople.value.filter((p) => p !== person);
};
const filteredPeople = computed(() =>
  query.value !== ""
    ? people.filter((person) =>
        person.name.toLowerCase().includes(query.value.toLowerCase())
      )
    : people
);
</script>
