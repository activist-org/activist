<template>
  <div
    class="rounded-md border"
    :class="{
      'border-dark-text': colorModePreference == 'dark',
      'border-light-text': colorModePreference == 'light',
    }"
  >
    <vue-friendly-captcha
      v-if="!inDevMode"
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
        $t('components.friendly-captcha.captcha-disabled-aria-label')
      "
    >
      <Icon :name="IconMap.SHIELD" size="28px" />
      <p class="font-bold">
        {{ $t("components.friendly-captcha.captcha-disabled") }}
      </p>
    </button>
  </div>
</template>

<script setup lang="ts">
import VueFriendlyCaptcha from "@somushq/vue3-friendly-captcha";
import { IconMap } from "~/types/icon-map";

const inDevMode = window.location.href.includes("localhost:3000");

const verifyCaptcha = (response: boolean) => {
  console.log("Captcha response:", response);
};

const { locale } = useI18n();
const colorMode = useColorMode();
const colorModePreference = colorMode.preference == "light" ? "light" : "dark";
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
