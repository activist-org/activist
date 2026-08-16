<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div :class="embedded ? '' : 'px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36'">
    <div v-if="embedded" class="space-y-4">
      <div class="flex flex-col gap-2">
        <FormLabel
          for="embedded-search-location-country"
          :label="$t('i18n._global.country')"
        />
        <FormSelectorComboboxCountry
          id="embedded-search-location-country"
          @update:selected-country="embeddedCountry = $event"
          :label="$t('i18n._global.country')"
          :selected-country="embeddedCountry"
        />
      </div>
      <div class="flex flex-col gap-2">
        <FormLabel
          for="embedded-search-location-city"
          :label="$t('i18n.components._global.city')"
        />
        <FormTextInput
          id="embedded-search-location-city"
          @update:model-value="embeddedCity = $event"
          :label="$t('i18n.components._global.city')"
          :modelValue="embeddedCity"
        />
      </div>
      <div class="flex flex-col gap-2">
        <FormLabel
          for="embedded-search-location-street"
          :label="
            $t('i18n.components.form_search_location.street_house_number')
          "
        />
        <FormTextInput
          id="embedded-search-location-street"
          @update:model-value="embeddedStreet = $event"
          :label="
            $t('i18n.components.form_search_location.street_house_number')
          "
          :modelValue="embeddedStreet"
        />
      </div>
      <div class="mt-4 flex justify-end">
        <BtnAction
          id="search-location-submit"
          @click="submitEmbeddedSearch"
          ariaLabel="i18n.components.form._global.submit_aria_label"
          class="flex items-center justify-center"
          :cta="true"
          fontSize="lg"
          :label="$t('i18n.components.form_search_location.search_location')"
          type="button"
        />
      </div>
    </div>
    <Form
      id="search-location"
      v-else
      @submit="handleSubmit"
      class="space-y-4"
      :initial-values="searchInitialValues"
      :schema="locationSchema"
      :submit-label="$t('i18n.components.form_search_location.search_location')"
    >
      <FormItem
        v-slot="{ id, handleChange, errorMessage, value }"
        :label="$t('i18n._global.country')"
        name="country"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormSelectorComboboxCountry
          :id="id"
          @update:selected-country="handleChange"
          :hasError="!!errorMessage.value"
          :label="$t('i18n._global.country')"
          :selected-country="(value.value as string) || ''"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        :label="$t('i18n.components._global.city')"
        name="city"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormTextInput
          :id="id"
          @blur="handleBlur"
          @input="handleChange"
          :hasError="!!errorMessage.value"
          :label="$t('i18n.components._global.city')"
          :modelValue="(value.value as string)"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        :label="$t('i18n.components.form_search_location.street_house_number')"
        name="street"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormTextInput
          :id="id"
          @blur="handleBlur"
          @input="handleChange"
          :hasError="!!errorMessage.value"
          :label="
            $t('i18n.components.form_search_location.street_house_number')
          "
          :modelValue="(value.value as string)"
        />
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";

const props = defineProps<{
  handleSubmit: (values: unknown) => Promise<void> | void;
  initialValues?: Partial<FormDataLocation>;
  /** Use plain inputs when rendered inside another form. */
  embedded?: boolean;
}>();

const locationSchema = z.object({
  country: z
    .string({
      required_error: "Country is required",
      invalid_type_error: "Country is required",
    })
    .min(1, "Country is required"),
  street: z.string().min(1, "Street and House Number is required"),
  city: z.string().min(1, "City is required"),
});

const searchInitialValues = computed(() => ({
  country: (props.initialValues?.country ?? "").toUpperCase(),
  city: props.initialValues?.city ?? "",
  street: props.initialValues?.street ?? "",
}));

const embeddedCountry = ref("");
const embeddedCity = ref("");
const embeddedStreet = ref("");

watch(
  searchInitialValues,
  (values) => {
    embeddedCountry.value = values.country;
    embeddedCity.value = values.city;
    embeddedStreet.value = values.street;
  },
  { immediate: true }
);

const submitEmbeddedSearch = () => {
  props.handleSubmit({
    country: embeddedCountry.value,
    city: embeddedCity.value,
    street: embeddedStreet.value,
  });
};
</script>
