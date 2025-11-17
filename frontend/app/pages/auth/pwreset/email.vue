<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-12 text-center">
    <h3 class="mb-4 p-4">
      {{ $t("i18n.pages.auth.pwreset.email.title") }}
    </h3>
    <Form
      id="sign-in"
      @submit="submit"
      class="space-y-4"
      :schema="emailResetPasswordSchema"
      submit-label="i18n.pages.auth.pwreset.email.submit"
    >
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
    </Form>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";

const t = useI18n().t;

const emailResetPasswordSchema = z.object({
  email: z
    .string()
    .email("i18n.pages.auth._global.invalid_email")
    .min(1, "i18n.pages.auth._global.required"),
});

const submit = async (values: unknown) => {
  const { email } = values as { email: string };
  const { status } = await useAsyncData(
    async () => await fetchWithoutToken(`/auth/pwreset`, {}, "POST", { email })
  );
  if (status.value === "success") {
    await useRouter().push("/");
  } else {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    showError(t("i18n.pages.auth._global.error_occurred"));
  }
};
</script>
