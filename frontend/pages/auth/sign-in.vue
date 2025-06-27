<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <form @submit.prevent="signInUser" class="space-y-4">
      <div class="col">
        <FormTextInput
          @input="userName = $event.target.value"
          @keydown.enter.prevent="signInUser"
          id="sign-in-username"
          :value="userName"
          :label="$t('i18n._global.enter_user_name')"
        />
      </div>
      <div>
        <FormPasswordInput
          @input="password = $event.target.value"
          @keydown.enter.prevent="signInUser"
          id="sign-in-password"
          :value="password"
          :label="$t('i18n._global.enter_password')"
        />
      </div>
      <IndicatorPasswordStrength
        id="sign-in-password-strength"
        :password-value="password"
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
          {{ $t("i18n._global.auth.reset_password_forgot_password") }}
        </button>
        <TooltipBase
          v-if="isForgotPasswordDisabled && hovered"
          :text="$t('i18n.pages.auth.sign_in.forgot_password_captcha_tooltip')"
        />
        <BtnAction
          id="sign-in-submit"
          class="flex max-h-[48px] w-[116px] items-center justify-center truncate md:max-h-[40px] md:w-[96px]"
          label="i18n._global.sign_in"
          :cta="true"
          fontSize="lg"
          ariaLabel="i18n._global.sign_in_aria_label"
        />
      </div>
      <div class="flex pt-4 md:justify-center md:pt-6 lg:pt-8">
        <h6>{{ $t("i18n.pages.auth.sign_in.index.no_account") }}</h6>
        <NuxtLink
          id="sign-in-signup-link"
          :to="localePath('/auth/sign-up')"
          class="link-text ml-2 font-extrabold"
        >
          {{ $t("i18n._global.sign_up") }}
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();

// TODO: Please change with result of captcha check and remove the comment.
const isForgotPasswordDisabled = false;
const hovered = ref(false);

const userName = ref("");
const password = ref("");

const { signIn } = useAuth();

const signInUser = async () => {
  await signIn(userName.value, password.value);
};
</script>
