<template>
  <vue-friendly-captcha
    v-if="!inDevMode"
    @done="verifyCaptcha"
    :sitekey="`${FRIENDLY_CAPTCHA_KEY}`"
    :dark="$colorMode.preference === 'dark'"
    language="en"
  />
  <button
    v-else
    class="style-btn flex h-[48px] items-center space-x-4 rounded-md px-3 text-lg md:h-[40px]"
    :disabled="true"
    :aria-label="$t('components.friendly-captcha.captcha-disabled-aria-label')"
  >
    <Icon name="bi:shield-fill-check" size="28px" />
    <p class="font-bold">
      {{ $t("components.friendly-captcha.captcha-disabled") }}
    </p>
  </button>
</template>

<script setup lang="ts">
import VueFriendlyCaptcha from "@somushq/vue3-friendly-captcha";

const inDevMode = window.location.href.includes("localhost:3000");

const verifyCaptcha = (response: boolean) => {
  console.log("Captcha response:", response);
};
</script>
