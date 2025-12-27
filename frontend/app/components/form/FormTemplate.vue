<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<!-- Note: This is a template form to demonstrate how to create forms. Labels are not localized on purpose. -->
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
    <FormListItem
      v-slot="{ fields, push, remove }"
      label="Family Members"
      name="familyMembers"
    >
      <template v-for="(field, index) in fields.value" :key="field.key">
        <FormItem
          v-slot="{ id, handleChange, handleBlur, errorMessage }"
          label="Family members name"
          :name="`familyMembers.${index}.name`"
          :required="true"
        >
          <FormTextInput
            :id="id"
            @blur="handleBlur"
            @input="handleChange"
            :hasError="!!errorMessage.value"
            label="family members name"
          />
        </FormItem>
        <BtnAction
          @click="remove(index)"
          ariaLabel="family-member-remove-aria-label"
          :cta="false"
          fontSize="base"
          label="Remove Member"
        />
      </template>
      <BtnAction
        @click="
          push({
            link: '',
            label: '',
            order: fields.value.length,
            id: '',
            key: String(Date.now()) + '-' + fields.value.length,
          })
        "
        ariaLabel="family-member-add-aria-label"
        :cta="true"
        fontSize="base"
        label="Add Member"
      />
    </FormListItem>
  </Form>
</template>

<script setup lang="ts">
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  familyMembers: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
    })
  ),
});

const emit = defineEmits<{
  (e: "submit", values: Record<string, unknown>): void;
}>();

const onSubmit = (values: Record<string, unknown>) => {
  emit("submit", values);
};
</script>
