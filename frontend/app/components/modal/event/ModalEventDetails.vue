<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <div class="flex max-h-[80vh] flex-col">
      <h2 class="mb-6 font-display text-2xl">
        {{ $t("i18n.components.modal_event_details.edit_event_details") }}
      </h2>
      <div class="flex-1 overflow-y-auto pr-2">
        <Form
          id="event-details-edit"
          v-if="event"
          :key="formScheduleKey"
          v-slot="{ values, setFieldValue }"
          @submit="handleSubmit"
          class="space-y-5"
          :initial-values="initialValues"
          :isLoading="loading"
          :schema="eventDetailsSchema"
          :submit-label="
            $t('i18n.components.modal_event_details.update_details')
          "
        >
          <FormItem
            v-slot="{ id, handleChange, value }"
            :label="$t('i18n._global.organizations')"
            name="orgs"
            required
          >
            <FormSelectorComboboxOrganizations
              :id="id"
              @update:selectedOptions="
                (val: unknown) => handleChange(val as string[])
              "
              :label="$t('i18n._global.organizations')"
              :linked-user-id="user?.id || ''"
              :selected-organizations="
                resolveSelectedOrganizations(
                  (value.value ?? []) as string[],
                  event?.orgs
                )
              "
            />
          </FormItem>
          <FormItem
            v-slot="{ id, handleChange, value }"
            :label="$t('i18n.components._global.location_type')"
            name="locationType"
            required
          >
            <FormSelectorRadio
              :id="id"
              @update:modelValue="handleChange"
              :modelValue="value.value as string"
              :options="optionLocations"
            />
          </FormItem>
          <template v-if="values.locationType === 'online'">
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
          </template>
          <template v-else-if="values.locationType === 'physical'">
            <FormSearchLocation :handle-submit="handleSubmitLocation" />
            <FormItem
              v-slot="{ id, handleChange, value }"
              :label="$t('i18n._global.physical_location')"
              name="location"
            >
              <FormRadioGroup
                :id="id"
                @update:model-value="handleChange"
                :model-value="(value.value as string) || ''"
                :options="locationOptions"
                :vertical="true"
              />
            </FormItem>
          </template>
          <FormItem
            v-slot="{ handleChange, value, errorMessage }"
            :label="$t('i18n.components._global.event_schedule')"
            name="dates"
          >
            <FormDateTimeCalendar
              @update:modelValue="
                (val) => {
                  const normalized = normalizeCalendarRange(val, values.times);
                  handleChange(normalized);
                  syncTimesArray(normalized, values.times, setFieldValue);
                }
              "
              :calendar-args="[]"
              :hasError="!!errorMessage.value"
              is-range
              mode="date"
              :model-value="value.value as { start: Date; end: Date }"
            />
          </FormItem>
          <FormListItem
            v-slot="{ fields, error }"
            :label="$t('i18n.components.modal_event_details.daily_times')"
            name="times"
          >
            <div class="mt-4 space-y-3">
              <div
                v-if="fields.value && fields.value.length"
                v-for="(field, idx) in fields.value"
                :key="field.key"
                class="flex flex-col items-start gap-4 rounded-md border border-neutral-200 p-3 dark:border-neutral-700 sm:flex-row sm:items-center"
              >
                <div
                  class="flex w-32 flex-col gap-1 font-medium text-primary-text"
                >
                  {{
                    (field.value as { date?: Date })?.date
                      ? formatScheduleDayLabel(
                          (field.value as { date: Date }).date
                        )
                      : ""
                  }}
                  <FormItem
                    v-slot="{ id, handleChange, handleBlur, value }"
                    :name="`times.${idx}.allDayLong`"
                  >
                    <FormCheckbox
                      :id="id"
                      @blur="handleBlur"
                      @update:model-value="handleChange"
                      :data-testid="`all-day-long-event-${idx}`"
                      :label="$t('i18n.components._global.all_day_long_event')"
                      :model-value="Boolean(value.value)"
                    />
                  </FormItem>
                </div>
                <div class="w-full flex-1">
                  <FormItem
                    v-slot="{ id, value, handleChange, errorMessage }"
                    :label="$t('i18n.components._global.start_time')"
                    :name="`times.${idx}.startTime`"
                  >
                    <FormDateTime
                      :id="id"
                      @update:modelValue="handleChange"
                      :hasError="!!errorMessage.value"
                      is24Hr
                      :label="$t('i18n.components._global.start_time')"
                      mode="time"
                      :model-value="value.value as Date"
                    />
                  </FormItem>
                </div>
                <div class="w-full flex-1">
                  <FormItem
                    v-slot="{ id, value, handleChange, errorMessage }"
                    :label="$t('i18n.components._global.end_time')"
                    :name="`times.${idx}.endTime`"
                  >
                    <FormDateTime
                      :id="id"
                      @update:modelValue="handleChange"
                      :hasError="!!errorMessage.value"
                      :label="$t('i18n.components._global.end_time')"
                      mode="time"
                      :model-value="value.value as Date"
                    />
                  </FormItem>
                </div>
              </div>
              <p v-else class="text-sm italic">
                {{ $t("i18n.components._global.select_a_date_range") }}
              </p>
              <FormErrorMessage :message="error" />
            </div>
          </FormListItem>
        </Form>
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { z } from "zod";
import {
  buildTimesForDateRange,
  eventTimesToSchedule,
  formatScheduleDayLabel,
  mapScheduleTimesToEventTimeInput,
  normalizeCalendarRange,
} from "~~/shared/utils/date";

