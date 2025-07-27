<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div>
    <form @submit.prevent="onSubmit" :id="id">
      <div class="flex flex-col gap-y-4">
        <div class="grid gap-y-4">
          <slot />
        </div>
        <BtnAction
          v-if="props.isThereSubmitButton"
          :id="submitId"
          class="flex items-center justify-center"
          :class="props.classButton"
          :label="labelForSubmit"
          :cta="true"
          fontSize="lg"
          ariaLabel="i18n.components.submit_aria_label"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { z } from "zod";

import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";

const props = withDefaults(
  defineProps<{
    schema: z.Schema;
    class?: string;
    id?: string;
    classButton?: string;
    submitLabel?: string;
    initialValues?: Record<string, unknown>;
    sendOnChange?: boolean;
    isThereSubmitButton?: boolean;
  }>(),
  {
    isThereSubmitButton: true,
  }
);

const labelForSubmit = props.submitLabel ?? "i18n.components.submit";

const id = props.id || "form-id";
const submitId = props.id ? `${props.id}-submit` : "form-submit-id";

const { handleSubmit, values } = useForm({
  validationSchema: toTypedSchema(props.schema),
  initialValues: props.initialValues,
});
const emit = defineEmits<{
  (e: "submit", values: Record<string, unknown>): void;
}>();
if (props.sendOnChange) {
  // This will emit the submit event on every change
  // Useful for forms that need to be submitted on every change
  watch(
    values,
    (newValues) => {
      emit("submit", newValues);
    },
    {
      deep: true,
    }
  );
}
const onSubmit = handleSubmit((values) => {
  emit("submit", values);
});
</script>
