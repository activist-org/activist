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
import country, { type Country } from "countryjs";
const countriesData = country.all();
const options = countriesData.map((c) => ({
  label: c.name,
  value: c.ISO.alpha3,
  id: c.ISO.alpha3,
}));

interface Props {
  id: string;
  selectedCountry: Country;
  label: string;
  hasColOptions?: boolean;
}
withDefaults(defineProps<Props>(), {
  hasColOptions: true,
});

const emit = defineEmits<{
  (e: "update:selectedCountry", value: Country): void;
}>();
const handleChange = (newValue: Country) => {
  emit("update:selectedCountry", newValue);
};
</script>
