<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        v-slot="{ open }"
        class="inline-flex w-full px-4 py-2 font-semibold select-none rounded-md style-btn"
        :class="{ 'pl-6': location === 'sideMenu' }"
        :aria-label="
          $t('components.selector-language.open-dropdown-aria-label')
        "
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
        class="absolute right-0 mt-2 shadow-lg origin-top-right divide-y rounded-md bg-light-layer-0 dark:bg-dark-layer-0 ring-1 ring-black ring-opacity-5 focus:outline-none dark:border dark:border-dark-text"
        :class="{ '!static': location === 'sideMenu' }"
      >
        <ul class="px-2 py-2">
          <NuxtLink
            v-for="l in availableLocales"
            :key="getLocaleCode(l)"
            :to="switchLocalePath(getLocaleCode(l))"
          >
            <MenuItem v-slot="{ active }" class="flex">
              <li
                class="group flex [word-spacing:0.5em] items-center rounded-md pl-4 pr-3 py-2 text-sm w-full"
                :class="{
                  'bg-light-cta-orange/80 dark:bg-dark-cta-orange/25 dark:text-dark-cta-orange':
                    active,
                  'text-light-text dark:text-dark-text': !active,
                }"
              >
                {{ getLocaleName(l) }}
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
import type { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables";

defineProps<{
  location?: string;
}>();

const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const localesValues: (string | LocaleObject)[] = locales.value;

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
