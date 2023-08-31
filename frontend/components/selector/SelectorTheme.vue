<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        v-slot="{ open }"
        class="inline-flex w-full px-4 py-2 font-semibold select-none rounded-md text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content hover:bg-light-highlight dark:hover:bg-dark-highlight focus-brand"
        :class="{ 'pl-6': location === 'sideMenu' }"
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
            name="bi:chevron-down"
            class="right-3"
            :class="{
              'rotate-180 transform': open,
              absolute: location === 'sideMenu',
            }"
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
              :class="[
                active
                  ? 'bg-light-cta-orange dark:bg-dark-cta-orange text-light-content dark:text-dark-content'
                  : 'text-light-text dark:text-dark-text',
                'group flex w-full items-center rounded-md pl-4 pr-2 py-2 text-sm',
              ]"
              @click="$colorMode.preference = 'system'"
            >
              <Icon name="bi:circle-half" size="1em" />
              <p class="pl-2 pr-2">
                {{ $t("components.selector-theme.system") }}
              </p>
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button
              :class="[
                active
                  ? 'bg-light-cta-orange dark:bg-dark-cta-orange text-light-content dark:text-dark-content'
                  : 'text-light-text dark:text-dark-text',
                'group flex w-full items-center rounded-md pl-4 pr-2 py-2 text-sm',
              ]"
              @click="$colorMode.preference = 'light'"
            >
              <Icon name="bi:sun" size="1.1em" />
              <p class="pl-2 pr-2">
                {{ $t("components.selector-theme.light") }}
              </p>
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button
              :class="[
                active
                  ? 'bg-light-cta-orange dark:bg-dark-cta-orange text-light-content dark:text-dark-content'
                  : 'text-light-text dark:text-dark-text',
                'group flex w-full items-center rounded-md pl-4 pr-2 py-2 text-sm',
              ]"
              @click="$colorMode.preference = 'dark'"
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

defineProps({
  location: String,
});
</script>
