<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="rounded-md border border-primary-text"
    :class="{ 'border-none': devMode.active && localeValue }"
  >
    <vue-friendly-captcha
      v-if="!devMode.active"
      @done="verifyCaptcha"
      class="rounded-md"
      :dark="$colorMode.value === 'dark'"
      :language="locale"
      :sitekey="`${FRIENDLY_CAPTCHA_KEY}`"
      startMode="auto"
    />
    <button
      v-else
      @click="verifyCaptcha(true)"
      :aria-label="
        $t('i18n.components.friendly_captcha.dev_captcha_disabled_aria_label')
      "
      class="style-btn flex w-full cursor-pointer items-center space-x-4 rounded-md p-1 px-3 text-lg shadow-none"
      :class="{
        'border-1 border border-primary-text bg-accepted-green/75 dark:border-accepted-green dark:bg-accepted-green/10 dark:text-accepted-green':
          localeValue,
      }"
      type="button"
    >
      <Icon :name="IconMap.SHIELD" size="28px" />
      <p v-if="!localeValue" class="font-bold">
        {{ $t("i18n.components.friendly_captcha.dev_captcha_disabled") }}
      </p>
      <p v-else class="font-bold dark:text-accepted-green">
        {{ $t("i18n.components.friendly_captcha.dev_captcha_verified") }}
      </p>
    </button>
  </div>
</template>

<script setup lang="ts">
import VueFriendlyCaptcha from "@somushq/vue3-friendly-captcha";

const devMode = useDevMode();
devMode.check();
const localeValue = ref(false);

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
