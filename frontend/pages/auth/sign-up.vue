<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <Form
      @submit="handleSignUp"
      id="sign-up"
      submit-label="i18n._global.sign_up"
      :schema="signUpSchema"
      class="space-y-4"
    >
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        name="userName"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormTextInput
          @input="handleChange"
          @blur="handleBlur"
          :id="id"
          :modelValue="(value.value as string)"
          :hasError="!!errorMessage.value"
          :label="$t('i18n.pages.auth._global.enter_a_user_name')"
          :data-testid="$t('i18n.pages.auth._global.enter_a_user_name')"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        name="email"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormTextInput
          @input="handleChange"
          @blur="handleBlur"
          :id="id"
          :modelValue="(value.value as string)"
          :hasError="!!errorMessage.value"
          :label="$t('i18n.pages.auth._global.enter_email')"
          :data-testid="$t('i18n.pages.auth._global.enter_email')"
        />
      </FormItem>
      <FormItem
        v-slot="{
          id,
          value: passwordRef,
          handleChange,
          handleBlur,
          errorMessage,
        }"
        class-item="space-y-4"
        name="password"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormTextInputPassword
          @update:modelValue="handleChange"
          @blur="
            () => {
              handleBlur();
              isPasswordFieldFocused = false;
            }
          "
          @focus="isPasswordFieldFocused = true"
          :id="id"
          :modelValue="(passwordRef.value as string)"
          :hasError="!!errorMessage.value"
          :label="$t('i18n._global.enter_password')"
        />
        <div class="flex flex-col space-y-4">
          <!-- prettier-ignore-attribute :passwordValue -->
          <IndicatorPasswordStrength
            id="sign-in-password-strength"
            :passwordValue="(passwordRef as Ref)"
          />
          <!-- prettier-ignore-attribute :password -->
          <TooltipPasswordRequirements
            v-if="
              checkRules((passwordRef.value || '') as string).some(
                (rule) => !rule.isValid
              ) && isPasswordFieldFocused
            "
            :password="(passwordRef as Ref)"
          />
        </div>
      </FormItem>
      <FormItem
        v-slot="{
          id,
          value: confirmPassword,
          handleChange,
          handleBlur,
          errorMessage,
        }"
        name="confirmPassword"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormTextInputPassword
          @update:modelValue="handleChange"
          @blur="handleBlur"
          :id="id"
          :modelValue="(confirmPassword.value as string)"
          :hasError="!!errorMessage.value"
          :label="$t('i18n._global.repeat_password')"
        >
          <template #icons>
            <span>
              <Icon
                :name="
                  confirmPassword.value &&
                  errorMessage.value !==
                    $t('i18n.pages.auth._global.password_not_matched')
                    ? IconMap.CHECK
                    : IconMap.X_LG
                "
                size="1.2em"
                :color="
                  confirmPassword.value &&
                  errorMessage.value !==
                    $t('i18n.pages.auth._global.password_not_matched')
                    ? '#3BA55C'
                    : '#BA3D3B'
                "
                aria-hidden="false"
                aria-labelledby="sign-up-confirm-password-match"
              />
              <title id="sign-up-confirm-password-match" class="sr-only">
                {{
                  errorMessage.value ===
                  $t("i18n.pages.auth._global.password_not_matched")
                    ? $t("i18n.pages.auth._global.passwords_do_not_match")
                    : $t("i18n.pages.auth._global.passwords_match")
                }}
              </title>
            </span>
          </template>
        </FormTextInputPassword>
      </FormItem>
      <FormItem
        v-slot="{ handleChange, value }"
        name="verifyCaptcha"
        class-item="space-y-4"
      >
        <!-- prettier-ignore-attribute v-model -->
        <FriendlyCaptcha
          v-model="(value.value as boolean)"
          @update:model-value="handleChange"
          data-testid="sign-up-captcha"
        />
      </FormItem>
      <div class="flex flex-row items-center">
        <FormItem v-slot="{ id, handleChange, handleBlur }" name="hasRead">
          <FormCheckbox
            @update:model-value="handleChange"
            @blur="handleBlur"
            :id="id"
            data-testid="sign-up-terms-checkbox"
          />
        </FormItem>
        <p class="flex flex-wrap pl-2">
          {{ $t("i18n.pages._global.terms_of_service_pt_1") }}
          <NuxtLink
            :to="localePath('/legal/privacy-policy')"
            target="_blank"
            class="link-text inline-link-underline ml-1 sm:block"
          >
            {{ $t("i18n.pages._global.terms_of_service_pt_2") }}
          </NuxtLink>
        </p>
      </div>
    </Form>
    <div class="flex items-center pt-4 md:justify-center md:pt-6 lg:pt-8">
      <h6>{{ $t("i18n.pages.auth.sign_up.have_account") }}</h6>
      <NuxtLink
        :to="localePath('/auth/sign-in')"
        class="link-text inline-link-underline ml-2 font-extrabold"
      >
        {{ $t("i18n._global.sign_in") }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FetchError } from "ofetch";
import { z } from "zod";

import { IconMap } from "~/types/icon-map";

const localePath = useLocalePath();
const { checkRules } = usePasswordRules();

const { t } = useI18n();

const signUpSchema = z
  .object({
    userName: z.string().min(1, t("i18n.pages.auth._global.required")),
    password: z.string(),
    confirmPassword: z.string(),
    email: z.string().email(t("i18n.pages.auth._global.invalid_email")),
    hasRead: z.boolean().refine((val) => val, {
      message: "i18n.pages.auth._global.required",
    }),
    verifyCaptcha: z.boolean().refine((val) => val, {
      message: t("i18n.pages.auth._global.required"),
    }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: t("i18n.pages.auth._global.password_not_matched"),
        path: ["confirmPassword"],
      });
    }
    if (password && checkRules(password).some((rule) => !rule.isValid)) {
      ctx.addIssue({
        code: "custom",
        message: t("i18n.pages.auth._global.password_rule_not_correct"),
        path: ["password"],
      });
    }
  });

const { signUp } = useAuth();
const { showError } = useToaster();
const isPasswordFieldFocused = ref(false);

const handleSignUp = async (values: unknown) => {
  try {
    await signUp(
      {
        username: (values as Record<string, unknown>).userName as string,
        password: (values as Record<string, unknown>).password as string,
        email: (values as Record<string, unknown>).email as string,
        passwordConfirmed: (values as Record<string, unknown>)
          .confirmPassword as string,
      },
      { preventLoginFlow: true }
    );
    navigateTo(localePath("/auth/confirm/email"));
  } catch (error) {
    if (error && error instanceof FetchError) {
      if (error.response?._data instanceof String) {
        showError(error.response?._data as string);
        return;
      }
      // Join all error messages into a single string.
      const message =
        Object.values(error.response?._data).join(", ") ||
        t("i18n.pages.auth._global.error_occurred");
      showError(message);
    }
  }
};
</script>
