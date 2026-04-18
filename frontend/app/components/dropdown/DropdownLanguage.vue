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
    <ul class="px-2 py-2">
      <NuxtLink
        v-for="l in availableLocales"
        :key="getLocaleCode(l)"
        @click="updateLangAttribute(getLocaleCode(l))"
        class="dropdown-language-list-items"
        :to="switchLocalePath(getLocaleCode(l))"
      >
        <MenuItem v-slot="{ active }" class="flex">
          <MenuItemLabel
            :active="active"
            :isButton="false"
            :label="getLocaleName(l)"
          />
        </MenuItem>
      </NuxtLink>
    </ul>
  </DropdownBase>
</template>

<script setup lang="ts">
import type { LocaleObject } from "@nuxtjs/i18n";

import { MenuItem } from "@headlessui/vue";

defineProps<{
  location?: DropdownLocation;
}>();

const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const localesValues = computed(() => locales.value);

/**
 * Extracts the locale code from a given locale object or string. This function takes a locale, which can be either a string representing the locale code or an object containing a code property, and returns the locale code as a string. This is useful for handling different formats of locale representations and ensuring that the correct locale code is used when switching languages or updating the lang attribute in the HTML document.
 * @param locale The locale to extract the code from, which can be either a string (e.g., "en", "fr") or an object with a code property (e.g., { code: "en", name: "English" }). The function checks the type of the input and returns the appropriate locale code as a string.
 * @returns The locale code as a string, extracted from the input locale.
 * If the input is a string, it is returned directly. If the input is an object, the code property is returned.
 * This allows for consistent handling of locale information regardless of whether it is provided as a simple string or a more complex object, facilitating the process of switching languages and updating the user interface accordingly.
 */
function getLocaleCode(locale: LocaleObject) {
  return typeof locale === "string" ? locale : locale.code;
}

/**
 * Extracts the locale name from a given locale object or string. This function takes a locale, which can be either a string representing the locale code or an object containing a name property, and returns the locale name as a string. This is useful for displaying the name of the language in the user interface, allowing users to easily identify and select their preferred language from the dropdown menu.
 * @param locale The locale to extract the name from, which can be either a string (e.g., "en", "fr") or an object with a name property (e.g., { code: "en", name: "English" }). The function checks the type of the input and returns the appropriate locale name as a string.
 * @returns The locale name as a string, extracted from the input locale.
 * If the input is a string, it is returned directly. If the input is an object, the name property is returned.
 * This allows for consistent handling of locale information regardless of whether it is provided as a simple string or a more complex object, facilitating the process of displaying the correct language name in the user interface.
 */
function getLocaleName(locale: LocaleObject) {
  return typeof locale === "string" ? locale : String(locale.name);
}

const availableLocales = computed(() => {
  return localesValues.value.filter((i) => getLocaleCode(i) !== locale.value);
});

const updateLangAttribute = (newLocale: string) => {
  if (import.meta.client) {
    document.documentElement.setAttribute("lang", newLocale);
  }
};
</script>
