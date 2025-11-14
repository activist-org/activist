<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <FormTextInput
    :id="id"
    @update:modelValue="(val) => emit('update:modelValue', val)"
    :hasError="hasError"
    :label="label"
    :modelValue="modelValue"
    :type="isPassword ? 'password' : 'text'"
  >
    <template #icons>
      <slot name="icons"></slot>
      <button
        :id="`${id}-show-password`"
        @click="changeInputType"
        :aria-label="
          isPassword
            ? $t(
                'i18n.components.form_text_input_password.show_password_aria_label'
              )
            : $t(
                'i18n.components.form_text_input_password.hide_password_aria_label'
              )
        "
        :data-testid="`${id}-show-password`"
        type="button"
      >
        <Icon
          :name="isPassword ? IconMap.VISIBLE : IconMap.HIDDEN"
          size="1.4em"
        />
      </button>
    </template>
  </FormTextInput>
</template>

<script setup lang="ts">

export interface Props {
  id: string;
  label: string;
  hasError?: boolean;
  modelValue?: string;
}

withDefaults(defineProps<Props>(), {
  hasError: false,
  modelValue: "",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const isPassword = ref<boolean>(true);

const changeInputType = () => {
  isPassword.value = !isPassword.value;
};
</script>
