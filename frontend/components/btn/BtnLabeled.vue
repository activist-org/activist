<template>
  <div
    v-if="linkTo == 'placeholder-link'"
    class="flex items-center px-4 py-2 font-semibold text-center select-none rounded-md xl:rounded-lg focus-brand w-fit elem-shadow-sm"
    :class="{
      'style-cta': cta == true,
      'style-cta-secondary': cta == false,
      'text-xs': fontSize == 'xs',
      'text-sm': fontSize == 'sm',
      'text-base': fontSize == 'base',
      'text-lg': fontSize == 'lg',
      'text-base sm:text-lg xl:text-xl xl:px-6 xl:py-3': fontSize == 'xl',
      'text-base sm:text-lg xl:text-2xl xl:px-6 xl:py-3': fontSize == '2xl',
      'text-base sm:text-lg xl:text-3xl xl:px-6 xl:py-3': fontSize == '3xl',
    }"
  >
    <div class="flex justify-items-center">
      <Icon v-if="leftIcon" class="mr-2" :name="leftIcon" :size="iconSize" />
      <span v-if="label" class="mx-auto">{{ $t(label) }}</span>
      <div v-else class="-mx-1"></div>
      <Icon v-if="rightIcon" class="ml-2" :name="rightIcon" :size="iconSize" />
      <div
        v-if="counter"
        class="px-1 py-[0.1rem] ml-2 -m-[0.1rem] rounded-lg bg-black/20 dark:bg-dark-cta-orange/25"
      >
        {{ counter }}
      </div>
    </div>
  </div>
  <a
    v-else-if="linkTo?.includes('http')"
    class="flex items-center px-4 py-2 font-semibold text-center select-none rounded-md xl:rounded-lg focus-brand w-fit elem-shadow-sm"
    :class="{
      'style-cta': cta == true,
      'style-cta-secondary': cta == false,
      'text-xs': fontSize == 'xs',
      'text-sm': fontSize == 'sm',
      'text-base': fontSize == 'base',
      'text-lg': fontSize == 'lg',
      'text-base sm:text-lg xl:text-xl xl:px-6 xl:py-3': fontSize == 'xl',
      'text-base sm:text-lg xl:text-2xl xl:px-6 xl:py-3': fontSize == '2xl',
      'text-base sm:text-lg xl:text-3xl xl:px-6 xl:py-3': fontSize == '3xl',
    }"
    :href="linkTo"
    :aria-label="$t(ariaLabel)"
  >
    <div class="flex justify-items-center">
      <Icon v-if="leftIcon" class="mr-2" :name="leftIcon" :size="iconSize" />
      <span v-if="label" class="mx-auto">{{ $t(label) }}</span>
      <div v-else class="-mx-1"></div>
      <Icon v-if="rightIcon" class="ml-2" :name="rightIcon" :size="iconSize" />
      <div
        v-if="counter"
        class="px-1 py-[0.1rem] ml-2 -m-[0.1rem] rounded-lg bg-black/20 dark:bg-dark-cta-orange/25"
      >
        {{ counter }}
      </div>
    </div>
  </a>
  <NuxtLink
    v-else
    :to="localePath(`${linkTo}`)"
    class="px-4 py-2 font-semibold text-center select-none rounded-md xl:rounded-lg focus-brand w-fit elem-shadow-sm"
    :class="{
      'style-cta': cta == true,
      'style-cta-secondary': cta == false,
      'text-xs': fontSize == 'xs',
      'text-sm': fontSize == 'sm',
      'text-base': fontSize == 'base',
      'text-lg': fontSize == 'lg',
      'text-base sm:text-lg xl:text-xl xl:px-6 xl:py-3': fontSize == 'xl',
      'text-base sm:text-lg xl:text-2xl xl:px-6 xl:py-3': fontSize == '2xl',
      'text-base sm:text-lg xl:text-3xl xl:px-6 xl:py-3': fontSize == '3xl',
    }"
    :aria-label="$t(ariaLabel)"
  >
    <div class="flex justify-items-center">
      <Icon v-if="leftIcon" class="mr-2" :name="leftIcon" :size="iconSize" />
      <span v-if="label" class="mx-auto">{{ $t(label) }}</span>
      <div v-else class="-mx-1"></div>
      <Icon v-if="rightIcon" class="ml-2" :name="rightIcon" :size="iconSize" />
      <div
        v-if="counter"
        class="px-1 py-[0.1rem] ml-2 -m-[0.1rem] rounded-lg bg-black/20 dark:bg-dark-cta-orange/25"
      >
        {{ counter }}
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const localePath = useLocalePath();

export interface Props {
  cta: boolean;
  linkTo?: string;
  label?: string;
  fontSize: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  leftIcon?: string;
  rightIcon?: string;
  iconSize?: string;
  counter?: number;
  ariaLabel: string;
}

withDefaults(defineProps<Props>(), {
  iconSize: "1em",
});
</script>
