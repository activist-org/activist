<template>
  <div class="h-4">
    <div class="h-1 bg-light-special-text dark:bg-dark-special-text rounded-md">
      <div
        class="h-1 transition-width ease-in duration-500 rounded-md"
        :class="
          !!passwordValue.length
            ? `bg-light-${color} dark:bg-dark-${color}`
            : ''
        "
        :style="`width: ${width}%;`"
      ></div>
    </div>
    <div
      class="float-right text-xs mt-1"
      :class="{
        'text-light-special-text dark:text-dark-special-text': color !== 'text',
        'text-light-text dark:text-dark-text': color === 'text',
      }"
    >
      {{ $t("components.password-strength.title") }}:
      {{
        $t(
          !!passwordValue.length ? text : "components.password-strength.invalid"
        )
      }}
    </div>
  </div>
</template>

<script setup lang="ts">
import zxcvbn from "zxcvbn";

const props = defineProps({
  passwordValue: {
    type: String,
    default: "",
  },
});

const width = computed(() => (score.value + 1) * 20);
const color = computed(() => passwordStrengthMap[score.value].color);
const text = computed(() => passwordStrengthMap[score.value].text);

const passwordStrengthMap: Record<number, { color: string; text: string }> = {
  0: { color: "action-red", text: "components.password-strength.very-weak" },
  1: { color: "cta-orange", text: "components.password-strength.weak" },
  2: {
    color: "pending-yellow",
    text: "components.password-strength.medium",
  },
  3: {
    color: "accepted-green",
    text: "components.password-strength.strong",
  },
  4: { color: "text", text: "components.password-strength.very-strong" },
};

const SCORE_THRESHOLDS: number[] = [6, 9, 11.5, 13.5, 15];

// Finds the case where guessLog is less than the value among the values specified in the SCORE_THRESHOLDS array and returns its index.
const score = computed(() => {
  const guessLog: number = zxcvbn(props.passwordValue).guesses_log10;
  const scoreIndex = SCORE_THRESHOLDS.findIndex(
    (threshold) => guessLog < threshold
  );

  return scoreIndex >= 0 ? scoreIndex : SCORE_THRESHOLDS.length - 1;
});
</script>
