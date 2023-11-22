<template>
  <div
    v-if="linkTo == 'placeholder-link'"
    class="flex items-center px-4 py-2 font-semibold text-center border select-none rounded-md xl:rounded-lg focus-brand w-fit shadow-sm shadow-zinc-700"
    :class="{
      'text-light-text border-light-text dark:text-dark-cta-orange dark:border-dark-cta-orange  fill-light-text dark:fill-dark-cta-orange bg-light-cta-orange dark:bg-dark-cta-orange/10 hover:bg-light-cta-orange-hover active:bg-light-cta-orange dark:hover:bg-dark-cta-orange-hover/25 dark:active:bg-dark-cta-orange/10':
        cta == true,
      'text-light-text border-light-text dark:text-dark-text dark:border-dark-text bg-light-btn dark:bg-dark-btn hover:bg-light-highlight active:bg-light-btn dark:hover:bg-dark-highlight dark:active:bg-dark-btn ':
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
      class="mr-2 -my-1"
      :name="leftIcon"
      :size="iconSize"
    />
    <span v-if="label" class="mx-auto">{{ $t(label) }}</span>
    <div v-else class="-mx-1"></div>
    <Icon
      v-if="rightIcon"
      class="ml-2 -my-1"
      :name="rightIcon"
      :size="iconSize"
    />
    <div
      v-if="counter"
      class="px-1 py-[0.1rem] ml-2 -m-[0.1rem] rounded-lg bg-black/20 dark:bg-dark-cta-orange/25"
    >
      {{ counter }}
    </div>
  </div>
  <a
    v-else-if="linkTo?.includes('http')"
    class="flex items-center px-4 py-2 font-semibold text-center border select-none rounded-md xl:rounded-lg focus-brand w-fit shadow-sm shadow-zinc-700"
    :class="{
      'text-light-text border-light-text dark:text-dark-cta-orange dark:border-dark-cta-orange  fill-light-text dark:fill-dark-cta-orange bg-light-cta-orange dark:bg-dark-cta-orange/10 hover:bg-light-cta-orange-hover active:bg-light-cta-orange dark:hover:bg-dark-cta-orange-hover/25 dark:active:bg-dark-cta-orange/10':
        cta == true,
      'text-light-text border-light-text dark:text-dark-text dark:border-dark-text bg-light-btn dark:bg-dark-btn hover:bg-light-highlight active:bg-light-btn dark:hover:bg-dark-highlight dark:active:bg-dark-btn ':
        cta == false,
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
    <Icon
      v-if="leftIcon"
      class="mr-2 -my-1"
      :name="leftIcon"
      :size="iconSize"
    />
    <span v-if="label" class="mx-auto">{{ $t(label) }}</span>
    <div v-else class="-mx-1"></div>
    <Icon
      v-if="rightIcon"
      class="ml-2 -my-1"
      :name="rightIcon"
      :size="iconSize"
    />
    <div
      v-if="counter"
      class="px-1 py-[0.1rem] ml-2 -m-[0.1rem] rounded-lg bg-black/20 dark:bg-dark-cta-orange/25"
    >
      {{ counter }}
    </div>
  </a>
  <div v-else>
    <NuxtLink
      :to="localePath(`${linkTo}`)"
      class="flex items-center px-4 py-2 font-semibold text-center border select-none rounded-md xl:rounded-lg focus-brand w-fit shadow-sm shadow-zinc-700"
      :class="{
        'text-light-text border-light-text dark:text-dark-cta-orange dark:border-dark-cta-orange  fill-light-text dark:fill-dark-cta-orange bg-light-cta-orange dark:bg-dark-cta-orange/10 hover:bg-light-cta-orange-hover active:bg-light-cta-orange dark:hover:bg-dark-cta-orange-hover/25 dark:active:bg-dark-cta-orange/10':
          cta == true,
        'text-light-text border-light-text dark:text-dark-text dark:border-dark-text bg-light-btn dark:bg-dark-btn hover:bg-light-highlight active:bg-light-btn dark:hover:bg-dark-highlight dark:active:bg-dark-btn ':
          cta == false,
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
      <div class="flex items-center">
        <Icon
          v-if="leftIcon"
          class="mr-2 -my-1"
          :name="leftIcon"
          :size="iconSize"
        />
        <span v-if="label" class="mx-auto">{{ $t(label) }}</span>
        <div v-else class="-mx-1"></div>
        <Icon
          v-if="rightIcon"
          class="ml-2 -my-1"
          :name="rightIcon"
          :size="iconSize"
        />
        <div
          v-if="counter"
          class="px-1 py-[0.1rem] ml-2 -m-[0.1rem] rounded-lg bg-black/20 dark:bg-dark-cta-orange/25"
        >
          {{ counter }}
        </div>
      </div>
    </NuxtLink>
    <div v-if="optionsCallback" @click.stop class="relative">
      <Menu>
        <MenuButton
          class="flex shadow-zinc-700 items-center px-4 py-2 font-semibold text-center border select-none rounded-r-md xl:rounded-r-lg focus-brand w-fit shadow-sm shadow-zinc-70 text-light-text border-light-text dark:text-dark-cta-orange dark:border-dark-cta-orange fill-light-text dark:fill-dark-cta-orange bg-light-cta-orange dark:bg-dark-cta-orange/10 hover:bg-light-cta-orange-hover active:bg-light-cta-orange dark:hover:bg-dark-cta-orange-hover/25 dark:active:bg-dark-cta-orange/10"
          :class="{
            'text-xs': fontSize == 'xs',
            'text-sm': fontSize == 'sm',
            'text-base': fontSize == 'base',
            'text-lg': fontSize == 'lg',
            'text-base sm:text-lg xl:text-xl xl:px-6 xl:py-3': fontSize == 'xl',
            'text-base sm:text-lg xl:text-2xl xl:px-6 xl:py-3':
              fontSize == '2xl',
            'text-base sm:text-lg xl:text-3xl xl:px-6 xl:py-3':
              fontSize == '3xl',
          }"
          >&#x25BC;</MenuButton
        >
        <MenuItems
          class="absolute right-0 md:right-auto md:fixed z-10 bg-white"
        >
          <MenuItem
            v-for="option in options"
            :key="option"
            v-slot="{ active }"
            class="cursor-pointer text-gray-700 block px-4 text-sm py-2"
          >
            <a
              @click="optionsCallback(option)"
              :class="{
                'bg-light-cta-orange dark:bg-dark-cta-orange/10': active,
              }"
            >
              {{ option }}
            </a>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
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
  options?: string[];
  optionsCallback?: (option: string) => void;
}

withDefaults(defineProps<Props>(), {
  iconSize: "1em",
});
</script>
