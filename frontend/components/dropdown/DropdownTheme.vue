<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        v-slot="{ open }"
        class="inline-flex w-full px-4 py-2 font-semibold select-none rounded-md style-btn"
        :class="{ 'pl-6': location === 'sideMenu' }"
        :aria-label="$t('components.selector-theme.open-dropdown-aria-label')"
      >
        <div class="flex items-center text-sm space-x-2">
          <Icon
            v-if="$colorMode.preference == 'system'"
            name="bi:circle-half"
          />
          <Icon v-if="$colorMode.preference == 'light'" name="bi:sun" />
          <Icon v-else-if="$colorMode.preference == 'dark'" name="bi:moon" />
          <p
            class="sr-only lg:not-sr-only"
            :class="{
              '!not-sr-only !ml-3': location === 'sideMenu',
            }"
          >
            {{ $t("components.selector-theme.label") }}
          </p>
          <Icon
            class="right-3"
            :class="{
              'rotate-180 transform': open,
              absolute: location === 'sideMenu',
            }"
            name="bi:chevron-down"
          />
        </div>
      </MenuButton>
    </div>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0 transform scale-95"
      enter-to-class="opacity-100 transform scale-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="opacity-100 transform scale-100"
      leave-to-class="opacity-0 transform scale-95"
    >
      <MenuItems
        class="absolute right-0 mt-2 border shadow-lg origin-top-right divide-y rounded-md bg-light-content dark:bg-dark-content ring-1 ring-black ring-opacity-5 focus:outline-none border-light-text dark:border-dark-text"
        :class="{ '!static !border-0': location === 'sideMenu' }"
      >
        <div class="px-2 py-2">
          <MenuItem v-slot="{ active }">
            <button
              @click="$colorMode.preference = 'system'"
              class="flex items-center w-full py-2 pl-4 pr-2 text-sm group rounded-md text-light-text"
              :class="{
                'bg-light-cta-orange-hover dark:bg-dark-cta-orange/25 dark:text-dark-cta-orange':
                  active,
                'dark:text-dark-text': !active,
              }"
              :aria-label="$t('components.selector-theme.system-aria-label')"
            >
              <Icon name="bi:circle-half" size="1em" />
              <p class="pl-2 pr-2">
                {{ $t("components.selector-theme.system") }}
              </p>
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button
              @click="$colorMode.preference = 'light'"
              class="flex items-center w-full py-2 pl-4 pr-2 text-sm group rounded-md text-light-text"
              :class="{
                'bg-light-cta-orange-hover dark:bg-dark-cta-orange/25 dark:text-dark-cta-orange':
                  active,
                'dark:text-dark-text': !active,
              }"
              :aria-label="$t('components.selector-theme.light-aria-label')"
            >
              <Icon name="bi:sun" size="1.1em" />
              <p class="pl-2 pr-2">
                {{ $t("components.selector-theme.light") }}
              </p>
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button
              @click="$colorMode.preference = 'dark'"
              class="flex items-center w-full py-2 pl-4 pr-2 text-sm group rounded-md text-light-text"
              :class="{
                'bg-light-cta-orange-hover dark:bg-dark-cta-orange/25 dark:text-dark-cta-orange':
                  active,
                'dark:text-dark-text': !active,
              }"
              :aria-label="$t('components.selector-theme.dark-aria-label')"
            >
              <Icon name="bi:moon" size="1em" />
              <p class="pl-2 pr-2">
                {{ $t("components.selector-theme.dark") }}
              </p>
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

defineProps<{
  location?: string;
}>();
</script>