const modalName = "ModalEventDetails";
const { handleCloseModal } = useModalHandlers(modalName);
const { t } = useI18n();
const { user } = useUser();

const props = defineProps<{
  entityId: string;
}>();

const eventId = computed(() => props.entityId);
const { data: event } = useGetEvent(eventId);
const { loading, updateDetails } = useEventDetailMutations(eventId);

const formScheduleKey = computed(() => {
  const times = event.value?.times ?? [];
  return times
    .map(
      (entry) =>
        `${entry.startTime}:${entry.endTime}:${entry.allDay ? "1" : "0"}`
    )
    .join("|");
});

function resolveSelectedOrganizations(
  selectedIds: string[],
  eventOrgs: Organization[] | undefined
): Array<Organization | string> {
  return selectedIds.map((id) => {
    const fromEvent = eventOrgs?.find((org) => org.id === id);
    return fromEvent ?? id;
  });
}

type LocationQuery = {
  street: string;
  city: string;
  countrycodes: string;
};

const locationQuery = ref<LocationQuery | null>(null);
const locationOptions = ref<RadioOption[]>([]);

const optionLocations = [
  {
    value: "physical",
    key: "PHYSICAL",
    content: t("i18n.components._global.location_type_physical"),
    aria_label: "i18n.components._global.location_type_physical_aria_label",
    class: "text-nowrap",
  },
  {
    value: "online",
    key: "ONLINE",
    content: t("i18n.components._global.location_type_online"),
    aria_label: "i18n.components._global.location_type_online_aria_label",
    class: "text-nowrap",
  },
];

const eventDetailsSchema = z
  .object({
    orgs: z.array(z.string()).min(1, t("i18n._global.required")),
    locationType: z.enum(["physical", "online"]),
    onlineLocationLink: z.string().optional(),
    location: z
      .object({
        lat: z.number(),
        lon: z.number(),
        id: z.number(),
        bbox: z.array(z.string()),
      })
      .nullable()
      .optional(),
    dates: z.object({
      start: z.date(),
      end: z.date(),
    }),
    times: z
      .array(
        z.object({
          date: z.date(),
          startTime: z.date().nullable(),
          endTime: z.date().nullable(),
          allDayLong: z.boolean().optional(),
        })
      )
      .min(1, t("i18n._global.required"))
      .refine(
        (times) =>
          times.every((entry) => {
            if (entry.allDayLong) return true;
            if (entry.startTime && entry.endTime) {
              return entry.startTime <= entry.endTime;
            }
            return true;
          }),
        { message: t("i18n.components.modal_event_details.start_before_end") }
      ),
  })
  .superRefine((data, ctx) => {
    if (data.locationType === "online" && !data.onlineLocationLink?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("i18n._global.required"),
        path: ["onlineLocationLink"],
      });
    }
    if (data.locationType === "physical" && !data.location) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("i18n._global.required"),
        path: ["location"],
      });
    }
  });

