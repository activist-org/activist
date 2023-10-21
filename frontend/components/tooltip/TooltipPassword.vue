<template>
  <Tooltip class="transition ease-in-out delay-150 min-w-[200px] md:min-w-[300px] py-2 bg-[#e3e3e3] z-20">
    <span class="mb-4 px-2">{{ $t("pages.auth.sign-up.index.password-rules-message") }}</span>
    <div v-for="(rule, index) in rules" :key="`password-rule-${index}`" class="flex items-center space-x-2 px-2">
      <Icon :name="rule.isValid ? 'bi:check-circle-fill' : 'bi:x-circle-fill'" size="1.1em" :style="{color: rule.isValid ? '#198754' : '#BA3D3B'}" />
      <span class="truncate">{{ $t(`pages.auth.sign-up.index.${rule.message}`) }}</span>
    </div>
  </Tooltip>
</template>
<script setup lang="ts">
import { PasswordRules } from "~/types/password-rules";

defineProps<{
 rules: PasswordRules[]
}>();

</script>
