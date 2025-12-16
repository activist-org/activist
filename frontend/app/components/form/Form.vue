<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div :class="props.class">
    <form
      :id="id"
      @keydown.enter.prevent="onSubmit"
      @submit.prevent="onSubmit"
      role="form"
    >
      <div class="flex flex-col gap-y-4">
        <div class="grid gap-y-4">
          <slot />
        </div>
        <div class="flex items-center justify-between mt-4">
          <template v-if="props.actionButtons && props.actionButtons.length > 0" v-for="btn in props.actionButtons" :key="btn.id || btn.label">
                  <BtnAction
                    class="flex items-center justify-center ml-2"
                    :label="btn.label"
                    v-bind="btn"
                  />
                </template>
        <BtnAction
          :id="submitId"
          v-if="props.isThereSubmitButton"
          ariaLabel="i18n.components.submit_aria_label"
          class="flex items-center justify-center"
          :class="props.classButton"
          :cta="true"
          fontSize="lg"
          :label="labelForSubmit"
          type="submit"
        />
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { z } from "zod";

import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
type Btn = BtnAction & { [key: string]: unknown };
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
    actionButtons?: Btn[];
  }>(),
  {
    isThereSubmitButton: true
  },
);

const labelForSubmit = props.submitLabel ?? "i18n.components.submit";

const id = props.id || "form-id";
const submitId = props.id ? `${props.id}-submit` : "form-submit-id";

const { handleSubmit, values } = useForm({
  validationSchema: toTypedSchema(props.schema),
  initialValues: props.initialValues,
});
provide("formValues", values);
const emit = defineEmits<{
  (e: "submit", values: Record<string, unknown>): void;
}>();
if (props.sendOnChange) {
  // This will emit the submit event on every change.
  // Useful for forms that need to be submitted on every change.
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
