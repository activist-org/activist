<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <FormSelectorCombobox
    :id="id"
    @update:selectedOptions="(val: unknown) => handleChange(val as Country)"
    :hasColOptions="hasColOptions"
    :isMultiSelect="false"
    :label="label"
    :options="options"
    :selectedOptions="[selectedCountry]"
  />
</template>

<script setup lang="ts">
const  countriesData  = useNuxtApp().$countries();

const options = computed(() => Object.entries(countriesData).map(([code, name]) => ({
  label: name,
  value: code,
  id: code,
})));

interface Props {
  id: string;
  selectedCountry: string;
  label: string;
  hasColOptions?: boolean;
}
withDefaults(defineProps<Props>(), {
  hasColOptions: true,
});

const emit = defineEmits<{
  (e: "update:selectedCountry", value: string): void;
}>();
const handleChange = (newValue: string) => {
  emit("update:selectedCountry", newValue);
};
</script>
