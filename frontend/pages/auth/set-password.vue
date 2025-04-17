<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <form class="space-y-4">
      <FormTextInput
        @input="userName = $event.target.value"
        id="set-password-username"
        :value="userName"
        :label="$t('i18n.pages.auth._global.enter_a_user_name')"
        :data-testid="$t('i18n.pages.auth._global.enter_a_user_name')"
      />
      <FormPasswordInput
        @input="handlePasswordInput"
        @blur="isPasswordFocused = false"
        @focus="isPasswordFocused = true"
        id="set-password-password"
        :value="password"
        :label="$t('i18n._global.enter_password')"
        :data-testid="$t('i18n._global.enter_password')"
        :hasError="showPasswordError.border"
      />
      <IndicatorPasswordStrength :password-value="password" />
      <TooltipPasswordRequirements
        v-if="showPasswordError.tooltip"
        :rules="rules"
      />
      <FormPasswordInput
        @input="confirmPassword = $event.target.value"
        id="set-password-confirm-password"
        :value="confirmPassword"
        :label="$t('i18n._global.repeat_password')"
        :data-testid="$t('i18n._global.repeat_password')"
      >
        <template #icons>
          <span>
            <Icon
              :name="doPasswordsMatch ? IconMap.CHECK : IconMap.X_LG"
              size="1.2em"
              :color="doPasswordsMatch ? '#3BA55C' : '#BA3D3B'"
              aria-hidden="false"
              aria-labelledby="set-password-confirm-password-match"
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
      </FormPasswordInput>
      <div class="pt-4">
        <BtnAction
          class="flex max-h-[48px] items-center justify-center truncate md:max-h-[40px]"
          :label="$t('i18n.pages.auth.set_password.set_password')"
          :cta="true"
          fontSize="lg"
          :ariaLabel="$t('i18n.pages.auth.set_password.set_password')"
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

const { rules, isAllRulesValid, checkRules, isPasswordMatch } =
  usePasswordRules();

const doPasswordsMatch = computed<boolean>(() =>
  isPasswordMatch(password.value, confirmPassword.value)
);

const showPasswordError = computed<{ border: boolean; tooltip: boolean }>(
  () => {
    const error = password.value.length > 0 && !isAllRulesValid.value;
    return {
      border: !isPasswordFocused.value && error,
      tooltip: isPasswordFocused.value && error,
    };
  }
);

const handlePasswordInput = (event: Event & { target: HTMLInputElement }) => {
  password.value = event.target.value;
  checkRules(event);
};
</script>
