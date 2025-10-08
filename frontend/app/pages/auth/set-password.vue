<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <form class="space-y-4">
      <FormTextInput
        id="set-password-username"
        @input="userName = $event.target.value"
        :data-testid="$t('i18n.pages.auth._global.enter_a_user_name')"
        :label="$t('i18n.pages.auth._global.enter_a_user_name')"
        :value="userName"
      />
      <FormTextInputPassword
        id="set-password-password"
        @blur="isPasswordFocused = false"
        @focus="isPasswordFocused = true"
        @input="handlePasswordInput"
        :data-testid="$t('i18n._global.enter_password')"
        :hasError="showPasswordError.border"
        :label="$t('i18n._global.enter_password')"
        :value="password"
      />
      <IndicatorPasswordStrength :password-value="password" />
      <!-- <TooltipPasswordRequirements
        v-if="showPasswordError.tooltip"
        :rules="rules"
      /> -->
      <FormTextInputPassword
        id="set-password-confirm-password"
        @input="confirmPassword = $event.target.value"
        :data-testid="$t('i18n._global.repeat_password')"
        :label="$t('i18n._global.repeat_password')"
        :value="confirmPassword"
      >
        <template #icons>
          <span>
            <Icon
              aria-hidden="false"
              aria-labelledby="set-password-confirm-password-match"
              :color="doPasswordsMatch ? '#3BA55C' : '#BA3D3B'"
              :name="doPasswordsMatch ? IconMap.CHECK : IconMap.X_LG"
              size="1.2em"
            />
            <title id="set-password-confirm-password-match" class="sr-only">
              {{
                doPasswordsMatch
                  ? $t("i18n.pages.auth._global.passwords_match")
                  : $t("i18n.pages.auth._global.passwords_do_not_match")
              }}
            </title>
          </span>
        </template>
      </FormTextInputPassword>
      <div class="pt-4">
        <BtnAction
          ariaLabel="i18n.pages.auth.set_password.set_password"
          class="flex max-h-[48px] items-center justify-center truncate md:max-h-[40px]"
          :cta="true"
          fontSize="lg"
          label="i18n.pages.auth.set_password.set_password"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

const userName = ref("");
const password = ref("");
const confirmPassword = ref("");
const isPasswordFocused = ref(false);

const { isPasswordMatch } = usePasswordRules();

const doPasswordsMatch = computed<boolean>(() =>
  isPasswordMatch(password.value, confirmPassword.value)
);

const showPasswordError = computed<{ border: boolean; tooltip: boolean }>(
  () => {
    const error = password.value.length > 0;
    return {
      border: !isPasswordFocused.value && error,
      tooltip: isPasswordFocused.value && error,
    };
  }
);

const handlePasswordInput = (event: Event & { target: HTMLInputElement }) => {
  password.value = event.target.value;
  // checkRules(event);
};
</script>
