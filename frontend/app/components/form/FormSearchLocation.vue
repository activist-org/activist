<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <Form
      id="search-location"
      @submit="handleSubmit"
      class="space-y-4"
      :schema="locationSchema"
      :submit-label="$t('i18n.components.form.search_location.search_location')"
    >
      <FormItem
        v-slot="{ id, handleChange, errorMessage, value }"
        :label="$t('i18n.components.machine.steps._global.country')"
        name="country"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormSelectorComboboxCountry
          :id="id"
          @update:selected-country="handleChange"
          :hasError="!!errorMessage.value"
          :label="$t('i18n.components.machine.steps._global.country')"
          :selected-country="(value.value as string) || ''"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        :label="$t('i18n.components.machine.steps._global.city')"
        name="city"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormTextInput
          :id="id"
          @blur="handleBlur"
          @input="handleChange"
          :hasError="!!errorMessage.value"
          :label="$t('i18n.components.machine.steps._global.city')"
          :modelValue="(value.value as string)"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        :label="
          $t('i18n.components.machine_steps_create_event_location.street_house_number')
        "
        name="street"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormTextInput
          :id="id"
          @blur="handleBlur"
          @input="handleChange"
          :hasError="!!errorMessage.value"
          :label="
            $t('i18n.components.machine_steps_create_event_location.street_house_number')
          "
          :modelValue="(value.value as string)"
        />
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
defineProps<{
  handleSubmit: (values: unknown) => Promise<void> | void;
}>();
const locationSchema = z.object({
  country: z.string().min(1, "Country is required"),
  street: z.string().min(1, "Street and House Number is required"),
  city: z.string().min(1, "City is required"),
});
</script>
