<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <DropdownBase
    class="dropdown-language"
    :isMenuButtonUppercase="true"
    :location="location"
    :menuButtonIcon="IconMap.GLOBE"
    :menuButtonLabel="$i18n.locale"
    menuButtonAriaLabel="i18n.components.dropdown_language.open_dropdown_aria_label"
  >
    <ul class="space-y-1 px-2 py-2">
      <MenuItem
        v-for="l in availableLocales"
        :key="getLocaleCode(l)"
        v-slot="{ active }"
      >
        <NuxtLink
          :to="switchLocalePath(getLocaleCode(l))"
          @click="updateLangAttribute(getLocaleCode(l))"
          class="dropdown-language-list-items block rounded-md px-3 py-2 text-sm focus-brand"
          :class="active ? 'style-menu-option-cta' : 'style-menu-option'"
        >
          {{ getLocaleName(l) }}
        </NuxtLink>
      </MenuItem>
    </ul>
  </DropdownBase>
</template>

<script setup lang="ts">
import { MenuItem } from "@headlessui/vue";
import type { LocaleObject } from "@nuxtjs/i18n";

defineProps<{
  location?: DropdownLocation;
}>();

const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const localesValues: LocaleObject[] = locales.value;

function getLocaleCode(locale: LocaleObject) {
  return typeof locale === "string" ? locale : locale.code;
}

function getLocaleName(locale: LocaleObject) {
  return typeof locale === "string" ? locale : String(locale.name);
}

const availableLocales = computed(() => {
  return localesValues.filter((i) => getLocaleCode(i) !== locale.value);
});

const updateLangAttribute = (newLocale: string) => {
  if (import.meta.client) {
    document.documentElement.setAttribute("lang", newLocale);
  }
};
</script>