<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <form @submit.prevent="signUp" @enter="signUp" class="space-y-4">
      <div class="col">
        <FormTextInput
          @input="userName = $event.target.value"
          id="sign-up-username"
          :value="userName"
          :label="$t('i18n.pages.auth._global.enter_a_user_name')"
          :data-testid="$t('i18n.pages.auth._global.enter_a_user_name')"
        />
      </div>
      <div>
        <FormPasswordInput
          @input="handlePasswordInput"
          @blur="isPasswordFocused = false"
          @focus="isPasswordFocused = true"
          id="sign-up-password"
          :value="password"
          :label="$t('i18n._global.enter_password')"
          :data-testid="$t('i18n._global.enter_password')"
          :hasError="showPasswordError.border"
        />
      </div>
      <IndicatorPasswordStrength :password-value="password" />
      <TooltipPasswordRequirements
        v-if="showPasswordError.tooltip"
        :rules="rules"
      />
      <div>
        <FormPasswordInput
          @input="confirmPassword = $event.target.value"
          id="sign-up-confirm-password"
          :value="confirmPassword"
          :label="$t('i18n._global.repeat_password')"
          :data-testid="$t('i18n._global.repeat_password')"
        >
          <template #icons>
            <span>
              <Icon
                v-if="doPasswordsMatch"
                :name="IconMap.CHECK"
                size="1.2em"
                color="#3BA55C"
                data-testid="extra-icon"
              />
              <Icon
                v-else
                :name="IconMap.X_LG"
                size="1.2em"
                color="#BA3D3B"
                data-testid="extra-icon"
              />
            </span>
          </template>
        </FormPasswordInput>
      </div>
      <div class="flex flex-col space-y-3">
        <FriendlyCaptcha />
        <div class="flex flex-row items-center">
          <FormCheckbox
            @update:modelValue="hasRed = $event"
            :modelValue="hasRed"
            value="yes"
          />
          <p class="flex flex-wrap pl-2">
            {{ $t("i18n.pages._global.terms_of_service_pt_1") }}
            <NuxtLink
              :to="localePath('/legal/privacy-policy')"
              target="_blank"
              class="link-text ml-1 sm:block"
            >
              {{ $t("i18n.pages._global.terms_of_service_pt_2") }}
            </NuxtLink>
          </p>
        </div>
        <BtnAction
          class="flex max-h-[48px] w-[116px] items-center justify-center truncate md:max-h-[40px] md:w-[96px]"
          :label="'i18n._global.sign_up'"
          :cta="true"
          fontSize="lg"
          :ariaLabel="'i18n._global.sign_up_aria_label'"
        />
      </div>
      <div class="flex justify-center pt-4 md:pt-6 lg:pt-8">
        <h6>{{ $t("i18n.pages.auth.sign_up.have_account") }}</h6>
        <NuxtLink
          :to="localePath('/auth/sign-in')"
          class="link-text ml-2 font-extrabold"
        >
          {{ $t("i18n._global.sign_in") }}
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

const localePath = useLocalePath();

const userName = ref("");
const password = ref("");
const confirmPassword = ref("");
const hasRed = ref(false);
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

const signUp = () => {};
</script>
