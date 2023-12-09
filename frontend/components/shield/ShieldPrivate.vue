<template>
  <div
    class="flex items-center px-4 py-2 font-semibold text-center border select-none rounded-md xl:rounded-lg focus-brand w-fit elem-shadow-sm text-light-text border-light-text dark:text-dark-cta-orange dark:border-dark-cta-orange fill-light-text dark:fill-dark-cta-orange bg-light-cta-orange dark:bg-dark-cta-orange/10 text-base sm:text-lg xl:text-xl xl:px-6 xl:py-3"
    :class="{
      'text-xs': fontSize == 'xs',
      'text-sm': fontSize == 'sm',
      'text-base': fontSize == 'base',
      'text-lg': fontSize == 'lg',
      'text-base sm:text-lg xl:text-xl xl:px-6 xl:py-3': fontSize == 'xl',
      'text-base sm:text-lg xl:text-2xl xl:px-6 xl:py-3': fontSize == '2xl',
      'text-base sm:text-lg xl:text-3xl xl:px-6 xl:py-3': fontSize == '3xl',
    }"
  >
    <Icon
      class="-my-1"
      :name="type === 'group' ? 'IconGroup' : 'bi:eye-slash'"
      :size="iconSize"
    />
    <span class="mx-auto hidden ml-2 md:block">{{
      $t("components.shield-private.private")
    }}</span>
  </div>
</template>

<script setup lang="ts">
export interface Props {
  fontSize: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  type?: "default" | "group";
  iconSize?: string;
  ariaLabel: string;
}

withDefaults(defineProps<Props>(), {
  iconSize: "1em",
  type: "default",
});
</script>
