<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <Form
      @submit="signInUser"
      id="sign-in"
      class="space-y-4"
      :schema="signInSchema"
      submit-label="i18n._global.sign_in"
    >
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage }"
        name="userName"
      >
        <FormTextInput
          @input="handleChange"
          @blur="handleBlur"
          :id="id"
          :hasError="!!errorMessage.value"
          :label="$t('i18n.pages.auth.sign_in.enter_user_name')"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, value, handleChange, handleBlur, errorMessage }"
        name="password"
      >
        <div class="flex flex-col space-y-4">
          <FormTextInputPassword
            @input="handleChange"
            @blur="handleBlur"
            :id="id"
            :hasError="!!errorMessage.value"
            :label="$t('i18n._global.enter_password')"
          />
          <IndicatorPasswordStrength
            id="sign-in-password-strength"
            :passwordValue="value as Ref"
          />
        </div>
      </FormItem>
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
      </div>
    </Form>
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
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";

const { t } = useI18n();

const signInSchema = z.object({
  userName: z.string().min(1, t("i18n.pages.auth._global.required")),
  password: z.string().min(1, t("i18n.pages.auth._global.required")),
});
const localePath = useLocalePath();

// TODO: Please change with result of captcha check and remove the comment.
const isForgotPasswordDisabled = false;
const hovered = ref(false);

const { signIn } = useAuth();

const signInUser = async (values: Record<string, unknown>) => {
  const { userName, password } = values;
  await signIn(userName as string, password as string);
};
</script>
