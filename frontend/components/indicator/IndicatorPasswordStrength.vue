<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="h-4">
    <div class="h-1 rounded-md bg-distinct-text">
      <div
        id="password-strength-indicator-progress"
        data-testid="password-strength-indicator-progress"
        class="h-1 rounded-md transition-width duration-500 ease-in"
        :class="!!(password || []).length ? `${color}` : ''"
        :style="`width: ${width}%;`"
      ></div>
    </div>
    <div
      id="sign-in-password-strength-text"
      data-testid="sign-in-password-strength-text"
      class="float-right mt-1 text-xs"
      :class="{
        'text-distinct-text': color !== 'bg-primary-text',
        'text-primary-text': color === 'bg-primary-text',
      }"
    >
      {{ $t("i18n.components.indicator_password_strength.title") }}:
      {{
        $t(
          !!(password || []).length
            ? text
            : "i18n.components.indicator_password_strength.invalid"
        )
      }}
    </div>
  </div>
</template>

<script setup lang="ts">
import zxcvbn from "zxcvbn";

const props = defineProps<{
  passwordValue?: string | Ref<string | undefined>;
}>();

const width = computed(() => (score.value + 1) * 20);
const color = computed(() => passwordStrengthMap[score.value].color);
const text = computed(() => passwordStrengthMap[score.value].text);
const password = computed(() => unref(props.passwordValue));

const passwordStrengthMap: Record<number, { color: string; text: string }> = {
  0: {
    color: "bg-password-strength-very-weak",
    text: "i18n.components.indicator_password_strength.very_weak",
  },
  1: {
    color: "bg-password-strength-weak",
    text: "i18n.components.indicator_password_strength.weak",
  },
  2: {
    color: "bg-password-strength-medium",
    text: "i18n.components.indicator_password_strength.medium",
  },
  3: {
    color: "bg-password-strength-strong",
    text: "i18n.components.indicator_password_strength.strong",
  },
  4: {
    color: "bg-primary-text",
    text: "i18n.components.indicator_password_strength.very_strong",
  },
};

const SCORE_THRESHOLDS: number[] = [6, 9, 11.5, 13.5, 15];

// Finds the case where guessLog is less than the value among the values specified in the SCORE_THRESHOLDS array and returns its index.
const score = computed(() => {
  if (!password.value) return 0;
  const guessLog: number = zxcvbn(password.value as string).guesses_log10;
  const scoreIndex = SCORE_THRESHOLDS.findIndex(
    (threshold) => guessLog < threshold
  );
  return scoreIndex >= 0 ? scoreIndex : SCORE_THRESHOLDS.length - 1;
});
</script>
