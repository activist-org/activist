<template>
  <input
    class="field"
    v-bind="{ ...$attrs, onChange: updateValue }"
    :checked="modelValue === value"
    :id="uuid"
    type="checkbox"
  />
  <label v-if="label" :for="uuid">
    {{ label }}
  </label>
  <BaseErrorMessage v-if="error" :id="`${uuid}-error`">
    {{ error }}
  </BaseErrorMessage>
</template>

<script setup lang="ts">
import useFormInput from "../../composables/useFormSetup";
import useUniqueID from "../../composables/useUniqueID";

const props = defineProps({
  label: {
    type: string,
    default: "",
  },
  modelValue: {
    type: boolean,
  },
  error: {
    type: string,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);
const { updateValue } = useFormInput(props, emit);
const uuid = useUniqueID().getID().toString();
</script>
