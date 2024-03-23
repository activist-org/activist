<template>
  <TooltipBase
    class="z-20 min-w-[200px] pb-4 pt-2 transition delay-150 ease-in-out md:min-w-[450px]"
  >
    <span class="mb-2 px-2">{{
      $t("components.tooltip-password-requirements.password-rules-message")
    }}</span>
    <div
      v-for="(rule, index) in rules"
      :key="`password-rule-${index}`"
      class="flex items-center space-x-2 px-2"
    >
      <Icon
        :name="rule.isValid ? 'bi:check-circle-fill' : 'bi:x-circle-fill'"
        size="0.9em"
        :style="{ color: rule.isValid ? '#198754' : '#BA3D3B' }"
      />
      <span class="truncate text-sm">{{
        $t(passwordRequirementsDict[rule.message])
      }}</span>
    </div>
  </TooltipBase>
</template>
<script setup lang="ts">
import type { PasswordRules } from "~/types/password-rules";

defineProps<{
  rules: PasswordRules[];
}>();

// Dictionary is used to assure that the full keys are present and picked up by the i18n checks.
const passwordRequirementsDict: { [key: string]: string } = {
  "capital-letters": "components.tooltip-password-requirements.capital-letters",
  "contains-numbers":
    "components.tooltip-password-requirements.contains-numbers",
  "contains-special-chars":
    "components.tooltip-password-requirements.contains-special-chars",
  "lower-case-letters":
    "components.tooltip-password-requirements.lower-case-letters",
  "number-of-chars": "components.tooltip-password-requirements.number-of-chars",
  "password-rules-message":
    "components.tooltip-password-requirements.password-rules-message",
};
</script>
