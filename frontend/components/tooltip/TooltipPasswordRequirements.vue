<template>
  <Tooltip
    class="transition ease-in-out delay-150 min-w-[200px] md:min-w-[450px] pt-2 pb-4 z-20"
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
      <span class="text-sm truncate">{{
        $t(`components.tooltip-password-requirements.${rule.message}`)
      }}</span>
    </div>
  </Tooltip>
</template>
<script setup lang="ts">
import { PasswordRules } from "~/types/password-rules";

defineProps<{
  rules: PasswordRules[];
}>();
</script>
