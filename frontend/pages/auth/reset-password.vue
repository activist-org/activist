<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <form class="space-y-4">
      <p>
        {{ $t("i18n.pages.auth.reset_password.index.reset_password_info") }}
      </p>
      <FormTextInput
        @input="input = $event.target.value"
        id="reset-password-username"
        :value="input"
        :placeholder="$t('i18n.pages.auth.reset_password.enter_username_mail')"
      />
      <div class="pt-4">
        <BtnAction
          class="flex max-h-[48px] items-center justify-center truncate md:max-h-[40px]"
          :label="$t('i18n._global.auth.reset_password')"
          :cta="true"
          fontSize="lg"
          :ariaLabel="$t('i18n._global.auth.reset_password')"
        />
      </div>
      <div class="link-text pt-16 text-center text-xl font-extrabold">
        <NuxtLink :to="localePath('/auth/sign-in')">
          {{ $t("i18n.pages.auth.reset_password.index.back_to_sign_in") }}
        </NuxtLink>
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
const localePath = useLocalePath();

const input = ref("");
</script>
