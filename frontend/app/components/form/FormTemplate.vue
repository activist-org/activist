<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Form @submit="onSubmit" :schema="schema">
    <FormItem
      v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
      label="Name"
      name="name"
      :required="true"
    >
      <!-- prettier-ignore-attribute :modelValue -->
      <FormTextInput
        :id="id"
        @blur="handleBlur"
        @input="handleChange"
        :hasError="!!errorMessage.value"
        :label="'Name'"
        :modelValue="(value.value as string)"
      />
    </FormItem>
    <FormItem
      v-slot="{ id, handleChange, handleBlur, errorMessage }"
      label="Email"
      name="email"
      :required="true"
    >
      <FormTextInput
        :id="id"
        @blur="handleBlur"
        @input="handleChange"
        :hasError="!!errorMessage.value"
        :label="'email'"
      />
    </FormItem>
  </Form>
</template>

<script setup lang="ts">
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

const emit = defineEmits<{
  (e: "submit", values: Record<string, unknown>): void;
}>();

const onSubmit = (values: Record<string, unknown>) => {
  emit("submit", values);
};
</script>
