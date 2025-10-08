<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <FormTextInput
    :id="id"
    :hasError="hasError"
    :label="label"
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
import { IconMap } from "~/types/icon-map";

export interface Props {
  id: string;
  label: string;
  hasError?: boolean;
}

withDefaults(defineProps<Props>(), {
  hasError: false,
});

const isPassword = ref<boolean>(true);

const changeInputType = () => {
  isPassword.value = !isPassword.value;
};
</script>
