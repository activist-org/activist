<template>
  <vue-friendly-captcha
    v-if="!inDevMode"
    @done="verifyCaptcha"
    class="h-14 rounded-md"
    :sitekey="`${FRIENDLY_CAPTCHA_KEY}`"
    :dark="$colorMode.value === 'dark'"
    startMode="auto"
    :language="locale"
  />
  <button
    v-else
    class="style-btn flex w-full items-center space-x-4 rounded-md p-1 px-3 text-lg"
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

const { locale } = useI18n();
</script>
