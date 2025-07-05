<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <TooltipBase
    class="z-20 min-w-[200px] pb-4 pt-2 transition delay-150 ease-in-out md:min-w-[450px]"
  >
    <span class="mb-2 px-2">{{
      $t("i18n.components.tooltip_password_requirements.password_rules_message")
    }}</span>
    <div
      v-for="rule in validRules"
      :key="rule.rule"
      :data-testid="rule.rule"
      class="flex items-center space-x-2 px-2"
    >
      <Icon
        aria-hidden="false"
        :aria-labelledby="rule.rule"
        :name="
          validRules.some((ruleV) => {
            ruleV.isValid && ruleV.rule === rule.rule;
          })
            ? IconMap.CIRCLE_CHECK_FILL
            : IconMap.CIRCLE_X_FILL
        "
        size="0.9em"
        :style="{ color: rule.isValid ? '#198754' : '#BA3D3B' }"
      />
      <title :id="rule.rule" class="sr-only">
        {{
          validRules.some((ruleV) => ruleV.isValid && ruleV.rule === rule.rule)
            ? $t(
                "i18n.components.tooltip_password_requirements.password_passed_rule"
              )
            : $t(
                "i18n.components.tooltip_password_requirements.password_failed_rule"
              )
        }}
      </title>
      <span class="truncate text-sm">{{
        $t(passwordRequirementsDict[rule.rule])
      }}</span>
    </div>
  </TooltipBase>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

const props = defineProps<{
  password: string | Ref<string | undefined>;
}>();

const { checkRules } = usePasswordRules();

const pass = computed(() => unref(props.password));
const validRules = computed(() => {
  return checkRules(pass.value || "");
});

// Dictionary is used to assure that the full keys are present and picked up by the i18n checks.
const passwordRequirementsDict: { [key: string]: string } = {
  "capital-letters":
    "i18n.components.tooltip_password_requirements.capital_letters",
  "contains-numbers":
    "i18n.components.tooltip_password_requirements.contains_numbers",
  "contains-special-chars":
    "i18n.components.tooltip_password_requirements.contains_special_chars",
  "lower-case-letters":
    "i18n.components.tooltip_password_requirements.lower_case_letters",
  "number-of-chars":
    "i18n.components.tooltip_password_requirements.number_of_chars",
  "password-rules-message":
    "i18n.components.tooltip_password_requirements.password_rules_message",
};
</script>
