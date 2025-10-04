<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <p>{{ $t("i18n.pages.auth.pwreset.code.please_enter_new_password") }}</p>
    <Form
      @submit="handleSubmit"
      id="reset-password"
      :schema="resetPasswordSchema"
    >
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
    </Form>
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "#shared/types/icon-map";
import { z } from "zod";
const localePath = useLocalePath();
const { checkRules } = usePasswordRules();

const { t } = useI18n();

const resetPasswordSchema = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
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

const handleSubmit = async (values: unknown) => {
  const { password } = values as { password: string };
  const { status } = await useAsyncData(
    async () =>
      await fetchWithoutToken(
        `/auth/verify_email_password/${useRoute().params.code}`,
        {},
        "POST",
        { new_password: password }
      )
  );
  if (status.value === "success") {
    navigateTo(localePath("/auth/sign-in"));
  } else {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    showToastError(t("i18n.pages.auth._global.error_occurred"));
  }
};
</script>
