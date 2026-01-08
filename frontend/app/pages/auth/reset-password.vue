<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <form class="space-y-4">
      <p>
        {{ $t("i18n.pages.auth.reset_password.index.reset_password_info") }}
      </p>
      <FormTextInput
        id="reset-password-username"
        @input="input = $event.target.value"
        :label="$t('i18n.pages.auth.reset_password.enter_username_mail')"
        :value="input"
      />
      <div class="pt-4">
        <BtnAction
          ariaLabel="i18n._global.auth.reset_password"
          class="flex max-h-12 items-center justify-center truncate md:max-h-10"
          :cta="true"
          fontSize="lg"
          label="i18n._global.auth.reset_password"
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
