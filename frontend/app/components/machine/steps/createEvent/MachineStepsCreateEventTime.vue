<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="max-h-[calc(100vh-10rem)] overflow-y-scroll px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36"
  >
    <Form
      id="event-location-and-time"
      ref="timeFormRef"
      v-slot="{ values, setFieldValue }"
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
      :initial-values="initialTimeData"
      :isLoading="loading?.value"
      :schema="scheduleSchema"
    >
      <FormItem
        v-slot="{ handleChange, value, errorMessage }"
        :label="
          $t('i18n.components.machine_steps_create_event_time.event_schedule')
        "
        name="dates"
      >
        <FormDateTimeCalendar
          @update:modelValue="
            (val) => {
              handleChange(val);
              // Trigger sync immediately when dates change.
              syncTimesArray(val, values.times, setFieldValue);
            }
          "
          :calendar-args="[]"
          :hasError="!!errorMessage.value"
          is-range
          mode="date"
          :model-value="value.value as { start: Date; end: Date }"
        />
      </FormItem>
      <FormListItem v-slot="{ fields, error }" label="Daily Times" name="times">
        <div class="mt-4 space-y-3">
          <div
            v-if="fields.value && fields.value.length"
            v-for="(field, idx) in fields.value"
            :key="field.key"
            class="flex flex-col items-start gap-4 rounded-md border border-neutral-200 p-3 dark:border-neutral-700 sm:flex-row sm:items-center"
          >
            <div class="flex w-32 flex-col gap-1 font-medium text-primary-text">
              {{
                (field.value as { date?: Date })?.date
                  ? formatDate((field.value as { date: Date }).date)
                  : ""
              }}
              <FormItem
                v-slot="{ id, handleChange, handleBlur }"
                :name="`times.${idx}.allDayLong`"
              >
                <FormCheckbox
                  :id="id"
                  @blur="handleBlur"
                  @update:model-value="handleChange"
                  :data-testid="`all-day-long-event-${idx}`"
                  :label="
                    $t(
                      'i18n.components.machine_steps_create_event_time.all_day_long_event'
                    )
                  "
                />
              </FormItem>
            </div>
            <div class="w-full flex-1">
              <FormItem
                v-slot="{ id, value, handleChange, errorMessage }"
                :label="
                  $t(
                    'i18n.components.machine_steps_create_event_time.start_time'
                  )
                "
                :name="`times.${idx}.startTime`"
              >
                <FormDateTime
                  :id="id"
                  @update:modelValue="handleChange"
                  :hasError="!!errorMessage.value"
                  is24Hr
                  :label="
                    $t(
                      'i18n.components.machine_steps_create_event_time.start_time'
                    )
                  "
                  mode="time"
                  :model-value="value.value as Date"
                />
              </FormItem>
            </div>
            <div class="w-full flex-1">
              <FormItem
                v-slot="{ id, value, handleChange, errorMessage }"
                :label="
                  $t('i18n.components.machine_steps_create_event_time.end_time')
                "
                :name="`times.${idx}.endTime`"
              >
                <FormDateTime
                  :id="id"
                  @update:modelValue="handleChange"
                  :hasError="!!errorMessage.value"
                  :label="
                    $t(
                      'i18n.components.machine_steps_create_event_time.end_time'
                    )
                  "
                  mode="time"
                  :model-value="value.value as Date"
                />
              </FormItem>
            </div>
          </div>
          <p v-else class="text-sm italic">
            {{
              $t(
                "i18n.components.machine_steps_create_event_time.select_a_date_range"
              )
            }}
          </p>
          <FormErrorMessage :message="error" />
        </div>
      </FormListItem>
      <FormItem v-slot="{ id, handleChange, handleBlur }" name="createAnother">
        <FormCheckbox
          :id="id"
          @blur="handleBlur"
          @update:model-value="handleChange"
          data-testid="create-another"
          :label="
            $t(
              'i18n.components.machine_steps_create_event_time.create_another_event'
            )
          "
        />
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { addDays, differenceInCalendarDays, format, isSameDay } from "date-fns";
import { z } from "zod";
import { CreateEventSteps } from "~~/shared/types";

const flow = inject<FlowControls>("flow");
const isCreating = ref(false);
const timeFormRef = ref<{ getValues: () => Record<string, unknown> } | null>(
  null
);

