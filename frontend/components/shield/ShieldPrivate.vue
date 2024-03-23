<template>
  <div
    class="focus-brand elem-shadow-sm flex w-fit select-none items-center rounded-md border border-light-text bg-light-cta-orange fill-light-text px-4 py-2 text-center text-base font-semibold text-light-text dark:border-dark-cta-orange dark:bg-dark-cta-orange/10 dark:fill-dark-cta-orange dark:text-dark-cta-orange sm:text-lg xl:rounded-lg xl:px-6 xl:py-3 xl:text-xl"
    :class="{
      'text-xs': fontSize == 'xs',
      'text-sm': fontSize == 'sm',
      'text-base': fontSize == 'base',
      'text-lg': fontSize == 'lg',
      'text-base sm:text-lg xl:px-6 xl:py-3 xl:text-xl': fontSize == 'xl',
      'text-base sm:text-lg xl:px-6 xl:py-3 xl:text-2xl': fontSize == '2xl',
      'text-base sm:text-lg xl:px-6 xl:py-3 xl:text-3xl': fontSize == '3xl',
    }"
  >
    <Icon
      class="-my-1"
      :name="type === 'group' ? 'IconGroup' : 'bi:eye-slash'"
      :size="iconSize"
    />
    <span class="mx-auto ml-2 hidden md:block">{{
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
