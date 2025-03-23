<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="rounded-md border border-primary-text">
    <vue-friendly-captcha
      v-if="!devMode.active"
      @done="verifyCaptcha"
      class="rounded-md"
      :sitekey="`${FRIENDLY_CAPTCHA_KEY}`"
      :dark="$colorMode.value === 'dark'"
      startMode="auto"
      :language="locale"
    />
    <button
      v-else
      class="style-btn flex w-full cursor-not-allowed items-center space-x-4 rounded-md border-none p-1 px-3 text-lg shadow-none"
      :disabled="true"
      :aria-label="
        $t('i18n.components.friendly_captcha.captcha_disabled_aria_label')
      "
    >
      <Icon :name="IconMap.SHIELD" size="28px" />
      <p class="font-bold">
        {{ $t("i18n.components.friendly_captcha.captcha_disabled") }}
      </p>
    </button>
  </div>
</template>

<script setup lang="ts">
import VueFriendlyCaptcha from "@somushq/vue3-friendly-captcha";

import { IconMap } from "~/types/icon-map";

const devMode = useDevMode();
devMode.check();

const verifyCaptcha = (response: boolean) => {
  console.log("Captcha response:", response);
};

const { locale } = useI18n();
</script>

<style>
.frc-banner {
  bottom: 2px !important;
}

.frc-captcha {
  border: none !important;
  width: 100% !important;
  padding-bottom: 8px !important;
}

.frc-container,
.frc-success {
  min-height: auto !important;
}

.frc-content {
  overflow: hidden;
}
</style>