const initialTimeData = computed(() => {
  const ctx = flow?.context?.value;
  if (!ctx?.nodeData || ctx.nodeId !== CreateEventSteps.Time) return {};
  const d = (ctx.nodeData as Record<string, unknown>)[ctx.nodeId] as
    | Record<string, unknown>
    | undefined;
  if (!d) return {};
  const timesRaw =
    (d.times as Array<{
      date?: string;
      start_time?: string;
      end_time?: string;
      all_day?: boolean;
    }>) ?? [];
  const times = timesRaw.map((t) => ({
    date: t.date ? new Date(t.date) : new Date(),
    startTime: t.start_time ? new Date(t.start_time) : new Date(),
    endTime: t.end_time ? new Date(t.end_time) : new Date(),
    allDayLong: t.all_day ?? false,
  }));
  const first = times[0];
  const last = times[times.length - 1];
  const dates =
    first && last ? { start: first.date, end: last.date } : undefined;
  return {
    times,
    createAnother: d.createAnother,
    ...(dates && { dates }),
  };
});

const scheduleSchema = z.object({
  dates: z.object({
    start: z.date(),
    end: z.date(),
    allDayLong: z.boolean().optional(),
  }),
  times: z
    .array(
      z.object({
        date: z.date(),
        // Allow null/undefined initially, or enforce validation if needed.
        startTime: z.date().nullable(),
        endTime: z.date().nullable(),
        allDayLong: z.boolean().optional(),
      })
    )
    .min(1, "At least one date with time is required")
    .refine(
      (times) => {
        // Ensure startTime is before endTime for each entry.
        return times.every((t) => {
          if (t.allDayLong) return true;
          if (t.startTime && t.endTime) {
            return t.startTime <= t.endTime;
          }
          return true; // skip validation if times are null/undefined.
        });
      },
      {
        message: "Start time must be before end time",
      }
    ),
  createAnother: z.boolean().optional(),
});
const loading = computed(() => flow?.isSaving);

const syncTimesArray = (
  dateRange: { start: Date; end: Date } | null,
  currentTimes: {
    date: Date;
    startTime: Date;
    endTime: Date;
  }[],
  setFieldValue: (field: string, value: unknown) => void
) => {
  // Handle empty range.
  if (!dateRange?.start || !dateRange?.end) {
    setFieldValue("times", []);
    return;
  }

  const start = new Date(dateRange.start);
  const end = new Date(dateRange.end);
  const daysCount = differenceInCalendarDays(end, start) + 1; // inclusive

  const newTimes = [];

  for (let i = 0; i < daysCount; i++) {
    const currentDate = addDays(start, i);

    // Check for existing data for this specific date.
    // This preserves the time if the user changes the range (e.g. extends it).
    const existing = currentTimes?.find(
      (t) => t.date && isSameDay(new Date(t.date), currentDate)
    );

    if (existing) {
      newTimes.push(existing);
    } else {
      // Create new entry with null times.
      newTimes.push({
        date: currentDate,
        startTime: currentDate,
        endTime: currentDate,
      });
    }
  }
  setFieldValue("times", newTimes);
};

const formatDate = (date: Date | string) => {
  return format(new Date(date), "EEE, MMM d"); // e.g., "Mon, Jan 1"
};

function serializeTimeValues(values: Record<string, unknown>) {
  const times = values.times as
    | { date: Date; startTime: Date; endTime: Date; allDayLong?: boolean }[]
    | undefined;
  if (!times?.length) return { times: [], createAnother: values.createAnother };
  const mappedTimes = times.map((t) => ({
    date: t.date instanceof Date ? t.date.toISOString().split("T")[0] : t.date,
    start_time:
      t.startTime instanceof Date
        ? t.startTime.toISOString()
        : (t.startTime as string),
    end_time:
      t.endTime instanceof Date
        ? t.endTime.toISOString()
        : (t.endTime as string),
    all_day: t.allDayLong ?? false,
  }));
  return { times: mappedTimes, createAnother: values.createAnother };
}

const handlePrev = () => {
  if (!flow) return;
  const values = timeFormRef.value?.getValues?.();
  if (values && typeof values === "object" && Object.keys(values).length > 0)
    flow.prev(serializeTimeValues(values));
  else flow.prev();
};

const handleSubmit = async (values: Record<string, unknown>) => {
  const { times, createAnother } = values;

  if (!flow) return;
  if (isCreating.value) return;
  const mappedTimes = (
    times as {
      date: Date;
      startTime: Date;
      endTime: Date;
      allDayLong?: boolean;
    }[]
  ).map((t) => ({
    date: t.date.toISOString().split("T")[0],
    start_time:
      t.startTime instanceof Date
        ? t.startTime.toISOString()
        : (t.startTime as string),
    end_time:
      t.endTime instanceof Date
        ? t.endTime.toISOString()
        : (t.endTime as string),
    all_day: t.allDayLong || false,
  }));

  flow.next({
    times: mappedTimes,
    createAnother,
  });
};
</script>
