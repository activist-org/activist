<template>
  <div class="h-4">
    <div class="h-1 rounded-md bg-distinct-text">
      <div
        class="h-1 rounded-md transition-width duration-500 ease-in"
        :class="!!passwordValue.length ? `${color}` : ''"
        :style="`width: ${width}%;`"
      ></div>
    </div>
    <div
      class="float-right mt-1 text-xs"
      :class="{
        'text-distinct-text': color !== 'bg-primary-text',
        'text-primary-text': color === 'bg-primary-text',
      }"
    >
      {{ $t("components.indicator_password_strength.title") }}:
      {{
        $t(
          !!passwordValue.length
            ? text
            : "components.indicator_password_strength.invalid"
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
  0: {
    color: "bg-[#cc0000] dark:bg-[#e06666]",
    text: "components.indicator_password_strength.very_weak",
  },
  1: {
    color: "bg-[#e69138] dark:bg-[#f6b26b]",
    text: "components.indicator_password_strength.weak",
  },
  2: {
    color: "bg-[#f1c232] dark:bg-[#ffd966]",
    text: "components.indicator_password_strength.medium",
  },
  3: {
    color: "bg-[#6aa84f] dark:bg-[#93c47d]",
    text: "components.indicator_password_strength.strong",
  },
  4: {
    color: "bg-primary-text",
    text: "components.indicator_password_strength.very_strong",
  },
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
