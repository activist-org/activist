<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Form @submit="onSubmit" :schema="schema">
    <FormItem
      v-slot="{ id, handleChange, handleBlur, errorMessage }"
      name="name"
      label="Name"
      v-model="form.name"
      :required="true"
    >
      <FormTextInput
        @input="handleChange"
        @blur="handleBlur"
        :id="id"
        :hasError="!!errorMessage.value"
        :label="'Name'"
      />
    </FormItem>
    <FormItem
      v-slot="{ id, handleChange, handleBlur, errorMessage }"
      name="email"
      label="Email"
      v-model="form.email"
      :required="true"
    >
      <FormTextInput
        @input="handleChange"
        @blur="handleBlur"
        :id="id"
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
  console.log("Form submitted with values:", values);
  emit("submit", values);
};
</script>
