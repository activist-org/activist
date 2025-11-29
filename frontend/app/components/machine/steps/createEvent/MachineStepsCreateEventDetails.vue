<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <Form
      id="event-details"
      @submit="signInUser"
      class="space-y-4"
      :schema="signInSchema"
      submit-label="submit"
    >
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        name="name"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormTextInput
          :id="id"
          @blur="handleBlur"
          @input="handleChange"
          :hasError="!!errorMessage.value"
          label="Name"
          :modelValue="(value.value as string)"
        />
      </FormItem>
       <FormItem v-slot="{ id, handleChange, handleBlur }" name="createAnother">
          <FormCheckbox
            :id="id"
            @blur="handleBlur"
            @update:model-value="handleChange"
            data-testid="create-another"
          />
        </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";

const { t } = useI18n();
const flow = inject<any>('flow');
const signInSchema = z.object({
  name: z.string().min(1, t("i18n.pages.auth._global.required")),
  createAnother: z.boolean().optional(),
});
onMounted(() => {
  flow.start();
});
const signInUser = async (values: Record<string, unknown>) => {
    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    flow.next(values);
};
</script>
