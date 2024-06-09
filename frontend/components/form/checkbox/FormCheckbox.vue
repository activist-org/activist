<template>
  <div class="relative flex flex-row items-center justify-start">
    <FormKit
      :id="uuid"
      type="checkbox"
      v-bind="{ ...$attrs, onChange: updateValue }"
      :checked="modelValue"
      validation="accepted"
      validation-label="terms and conditions"
      :classes="{
        input:
          'absolute bg-light-button dark:bg-dark-button peer mb-0 h-[1.375rem] w-[1.375rem] cursor-pointer appearance-none rounded-sm border border-light-menu-selection dark:border-dark-menu-selection',
        label: 'ml-7 inline-block',
        checkedIndicator:
          'pointer-events-none absolute left-[0.2rem] hidden h-[1rem] w-[1rem] rounded-sm bg-light-menu-selection peer-checked:block dark:bg-dark-menu-selection',
      }"
    >
      <template #label="context">
        <label :for="uuid" :class="context.classes.label">
          <p>
            {{ $t("pages._global.terms-of-service-pt-1") }}
            <a href="#" class="text-blue-500">
              {{ $t("pages._global.terms-of-service-pt-2") }} </a
            >.*
          </p>
        </label>
        <div :class="context.classes.checkedIndicator"></div>
      </template>
    </FormKit>
    <!--
    <input
      :id="uuid"
      class="bg-light-button dark:bg-dark-button focus-brand peer mb-0 h-[1.375rem] w-[1.375rem] cursor-pointer appearance-none rounded-sm border border-light-menu-selection dark:border-dark-menu-selection"
      type="checkbox"
      v-bind="{ ...$attrs, onChange: updateValue }"
      :checked="modelValue"
      required
    />
    <label for="terms" class="ml-2 flex font-medium">
      <p>{{ $t("pages._global.terms-of-service-pt-1") }}&nbsp;</p>
      <a href="#" class="text-blue-500">{{
        $t("pages._global.terms-of-service-pt-2")
      }}</a>
      <p>.</p>
    </label>
    -->
    <!--
    <div
      class="pointer-events-none absolute left-[0.2rem] hidden h-[1rem] w-[1rem] rounded-sm bg-light-menu-selection peer-checked:block dark:bg-dark-menu-selection"
    ></div>
    <label
      v-if="label"
      class="ml-2 inline-block cursor-pointer select-none text-lg"
      :for="uuid"
    >
      {{ label }}
    </label>
    -->
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import useFormInput from "~/composables/useFormSetup";

export interface Props {
  label?: string;
  modelValue?: boolean;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  error: "",
});

const emit = defineEmits(["update:modelValue"]);
const { updateValue } = useFormInput(props, emit);
const uuid = uuidv4();
</script>
