<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <form @submit.prevent="signInUser" class="space-y-4">
      <div class="col">
        <FormTextInput
          @update:model-value="userNameValue = $event"
          @keydown.enter.prevent="signInUser"
          id="sign-in-username"
          :placeholder="$t(i18nMap.pages.auth._global.enter_user_name)"
          :model-value="userNameValue"
        />
      </div>
      <div>
        <FormTextInput
          @update:model-value="passwordValue = $event"
          @keydown.enter.prevent="signInUser"
          id="sign-in-password"
          :placeholder="$t(i18nMap._global.enter_password)"
          :is-icon-visible="true"
          input-type="password"
          :model-value="passwordValue"
          :icons="[IconMap.VISIBLE]"
        />
      </div>
      <IndicatorPasswordStrength
        id="sign-in-password-strength"
        :password-value="passwordValue"
      />
      <div class="flex flex-col space-y-3">
        <FriendlyCaptcha id="sign-in-captcha" />
        <button
          @click="navigateTo(localePath('/auth/reset-password'))"
          @mouseover="hovered = true"
          @focus="hovered = true"
          @mouseleave="hovered = false"
          @blur="hovered = false"
          id="sign-in-forgot-password"
          :disabled="isForgotPasswordDisabled"
          class="text-start font-bold"
          :class="{ 'link-text': !isForgotPasswordDisabled }"
        >
          {{ $t(i18nMap._global.auth.reset_password_forgot_password) }}
        </button>
        <TooltipBase
          v-if="isForgotPasswordDisabled && hovered"
          :text="$t(i18nMap.pages.auth.sign_in.forgot_password_captcha_tooltip)"
        />
        <BtnAction
          id="sign-in-submit"
          class="flex max-h-[48px] w-[116px] items-center justify-center truncate md:max-h-[40px] md:w-[96px]"
          :label="$t(i18nMap._global.sign_in)"
          :cta="true"
          fontSize="lg"
          :ariaLabel="$t(i18nMap._global.sign_in_aria_label)"
        />
      </div>
      <div class="flex pt-4 md:justify-center md:pt-6 lg:pt-8">
        <h6>{{ $t(i18nMap.pages.auth.sign_in.index.no_account) }}</h6>
        <NuxtLink
          id="sign-in-signup-link"
          :to="localePath('/auth/sign-up')"
          class="link-text ml-2 font-extrabold"
          >{{ $t(i18nMap._global.sign_up) }}
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { i18nMap } from "~/types/i18n-map";
import { IconMap } from "~/types/icon-map";

const localePath = useLocalePath();

// TODO: Please change with result of captcha check and remove the comment.
const isForgotPasswordDisabled = false;
const hovered = ref(false);

const userNameValue = ref("");
const passwordValue = ref("");

const { signIn } = useAuth();

const signInUser = async () => {
  await signIn(userNameValue.value, passwordValue.value);
};
</script>
