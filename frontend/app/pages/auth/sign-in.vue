<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <Form
      id="sign-in"
      @submit="signInUser"
      class="space-y-4"
      :schema="signInSchema"
      submit-label="i18n._global.sign_in"
    >
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        name="userName"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormTextInput
          :id="id"
          @blur="handleBlur"
          @input="handleChange"
          :hasError="!!errorMessage.value"
          :label="$t('i18n.pages.auth.sign_in.enter_user_name')"
          :modelValue="(value.value as string)"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, value, handleChange, handleBlur, errorMessage }"
        name="password"
      >
        <div class="flex flex-col space-y-4">
          <!-- prettier-ignore-attribute :modelValue -->
          <FormTextInputPassword
            :id="id"
            @blur="handleBlur"
            @input="handleChange"
            :hasError="!!errorMessage.value"
            :label="$t('i18n._global.enter_password')"
            :modelValue="(value.value as string)"
          />
          <IndicatorPasswordStrength
            id="sign-in-password-strength"
            :passwordValue="value as Ref"
          />
        </div>
      </FormItem>
      <div class="flex flex-col space-y-3">
        <FormItem v-slot="{ id, handleChange, value }" name="verifyCaptcha">
          <!-- prettier-ignore-attribute v-model -->
          <FriendlyCaptcha
            :id="id"
            v-model="(value.value as boolean)"
            @update:model-value="handleChange"
          />
        </FormItem>
        <button
          id="sign-in-forgot-password"
          @blur="hovered = false"
          @click="navigateTo(localePath('/auth/pwreset/email'))"
          @focus="hovered = true"
          @mouseleave="hovered = false"
          @mouseover="hovered = true"
          class="inline-link-underline w-fit text-start font-bold"
          :class="{ 'link-text': !isForgotPasswordDisabled }"
          :disabled="isForgotPasswordDisabled"
        >
          {{ $t("i18n._global.auth.reset_password_forgot_password") }}
        </button>
        <TooltipBase
          v-if="isForgotPasswordDisabled && hovered"
          :text="$t('i18n.pages.auth.sign_in.forgot_password_captcha_tooltip')"
        />
      </div>
    </Form>
    <div class="flex items-center pt-4 md:justify-center md:pt-6 lg:pt-8">
      <h6>{{ $t("i18n.pages.auth.sign_in.index.no_account") }}</h6>
      <NuxtLink
        id="sign-in-signup-link"
        class="link-text inline-link-underline ml-2 font-extrabold"
        :to="localePath('/auth/sign-up')"
      >
        {{ $t("i18n._global.sign_up") }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FetchError } from "ofetch";
import { z } from "zod";

const { t } = useI18n();

const signInSchema = z.object({
  userName: z.string().min(1, t("i18n._global.required")),
  password: z.string().min(1, t("i18n._global.required")),
  verifyCaptcha: z.boolean().refine((val) => val, {
    message: t("i18n._global.required"),
  }),
});
const localePath = useLocalePath();

// TODO: Please change with result of captcha check and remove the comment.
const isForgotPasswordDisabled = false;
const hovered = ref(false);

const { signIn } = useAuth();
const { showToastError } = useToaster();

const signInUser = async (values: Record<string, unknown>) => {
  try {
    const { userName, password } = values;
    await signIn(
      {
        username: userName as string,
        password: password as string,
      },
      { callbackUrl: "/home", external: false }
    );
  } catch (error) {
    if (error instanceof FetchError && error?.response?.status === 400) {
      showToastError(t("i18n.pages.auth.sign_in.invalid_credentials"));
    } else {
      showToastError(t("i18n.pages.auth._global.error_occurred"));
    }
  }
};
</script>
