<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        v-slot="{ open }"
        class="inline-flex w-full px-4 py-2 font-semibold select-none rounded-md text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content hover:bg-light-highlight dark:hover:bg-dark-highlight focus-brand"
        :class="{ 'pl-6': location === 'sideMenu' }"
      >
        <div class="flex items-center text-sm space-x-2">
          <Icon name="bi:globe" />
          <p
            class="uppercase sr-only lg:not-sr-only"
            :class="{ '!not-sr-only !ml-3': location === 'sideMenu' }"
          >
            {{ $i18n.locale }}
          </p>
          <p></p>
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
        <ul class="px-2 py-2">
          <NuxtLink
            v-for="locale in availableLocales"
            :key="getLocaleCode(locale)"
            :to="switchLocalePath(getLocaleCode(locale))"
          >
            <MenuItem v-slot="{ active }">
              <li
                class="group flex [word-spacing:0.5em] items-center rounded-md pl-4 pr-2 py-2 text-sm"
                :class="{
                  'bg-light-cta-orange dark:bg-dark-cta-orange text-light-content dark:text-dark-content w-max':
                    active && location !== 'sideMenu',
                  'text-light-text dark:text-dark-text w-max':
                    !active && location !== 'sideMenu',
                  'bg-light-cta-orange dark:bg-dark-cta-orange text-light-content dark:text-dark-content w-full':
                    active && location === 'sideMenu',
                  'text-light-text dark:text-dark-text w-full':
                    !active && location === 'sideMenu',
                }"
              >
                {{ getLocaleName(locale) }}
              </li>
            </MenuItem>
          </NuxtLink>
        </ul>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables";
defineProps({
  location: String,
});

const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const localesValues: Array<string | LocaleObject> = locales.value;

function getLocaleCode(locale: string | LocaleObject) {
  return typeof locale === "string" ? locale : locale.code;
}

function getLocaleName(locale: string | LocaleObject) {
  return typeof locale === "string" ? locale : locale.name;
}

const availableLocales = computed(() => {
  return localesValues.filter((i) => getLocaleCode(i) !== locale.value);
});
</script>
