<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col" :class="classItem">
    <FormLabel
      v-if="label"
      :for="id"
      :label="label"
      :name="name"
      :required="required"
    />
    <ul>
      <slot v-bind="{ ...fieldArray, error }" :id="id" />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useFieldArray, useFieldError } from "vee-validate";

const props = defineProps<{
  name: string;
  label?: string;
  id?: string;
  required?: boolean;
  classItem?: string;
}>();

const id = props.id ?? `form-list-item-${props.name}`;
const fieldArray = useFieldArray(props.name);
const error = useFieldError(props.name);
</script>
