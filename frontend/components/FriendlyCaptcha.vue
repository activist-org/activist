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
      type="button"
      @click="verifyCaptcha(true)"
      class="style-btn flex w-full cursor-pointer items-center space-x-4 rounded-md border-none p-1 px-3 text-lg shadow-none"
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
const localeValue = ref(false)

interface Props {
  modelValue: boolean;
}
defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
const verifyCaptcha = (_response: boolean) => {
  emit("update:modelValue", true);
  localeValue.value = true;
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
