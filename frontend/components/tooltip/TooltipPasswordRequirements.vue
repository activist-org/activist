<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <TooltipBase
    class="z-20 min-w-[200px] pb-4 pt-2 transition delay-150 ease-in-out md:min-w-[450px]"
  >
    <span class="mb-2 px-2">{{
      $t(
        i18nMap.components.tooltip_password_requirements.password_rules_message
      )
    }}</span>
    <div
      v-for="(rule, index) in rules"
      :key="`password-rule-${index}`"
      class="flex items-center space-x-2 px-2"
    >
      <Icon
        :name="rule.isValid ? IconMap.CIRCLE_CHECK_FILL : IconMap.CIRCLE_X_FILL"
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
import { i18nMap } from "~/types/i18n-map";
import { IconMap } from "~/types/icon-map";
import type { PasswordRules } from "~/types/password-rules";

defineProps<{
  rules: PasswordRules[];
}>();

// Dictionary is used to assure that the full keys are present and picked up by the i18n checks.
const passwordRequirementsDict: { [key: string]: string } = {
  "capital-letters":
    i18nMap.components.tooltip_password_requirements.capital_letters,
  "contains-numbers":
    i18nMap.components.tooltip_password_requirements.contains_numbers,
  "contains-special-chars":
    i18nMap.components.tooltip_password_requirements.contains_special_chars,
  "lower-case-letters":
    i18nMap.components.tooltip_password_requirements.lower_case_letters,
  "number-of-chars":
    i18nMap.components.tooltip_password_requirements.number_of_chars,
  "password-rules-message":
    i18nMap.components.tooltip_password_requirements.password_rules_message,
};
</script>
