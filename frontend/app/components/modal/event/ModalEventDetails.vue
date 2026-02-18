// SPDX-License-Identifier: AGPL-3.0-or-later
<template>
  <ModalBase :modalName="modalName">
    <div class="flex max-h-[80vh] flex-col">
      <h2 class="mb-6 font-display text-2xl">
        {{ $t("i18n.components.modal_event_details.edit_event_details") }}
      </h2>
      <div class="flex-1 overflow-y-auto pr-2">
        <Form
          id="event-details"
          @submit="handleSubmit"
          class="space-y-5"
          :initial-values="formData"
          :schema="eventDetailsSchema"
          :submit-label="
            $t('i18n.components.modal_event_details.update_details')
          "
        >
          <FormItem
            v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
            :label="$t('i18n._global.name')"
            name="name"
            required
          >
            <FormTextInput
              :id="id"
              @blur="handleBlur"
              @input="handleChange"
              :hasError="!!errorMessage.value"
              :label="$t('i18n._global.name')"
              :modelValue="value.value as string"
            />
          </FormItem>
          <FormItem
            v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
            :label="$t('i18n._global.tagline')"
            name="tagline"
          >
            <FormTextInput
              :id="id"
              @blur="handleBlur"
              @input="handleChange"
              :hasError="!!errorMessage.value"
              :label="$t('i18n._global.tagline')"
              :modelValue="value.value as string"
            />
          </FormItem>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormItem
              v-slot="{ id, handleChange, errorMessage, value }"
              :label="$t('i18n.components._global.start_time')"
              name="startTime"
              required
            >
              <FormDateTime
                :id="id"
                @update:modelValue="handleChange"
                mode="dateTime"
                :modelValue="value.value as Date"
              />
              <div
                v-if="errorMessage.value"
                class="mt-1 text-sm text-action-red"
              >
                {{ errorMessage.value }}
              </div>
            </FormItem>
            <FormItem
              v-slot="{ id, handleChange, errorMessage, value }"
              :label="$t('i18n.components._global.end_time')"
              name="endTime"
            >
              <FormDateTime
                :id="id"
                @update:modelValue="handleChange"
                mode="dateTime"
                :modelValue="value.value as Date"
              />
              <div
                v-if="errorMessage.value"
                class="mt-1 text-sm text-action-red"
              >
                {{ errorMessage.value }}
              </div>
            </FormItem>
          </div>
          <FormItem
            v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
            :label="$t('i18n.components.modal_event_details.physical_location')"
            name="physicalLocationName"
          >
            <FormTextInput
              :id="id"
              @blur="handleBlur"
              @input="handleChange"
              :hasError="!!errorMessage.value"
              :label="
                $t('i18n.components.modal_event_details.physical_location')
              "
              :modelValue="value.value as string"
            />
          </FormItem>
          <FormItem
            v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
            :label="
              $t('i18n.components.modal_event_details.online_location_link')
            "
            name="onlineLocationLink"
          >
            <FormTextInput
              :id="id"
              @blur="handleBlur"
              @input="handleChange"
              :hasError="!!errorMessage.value"
              :label="
                $t('i18n.components.modal_event_details.online_location_link')
              "
              :modelValue="value.value as string"
            />
          </FormItem>
        </Form>
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { z } from "zod";

const modalName = "ModalEventDetails";
const { handleCloseModal } = useModalHandlers(modalName);

const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : "";

const { data: event } = useGetEvent(eventId);
const { update } = useEventDetailMutations(eventId);

const eventDetailsSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    tagline: z.string().optional(),
    startTime: z.date({
      required_error: "Start time is required",
    }),
    endTime: z.date().optional().nullable(),
    physicalLocationName: z.string().optional(),
    onlineLocationLink: z
      .string()
      .url("Please enter a valid URL")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data: { startTime: Date; endTime?: Date | null }) => {
      if (data.endTime && data.startTime > data.endTime) {
        return false;
      }
      return true;
    },
    {
      message: "Start time must be before end time",
      path: ["endTime"],
    }
  );

const formData = ref({
  name: "",
  tagline: "",
  startTime: new Date(),
  endTime: null as Date | null,
  physicalLocationName: "",
  onlineLocationLink: "",
});

onMounted(() => {
  if (event.value) {
    formData.value.name = event.value.name || "";
    formData.value.tagline = event.value.tagline || "";
    formData.value.startTime = event.value.startTime
      ? new Date(event.value.startTime)
      : new Date();
    formData.value.endTime = event.value.endTime
      ? new Date(event.value.endTime)
      : null;
    formData.value.physicalLocationName =
      event.value.physicalLocation?.displayName || "";
    formData.value.onlineLocationLink = event.value.onlineLocationLink || "";
  }
});

watch(
  event,
  (newEvent) => {
    if (newEvent) {
      formData.value.name = newEvent.name || "";
      formData.value.tagline = newEvent.tagline || "";
      formData.value.startTime = newEvent.startTime
        ? new Date(newEvent.startTime)
        : new Date();
      formData.value.endTime = newEvent.endTime
        ? new Date(newEvent.endTime)
        : null;
      formData.value.physicalLocationName =
        newEvent.physicalLocation?.displayName || "";
      formData.value.onlineLocationLink = newEvent.onlineLocationLink || "";
    }
  },
  {
    deep: true,
  }
);

async function handleSubmit(values: unknown) {
  const formValues = values as {
    name: string;
    tagline?: string;
    startTime: Date;
    endTime?: Date | null;
    physicalLocationName?: string;
    onlineLocationLink?: string;
  };

  const updateData: Partial<EventResponse> = {
    name: formValues.name,
    tagline: formValues.tagline,
    startTime: formValues.startTime.toISOString(),
    endTime: formValues.endTime ? formValues.endTime.toISOString() : undefined,
    onlineLocationLink: formValues.onlineLocationLink,
  };

  if (formValues.physicalLocationName && event.value?.physicalLocation) {
    updateData.physicalLocation = {
      ...event.value.physicalLocation,
      displayName: formValues.physicalLocationName,
    };
  }

  const response = await update(updateData);
  if (response) {
    handleCloseModal();
  }
}
</script>
