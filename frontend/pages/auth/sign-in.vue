<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <form @submit.prevent="signIn" class="space-y-4">
      <div class="col">
        <FormTextInput
          @update:model-value="userNameValue = $event"
          id="sign-in-username"
          :placeholder="$t('pages.auth._global.enter_user_name')"
          :model-value="userNameValue"
        />
      </div>
      <div>
        <FormTextInput
          @update:model-value="passwordValue = $event"
          id="sign-in-password"
          :placeholder="$t('_global.enter_password')"
          :is-icon-visible="true"
          input-type="password"
          :model-value="passwordValue"
          :icons="[IconMap.VISIBLE]"
        />
      </div>
      <IndicatorPasswordStrength :password-value="passwordValue" id="sign-in-password-strength"/>
      <div class="flex flex-col space-y-3">
        <FriendlyCaptcha id="sign-in-captcha"/>
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
          Forgot your password?
        </button>
        <TooltipBase
          v-if="isForgotPasswordDisabled && hovered"
          :text="$t('pages.auth.sign_in.forgot_password_captcha_tooltip')"
        />
        <BtnAction
          id="sign-in-submit"
          class="flex max-h-[48px] w-[116px] items-center justify-center truncate md:max-h-[40px] md:w-[96px]"
          :label="$t('_global.sign_in')"
          :cta="true"
          fontSize="lg"
          :ariaLabel="$t('_global.sign_in_aria_label')"
        />
      </div>
      <div class="flex pt-4 md:justify-center md:pt-6 lg:pt-8">
        <h6>{{ $t("pages.auth.sign_in.index.no_account") }}</h6>
        <NuxtLink
          id="sign-in-signup-link"
          :to="localePath('/auth/sign-up')"
          class="link-text ml-2 font-extrabold"
          >{{ $t("_global.sign_up") }}
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

const localePath = useLocalePath();

// TODO: Please change with result of captcha check and remove the comment.
const isForgotPasswordDisabled = false;
const hovered = ref(false);

const userNameValue = ref("");
const passwordValue = ref("");

const { login } = useAuth();

const signIn = async () => {
  await login(userNameValue.value, passwordValue.value);
};
</script>
