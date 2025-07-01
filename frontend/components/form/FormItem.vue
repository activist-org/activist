<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col">
    <FormLabel :name="name" :label="label" :required="required" :for="id" />
    <slot v-bind="field" :id="id" />
    <FormErrorMessage
      v-if="field.errorMessage"
      :id="`${id}-error`"
      class="pt-2"
      :message="field.errorMessage.value"
    />
  </div>
</template>

<script setup lang="ts">
import { useField } from "vee-validate";

const props = defineProps<{
  name: string;
  label: string;
  id?: string;
  required?: boolean;
}>();

const id = props.id ?? `form-item-${props.name}`;
const field = useField(props.name);
</script>
