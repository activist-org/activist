<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <Form
      id="sign-up"
      @submit="handleSignUp"
      class="space-y-4"
      :schema="signUpSchema"
      submit-label="i18n._global.sign_up"
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
          :data-testid="$t('i18n.pages.auth._global.enter_a_user_name')"
          :hasError="!!errorMessage.value"
          :label="$t('i18n.pages.auth._global.enter_a_user_name')"
          :modelValue="(value.value as string)"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        name="email"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormTextInput
          :id="id"
          @blur="handleBlur"
          @input="handleChange"
          :data-testid="$t('i18n.pages.auth._global.enter_email')"
          :hasError="!!errorMessage.value"
          :label="$t('i18n.pages.auth._global.enter_email')"
          :modelValue="(value.value as string)"
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
          :id="id"
          @blur="
            () => {
              handleBlur();
              isPasswordFieldFocused = false;
            }
          "
          @focus="isPasswordFieldFocused = true"
          @update:modelValue="handleChange"
          :hasError="!!errorMessage.value"
          :label="$t('i18n._global.enter_password')"
          :modelValue="(passwordRef.value as string)"
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
          :id="id"
          @blur="handleBlur"
          @update:modelValue="handleChange"
          :hasError="!!errorMessage.value"
          :label="$t('i18n._global.repeat_password')"
          :modelValue="(confirmPassword.value as string)"
        >
          <template #icons>
            <span>
              <Icon
                aria-hidden="false"
                aria-labelledby="sign-up-confirm-password-match"
                :color="
                  confirmPassword.value &&
                  errorMessage.value !==
                    $t('i18n.pages.auth._global.password_not_matched')
                    ? '#3BA55C'
                    : '#BA3D3B'
                "
                :name="
                  confirmPassword.value &&
                  errorMessage.value !==
                    $t('i18n.pages.auth._global.password_not_matched')
                    ? IconMap.CHECK
                    : IconMap.X_LG
                "
                size="1.2em"
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
        class-item="space-y-4"
        name="verifyCaptcha"
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
            :id="id"
            @blur="handleBlur"
            @update:model-value="handleChange"
            data-testid="sign-up-terms-checkbox"
          />
        </FormItem>
        <p class="flex flex-wrap pl-2">
          {{ $t("i18n.pages._global.terms_of_service_pt_1") }}
          <NuxtLink
            class="link-text inline-link-underline ml-1 sm:block"
            target="_blank"
            :to="localePath('/legal/privacy-policy')"
          >
            {{ $t("i18n.pages._global.terms_of_service_pt_2") }}
          </NuxtLink>
        </p>
      </div>
    </Form>
    <div class="flex items-center pt-4 md:justify-center md:pt-6 lg:pt-8">
      <h6>{{ $t("i18n.pages.auth.sign_up.have_account") }}</h6>
      <NuxtLink
        class="link-text inline-link-underline ml-2 font-extrabold"
        :to="localePath('/auth/sign-in')"
      >
        {{ $t("i18n._global.sign_in") }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FetchError } from "ofetch";
import { z } from "zod";

const localePath = useLocalePath();
const { checkRules } = usePasswordRules();

const { t } = useI18n();

const signUpSchema = z
  .object({
    userName: z.string().min(1, t("i18n._global.required")),
    password: z.string(),
    confirmPassword: z.string(),
    email: z.string().email(t("i18n.pages.auth._global.invalid_email")),
    hasRead: z.boolean().refine((val) => val, {
      message: t("i18n._global.required"),
    }),
    verifyCaptcha: z.boolean().refine((val) => val, {
      message: t("i18n._global.required"),
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

const { showToastError } = useToaster();
const isPasswordFieldFocused = ref(false);

const handleSignUp = async (values: unknown) => {
  try {
    await $fetch("/api/public/sign_up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        username: (values as Record<string, unknown>).userName as string,
        password: (values as Record<string, unknown>).password as string,
        email: (values as Record<string, unknown>).email as string,
        passwordConfirmed: (values as Record<string, unknown>)
          .confirmPassword as string,
      },
    });
    navigateTo(localePath("/auth/confirm/email"));
  } catch (error) {
    if (error && error instanceof FetchError) {
      if (error.response?._data instanceof String) {
        showToastError(error.response?._data as string);
        return;
      }
      // Join all error messages into a single string.
      const message =
        Object.values(error.response?._data).join(", ") ||
        t("i18n.pages.auth._global.error_occurred");
      showToastError(message);
    }
  }
};
</script>
