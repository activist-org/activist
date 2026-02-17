<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="h-4">
    <div class="h-1 rounded-md bg-distinct-text">
      <div
        id="password-strength-indicator-progress"
        class="h-1 rounded-md transition-[width] duration-500 ease-in"
        :class="!!(password || []).length ? `${color}` : ''"
        data-testid="password-strength-indicator-progress"
        :style="`width: ${width}%;`"
      ></div>
    </div>
    <div
      id="sign-in-password-strength-text"
      class="float-right mt-1 text-xs"
      :class="{
        'text-distinct-text': color !== 'bg-primary-text',
        'text-primary-text': color === 'bg-primary-text',
      }"
      data-testid="sign-in-password-strength-text"
    >
      {{
        !!(password || []).length
          ? $t("i18n.components.indicator_password_strength.time_to_crack", { time: crackTimeDisplay })
          : $t("i18n.components.indicator_password_strength.invalid")
      }}
    </div>
  </div>
</template>

<script setup lang="ts">
import zxcvbn from "zxcvbn";

const props = defineProps<{
  passwordValue?: string | Ref<string | undefined>;
}>();

const password = computed(() => unref(props.passwordValue));
const width = computed(() => (score.value + 1) * 20);
const color = computed(() => passwordStrengthMap[score.value].color);

type PasswordIndexKey = 0 | 1 | 2 | 3 | 4;

const passwordStrengthMap: Record<
  PasswordIndexKey,
  { color: string }
> = {
  0: { color: "bg-password-strength-very-weak" },
  1: { color: "bg-password-strength-weak" },
  2: { color: "bg-password-strength-medium" },
  3: { color: "bg-password-strength-strong" },
  4: { color: "bg-primary-text" },
};

const SCORE_THRESHOLDS: number[] = [6, 9, 11.5, 13.5, 15];

// Calculate score for the progress bar width/color
const score = computed((): PasswordIndexKey => {
  if (!password.value) return 0;
  const result = zxcvbn(password.value as string);
  const guessLog: number = result.guesses_log10;
  const scoreIndex = SCORE_THRESHOLDS.findIndex(
    (threshold) => guessLog < threshold
  );
  return (
    scoreIndex >= 0 ? scoreIndex : SCORE_THRESHOLDS.length - 1
  ) as PasswordIndexKey;
});

// NEW CODE: Extract the crack time string from zxcvbn
const crackTimeDisplay = computed(() => {
  if (!password.value) return "";
  const result = zxcvbn(password.value as string);
  return result.crack_times_display.offline_slow_hashing_1e4_per_second;
});
</script>