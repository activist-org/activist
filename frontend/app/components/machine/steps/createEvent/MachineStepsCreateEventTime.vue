<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <Form
      id="event-location-and-time"
      v-slot="{ values, setFieldValue }"
      @submit="handleSubmit"
      :action-buttons='[{
        onclick: handlePrev,
        cta: false,
        fontSize: "base",
        ariaLabel: "i18n.components.previous_step_aria_label",
        label: "Previous",
        type: "button"
      }]'
      class="space-y-4"
      :schema="scheduleSchema"
    >
      <!-- 1. DATE RANGE PICKER -->
      <FormItem
        v-slot="{ handleChange, value, errorMessage }"
        label="Event Schedule"
        name="dates"
      >
        <FormDateTimeCalendar
          @update:modelValue="(val) => {
            handleChange(val);
            // Trigger sync immediately when dates change
            syncTimesArray(val, values.times, setFieldValue);
          }"
          :hasError="!!errorMessage.value"
          mode="date"
          is-range
          :model-value="value.value"
        />
      </FormItem>

      <!-- 2. DYNAMIC TIME LIST -->
      <FormListItem
        v-slot="{ fields }"
        label="Daily Times"
        name="times"
      >
        <div class="space-y-3 mt-4">
          <!--
            We iterate over 'fields.value' because useFieldArray returns a Ref.
            We check length to avoid rendering if empty.
          -->
          <div
            v-if="fields.value && fields.value.length"
            v-for="(field, idx) in fields.value"
            :key="field.key"
            class="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-3 border rounded-md border-neutral-200 dark:border-neutral-700"
          >
            <!-- Date Label (Read-only) -->
            <div class="w-32 font-medium text-primary-text">
              {{ field.value?.date ? formatDate(field.value.date) : '' }}
            </div>

            <!-- Start Time Input -->
            <div class="flex-1 w-full">
              <!--
                CRITICAL: We bind 'name' to the specific index in the array
                so VeeValidate knows exactly which field to update: times[0].startTime
              -->
              <FormItem
                v-slot="{ id, value, handleChange, errorMessage }"
                label="Start Time"
                :name="`times.${idx}.startTime`"
              >
                <FormDateTime
                  :id="id"
                  :model-value="value.value"
                  @update:modelValue="handleChange"
                  :hasError="!!errorMessage.value"
                  mode="time"
                  label="Start Time"
                  is24Hr
                />
              </FormItem>
            </div>

            <!-- End Time Input -->
            <div class="flex-1 w-full">
              <FormItem
                v-slot="{ id, value, handleChange, errorMessage }"
                :name="`times.${idx}.endTime`"
                :label="`End Time`"
              >
                <FormDateTime
                  :id="id"
                  :model-value="value.value"
                  @update:modelValue="handleChange"
                  :hasError="!!errorMessage.value"
                  mode="time"
                  label="End Time"
                />
              </FormItem>
            </div>
          </div>

          <!-- Empty State -->
          <p v-else class="text-sm text-gray-500 italic">
            Select a date range above to configure times.
          </p>
        </div>
      </FormListItem>

      <FormItem v-slot="{ id, handleChange, handleBlur }" name="createAnother">
        <FormCheckbox
          :id="id"
          @blur="handleBlur"
          @update:model-value="handleChange"
          data-testid="create-another"
          label="Create another event"
        />
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { format, differenceInCalendarDays, addDays, isSameDay } from "date-fns";
import { z } from "zod";

const flow = inject<FlowControls>("flow");

// --- Zod Schema ---
const scheduleSchema = z.object({
  dates: z.object({
    start: z.date(),
    end: z.date(),
  }),
  times: z.array(z.object({
    date: z.date(),
    // Allow null/undefined initially, or enforce validation if needed
    startTime: z.date().nullable().optional(),
    endTime: z.date().nullable().optional()
  })),
  createAnother: z.boolean().optional(),
});

// --- Logic: Sync Dates to Times Array ---
const syncTimesArray = (
  dateRange: { start: Date; end: Date } | null,
  currentTimes: any[],
  setFieldValue: (field: string, value: any) => void
) => {
  // 1. Handle empty range
  if (!dateRange?.start || !dateRange?.end) {
    setFieldValue('times', []);
    return;
  }

  const start = new Date(dateRange.start);
  const end = new Date(dateRange.end);
  const daysCount = differenceInCalendarDays(end, start) + 1; // Inclusive

  const newTimes = [];

  for (let i = 0; i < daysCount; i++) {
    const currentDate = addDays(start, i);

    // 2. Check for existing data for this specific date
    // This preserves the time if the user changes the range (e.g. extends it)
    const existing = currentTimes?.find((t: any) =>
      t.date && isSameDay(new Date(t.date), currentDate)
    );

    if (existing) {
      newTimes.push(existing);
    } else {
      // 3. Create new entry with null times
      newTimes.push({
        date: currentDate,
        startTime: currentDate,
        endTime: currentDate,
      });
    }
  }
  setFieldValue('times', newTimes);
};

// --- Helpers ---
const formatDate = (date: Date | string) => {
  return format(new Date(date), 'EEE, MMM d'); // e.g., "Mon, Jan 1"
};

const handlePrev = () => {
  if (!flow) return;
  flow.prev();
};

const handleSubmit = async (values: Record<string, unknown>) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!flow) return;
  flow.next(values);
};
</script>