const initialValues = computed(() => {
  const currentEvent = event.value;
  if (!currentEvent) {
    const today = new Date();
    return {
      orgs: [] as string[],
      locationType: "physical" as const,
      onlineLocationLink: "",
      location: null,
      dates: { start: today, end: today },
      times: [],
    };
  }

  const schedule = eventTimesToSchedule(currentEvent.times ?? []);
  const locationType =
    currentEvent.locationType ??
    (currentEvent.onlineLocationLink ? "online" : "physical");

  const physicalLocation = currentEvent.physicalLocation;
  const selectedLocation =
    physicalLocation && locationType === "physical"
      ? {
          id: 0,
          lat: Number.parseFloat(physicalLocation.lat),
          lon: Number.parseFloat(physicalLocation.lon),
          bbox: physicalLocation.bbox,
        }
      : null;

  return {
    orgs: (currentEvent.orgs ?? []).map((org) => org.id),
    locationType,
    onlineLocationLink: currentEvent.onlineLocationLink ?? "",
    location: selectedLocation,
    dates: schedule.dates,
    times: schedule.times,
  };
});

watch(
  event,
  (currentEvent) => {
    if (!currentEvent) {
      locationQuery.value = null;
      locationOptions.value = [];
      return;
    }

    const locationType =
      currentEvent.locationType ??
      (currentEvent.onlineLocationLink ? "online" : "physical");
    const physicalLocation = currentEvent.physicalLocation;

    if (physicalLocation && locationType === "physical") {
      locationQuery.value = {
        street: physicalLocation.addressOrName,
        city: physicalLocation.city,
        countrycodes: physicalLocation.countryCode,
      };
      locationOptions.value = [
        {
          label: physicalLocation.addressOrName,
          value: {
            id: 0,
            lat: Number.parseFloat(physicalLocation.lat),
            lon: Number.parseFloat(physicalLocation.lon),
            bbox: physicalLocation.bbox,
          },
        },
      ];
      return;
    }

    locationQuery.value = null;
    locationOptions.value = [];
  },
  { immediate: true }
);

const { data: potentialLocations } = useLocation(locationQuery);

watch(
  potentialLocations,
  () => {
    if (!potentialLocations.value) {
      if (!locationQuery.value) {
        locationOptions.value = [];
      }
      return;
    }
    locationOptions.value = (potentialLocations.value ?? []).map((loc) => ({
      label: loc.display_name,
      value: {
        id: loc.place_id,
        lat: Number.parseFloat(loc.lat),
        lon: Number.parseFloat(loc.lon),
        bbox: loc.boundingbox,
      },
    }));
  },
  { immediate: true }
);

const handleSubmitLocation = (values: unknown) => {
  const valuesTyped = values as FormDataLocation;
  locationQuery.value = {
    street: valuesTyped.street,
    countrycodes: valuesTyped.country,
    city: valuesTyped.city,
  };
};

const syncTimesArray = (
  dateRange: { start: Date; end: Date } | null,
  currentTimes: {
    date: Date;
    startTime: Date | null;
    endTime: Date | null;
    allDayLong?: boolean;
  }[],
  setFieldValue: (field: string, value: unknown) => void
) => {
  if (!dateRange?.start || !dateRange?.end) {
    setFieldValue("times", []);
    return;
  }

  setFieldValue("times", buildTimesForDateRange(dateRange, currentTimes));
};

async function handleSubmit(values: unknown) {
  const formValues = values as {
    orgs: string[];
    locationType: "physical" | "online";
    onlineLocationLink?: string;
    location?: {
      lat: number;
      lon: number;
      bbox: string[];
    } | null;
    times: {
      date: Date;
      startTime: Date | null;
      endTime: Date | null;
      allDayLong?: boolean;
    }[];
  };

  const payload: UpdateEventDetailsInput = {
    orgs: formValues.orgs,
    locationType: formValues.locationType,
    times: mapScheduleTimesToEventTimeInput(formValues.times),
  };

  if (formValues.locationType === "online") {
    payload.onlineLocationLink = formValues.onlineLocationLink ?? "";
  } else if (formValues.location && locationQuery.value) {
    payload.location = {
      address_or_name: locationQuery.value.street,
      city: locationQuery.value.city,
      country_code: locationQuery.value.countrycodes,
      lat: String(formValues.location.lat),
      lon: String(formValues.location.lon),
      bbox: formValues.location.bbox,
    };
  } else if (event.value?.physicalLocation) {
    payload.location = {
      address_or_name: event.value.physicalLocation.addressOrName,
      city: event.value.physicalLocation.city,
      country_code: event.value.physicalLocation.countryCode,
      lat: event.value.physicalLocation.lat,
      lon: event.value.physicalLocation.lon,
      bbox: event.value.physicalLocation.bbox,
    };
  }

  const response = await updateDetails(payload);
  if (response) {
    handleCloseModal();
  }
}
</script>
