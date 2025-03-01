<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <form @submit.prevent="signUp" @enter="signUp" class="space-y-4">
      <div class="col">
        <FormTextInput
          @update:model-value="userNameValue = $event"
          :placeholder="$t('i18n.pages.auth.sign_up.index.enter_user_name')"
          :model-value="userNameValue"
        />
      </div>
      <div>
        <FormTextInput
          @update:model-value="passwordValue = $event"
          @input="checkRules"
          @blurred="
            isBlurred = true;
            isFocused = false;
          "
          @focused="
            isFocused = true;
            isBlurred = false;
          "
          :placeholder="$t('i18n._global.enter_password')"
          :is-icon-visible="true"
          input-type="password"
          :model-value="passwordValue"
          :icons="[IconMap.VISIBLE]"
          :error="!isAllRulesValid && isBlurred"
        />
      </div>
      <IndicatorPasswordStrength :password-value="passwordValue" />
      <TooltipPasswordRequirements
        v-if="
          !!passwordValue?.length &&
          !isAllRulesValid &&
          (!isBlurred || isFocused)
        "
        :rules="rules"
      />
      <div>
        <FormTextInput
          @update:model-value="confirmPasswordValue = $event"
          :placeholder="$t('i18n._global.repeat_password')"
          :is-icon-visible="true"
          input-type="password"
          :model-value="confirmPasswordValue"
          :icons="
            isPasswordMatch(passwordValue, confirmPasswordValue)
              ? [IconMap.CHECK, IconMap.VISIBLE]
              : [IconMap.X_LG, IconMap.VISIBLE]
          "
        />
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
              >{{ $t("i18n.pages._global.terms_of_service_pt_2") }}
            </NuxtLink>
          </p>
        </div>
        <BtnAction
          class="flex max-h-[48px] w-[116px] items-center justify-center truncate md:max-h-[40px] md:w-[96px]"
          :label="'_global.sign_up'"
          :cta="true"
          fontSize="lg"
          :ariaLabel="'_global.sign_up_aria_label'"
        />
      </div>
      <div class="flex justify-center pt-4 md:pt-6 lg:pt-8">
        <h6>{{ $t("i18n.pages.auth.sign_up.index.have_account") }}</h6>
        <NuxtLink
          :to="localePath('/auth/sign-in')"
          class="link-text ml-2 font-extrabold"
          >{{ $t("i18n._global.sign_in") }}</NuxtLink
        >
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

const localePath = useLocalePath();

const userNameValue = ref("");
const passwordValue = ref("");
const confirmPasswordValue = ref("");
const hasRed = ref(false);
const isBlurred = ref(false);
const isFocused = ref(false);

const { rules, isAllRulesValid, checkRules, isPasswordMatch } =
  usePasswordRules();

const signUp = () => {};
</script>
