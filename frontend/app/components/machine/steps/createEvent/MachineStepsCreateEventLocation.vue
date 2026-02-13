<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col gap-y-6 px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <FormSearchLocation :handle-submit="handleSubmitLocation" />
    <Form
      id="event-location"
      @submit="handleSubmit"
      :action-buttons="[
        {
          onclick: handlePrev,
          cta: false,
          fontSize: 'base',
          ariaLabel:
            'i18n.components.machine.steps._global.previous_step_aria_label',
          label: 'i18n.components.machine.steps._global.previous_step',
          type: 'button',
        },
      ]"
      class="space-y-4"
      :schema="locationSchema"
      :submit-label="$t('i18n._global.next_step')"
    >
      <FormItem
        v-slot="{ id, handleChange, value }"
        :label="
          $t(
            'i18n.components.machine_steps_create_event_location.select_location'
          )
        "
        name="location"
      >
        <FormRadioGroup
          :id="id"
          @update:model-value="handleChange"
          :model-value="(value.value as string) || ''"
          :options="options"
          :vertical="true"
        />
        <span v-if="options.length === 0 && query" class="error-text text-sm">
          Please verify that all inputs are correct or try different search
          terms.
        </span>
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";

const query = ref<Record<string, string> | null>(null);
const options = ref<RadioOption[]>([]);
const handleSubmitLocation = (values: unknown) => {
  const valuesTyped = values as FormDataLocation;
  // Logic to handle location submission
  query.value = {
    street: valuesTyped.street,
    countrycodes: valuesTyped.country,
    city: valuesTyped.city,
  };
};
const flow = inject<FlowControls>("flow");
const locationSchema = z.object({
  location: z
    .object({
      lat: z.number(),
      lon: z.number(),
      id: z.number(),
      bbox: z.array(z.string()),
    })
    .nullable(),
});
const handlePrev = () => {
  if (!flow) return;
  flow.prev();
};

const { data: potentialLocations } = useLocation(query);
watch(
  potentialLocations,
  () => {
    if (!potentialLocations.value) {
      options.value = [];
      return;
    }
    options.value = (potentialLocations.value ?? []).map((loc) => ({
      label: loc.display_name,
      value: {
        id: loc.place_id,
        lat: parseFloat(loc.lat),
        lon: parseFloat(loc.lon),
        bbox: loc.boundingbox,
      },
    }));
  },
  { immediate: true }
);
const handleSubmit = async (values: unknown) => {
  const { location } = values as { location: FormDataLocation };
  const locationMapped = {
    ...location,
    country_code: query.value?.countrycodes || "",
    city: query.value?.city || "",
    address_or_name: query.value?.street || "",
  };
  if (!flow) return;
  flow.next({ location: locationMapped });
};
</script>
