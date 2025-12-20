<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col" :class="classItem">
    <FormLabel
      v-if="label"
      :for="id"
      :label="label"
      :name="props.name"
      :required="required"
    />
    <slot v-bind="field" :id="id" />
    <FormErrorMessage
      :id="`${id}-error`"
      v-if="field.errorMessage"
      class="pt-2"
      :message="field.errorMessage.value"
    />
  </div>
</template>

<script setup lang="ts">
import { useField } from "vee-validate";

const props = defineProps<{
  name: string;
  label?: string;
  id?: string;
  required?: boolean;
  classItem?: string;
}>();

const id = props.id ?? `form-item-${props.name}`;
const field = useField(props.name);
</script>
