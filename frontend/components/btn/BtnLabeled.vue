<template>
  <div
    v-if="linkTo == 'placeholder-link'"
    class="flex items-center px-4 py-2 font-semibold text-center border select-none rounded-md xl:rounded-lg text-light-distinct border-light-distinct dark:text-dark-distinct dark:border-dark-distinct focus-brand w-fit fill-light-distinct dark:fill-dark-distinct"
    :class="{
      'bg-light-cta-orange dark:bg-dark-cta-orange hover:bg-light-cta-orange-hover active:bg-light-cta-orange dark:hover:bg-dark-cta-orange-hover dark:active:bg-dark-cta-orange':
        cta == true,
      'bg-neutral-500 dark:bg-gray-400 hover:bg-neutral-400 active:bg-neutral-500 dark:hover:bg-gray-300 dark:active:bg-gray-400 ':
        cta == false,
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
      v-if="leftIcon"
      :name="leftIcon"
      class="mr-2 -my-1"
      :size="iconSize"
    />
    <span v-if="label" class="mx-auto">{{ $t(label) }}</span>
    <div v-else class="-mx-1"></div>
    <Icon
      v-if="rightIcon"
      :name="rightIcon"
      class="ml-2 -my-1"
      :size="iconSize"
    />
    <div
      v-if="counter"
      class="px-1 py-[0.1rem] ml-2 -m-[0.1rem] rounded-lg bg-white/40 dark:bg-black/30"
    >
      {{ counter }}
    </div>
  </div>
  <a
    v-else-if="linkTo.includes('http')"
    :href="linkTo"
    class="flex items-center px-4 py-2 font-semibold text-center border select-none rounded-md xl:rounded-lg text-light-distinct border-light-distinct dark:text-dark-distinct dark:border-dark-distinct focus-brand w-fit fill-light-distinct dark:fill-dark-distinct"
    :class="{
      'bg-light-cta-orange dark:bg-dark-cta-orange hover:bg-light-cta-orange-hover active:bg-light-cta-orange dark:hover:bg-dark-cta-orange-hover dark:active:bg-dark-cta-orange':
        cta == true,
      'bg-neutral-500 dark:bg-gray-400 hover:bg-neutral-400 active:bg-neutral-500 dark:hover:bg-gray-300 dark:active:bg-gray-400 ':
        cta == false,
      'text-xs': fontSize == 'xs',
      'text-sm': fontSize == 'sm',
      'text-base': fontSize == 'base',
      'text-lg': fontSize == 'lg',
      'text-base sm:text-lg xl:text-xl xl:px-6 xl:py-3': fontSize == 'xl',
      'text-base sm:text-lg xl:text-2xl xl:px-6 xl:py-3': fontSize == '2xl',
      'text-base sm:text-lg xl:text-3xl xl:px-6 xl:py-3': fontSize == '3xl',
    }"
    :aria-label="alternateText"
  >
    <Icon
      v-if="leftIcon"
      :name="leftIcon"
      class="mr-2 -my-1"
      :size="iconSize"
    />
    <span v-if="label" class="mx-auto">{{ $t(label) }}</span>
    <div v-else class="-mx-1"></div>
    <Icon
      v-if="rightIcon"
      :name="rightIcon"
      class="ml-2 -my-1"
      :size="iconSize"
    />
    <div
      v-if="counter"
      class="px-1 py-[0.1rem] ml-2 -m-[0.1rem] rounded-lg bg-white/40 dark:bg-black/30"
    >
      {{ counter }}
    </div>
  </a>
  <NuxtLink
    v-else
    :to="localePath(`${linkTo}`)"
    class="px-4 py-2 font-semibold text-center border select-none rounded-md xl:rounded-lg text-light-distinct border-light-distinct dark:text-dark-distinct dark:border-dark-distinct focus-brand w-fit fill-light-distinct dark:fill-dark-distinct"
    :class="{
      'bg-light-cta-orange dark:bg-dark-cta-orange hover:bg-light-cta-orange-hover active:bg-light-cta-orange dark:hover:bg-dark-cta-orange-hover dark:active:bg-dark-cta-orange':
        cta == true,
      'bg-neutral-500 dark:bg-gray-400 hover:bg-neutral-400 active:bg-neutral-500 dark:hover:bg-gray-300 dark:active:bg-gray-400 ':
        cta == false,
      'text-xs': fontSize == 'xs',
      'text-sm': fontSize == 'sm',
      'text-base': fontSize == 'base',
      'text-lg': fontSize == 'lg',
      'text-base sm:text-lg xl:text-xl xl:px-6 xl:py-3': fontSize == 'xl',
      'text-base sm:text-lg xl:text-2xl xl:px-6 xl:py-3': fontSize == '2xl',
      'text-base sm:text-lg xl:text-3xl xl:px-6 xl:py-3': fontSize == '3xl',
    }"
    :aria-label="alternateText"
  >
    <div class="flex items-center">
      <Icon
        v-if="leftIcon"
        :name="leftIcon"
        class="mr-2 -my-1"
        :size="iconSize"
      />
      <span v-if="label" class="mx-auto">{{ $t(label) }}</span>
      <div v-else class="-mx-1"></div>
      <Icon
        v-if="rightIcon"
        :name="rightIcon"
        class="ml-2 -my-1"
        :size="iconSize"
      />
      <div
        v-if="counter"
        class="px-1 py-[0.1rem] ml-2 -m-[0.1rem] rounded-lg bg-white/40 dark:bg-black/30"
      >
        {{ counter }}
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
export interface Props {
  cta: boolean;
  linkTo: string;
  label?: string;
  fontSize: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  leftIcon?: string;
  rightIcon?: string;
  iconSize?: string;
  counter?: number;
  alternateText: string;
}

withDefaults(defineProps<Props>(), {
  iconSize: "1em",
});

const localePath = useLocalePath();
</script>
