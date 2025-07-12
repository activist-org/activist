<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <Form
      @submit="signUp"
      id="sign-up"
      submit-label="i18n._global.sign_up"
      :schema="signUpSchema"
      class="space-y-4"
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
          :label="$t('i18n.pages.auth._global.enter_a_user_name')"
          :data-testid="$t('i18n.pages.auth._global.enter_a_user_name')"
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
          :modelValue="passwordRef.value as string"
          :hasError="!!errorMessage.value"
          :label="$t('i18n._global.enter_password')"
        />
        <div class="flex flex-col space-y-4">
          <IndicatorPasswordStrength
            id="sign-in-password-strength"
            :passwordValue="passwordRef as Ref"
          />
          <TooltipPasswordRequirements
            v-if="
              checkRules((passwordRef.value || '') as string).some(
                (rule) => !rule.isValid
              ) && isPasswordFieldFocused
            "
            :password="passwordRef as Ref"
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
        <FormTextInputPassword
          @update:modelValue="handleChange"
          @blur="handleBlur"
          :id="id"
          :modelValue="confirmPassword.value as string"
          :hasError="!!errorMessage.value"
          :label="$t('i18n._global.repeat_password')"
        >
          <template #icons>
            <span>
              <Icon
                :name="
                  confirmPassword.value &&
                  errorMessage.value !==
                    t('i18n.pages.auth.sign_up.password_not_matched')
                    ? IconMap.CHECK
                    : IconMap.X_LG
                "
                size="1.2em"
                :color="
                  confirmPassword.value &&
                  errorMessage.value !==
                    t('i18n.pages.auth.sign_up.password_not_matched')
                    ? '#3BA55C'
                    : '#BA3D3B'
                "
                aria-hidden="false"
                aria-labelledby="sign-up-confirm-password-match"
              />
              <title id="sign-up-confirm-password-match" class="sr-only">
                {{
                  errorMessage.value ===
                  t("i18n.pages.auth.sign_up.password_not_matched")
                    ? $t("i18n.pages.auth._global.passwords_do_not_match")
                    : $t("i18n.pages.auth._global.passwords_match")
                }}
              </title>
            </span>
          </template>
        </FormTextInputPassword>
      </FormItem>

      <FormItem
        v-slot="{ id, handleChange, handleBlur }"
        name="hasRead"
        class-item="space-y-4"
      >
        <FriendlyCaptcha />
        <div class="flex flex-row items-center">
          <FormCheckbox @input="handleChange" @blur="handleBlur" :id="id" />
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
      </FormItem>
    </Form>

    <div class="flex justify-center pt-4 md:pt-6 lg:pt-8">
      <h6>{{ $t("i18n.pages.auth.sign_up.have_account") }}</h6>
      <NuxtLink
        :to="localePath('/auth/sign-in')"
        class="link-text ml-2 font-extrabold"
      >
        {{ $t("i18n._global.sign_in") }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
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
    // FIXME: This is commented out because Checkbox is not implemented yet.
    // hasRead: z.boolean().refine((val) => val, {
    //   message: "i18n.pages.auth._global.required",
    // })
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: t("i18n.pages.auth.sign_up.password_not_matched"),
        path: ["confirmPassword"],
      });
    }
    if (password && checkRules(password).some((rule) => !rule.isValid)) {
      ctx.addIssue({
        code: "custom",
        message: t("i18n.pages.auth.sign_up.password_rule_not_correct"),
        path: ["password"],
      });
    }
  });
const isPasswordFieldFocused = ref(false);

const signUp = () => {};
</script>
