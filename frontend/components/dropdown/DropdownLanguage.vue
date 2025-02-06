<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <DropdownBase
    class="dropdown-language"
    :location="location"
    :menuButtonIcon="IconMap.GLOBE"
    :menuButtonLabel="$i18n.locale"
    :isMenuButtonUppercase="true"
    :menuButtonAriaLabel="
      i18nMap.components.dropdown_language.open_dropdown_aria_label
    "
  >
    <ul class="px-2 py-2">
      <NuxtLink
        v-for="l in availableLocales"
        :key="getLocaleCode(l)"
        class="dropdown-language-list-items"
        :to="switchLocalePath(getLocaleCode(l))"
      >
        <MenuItem v-slot="{ active }" class="flex">
          <MenuItemLabel
            :isButton="false"
            :label="getLocaleName(l)"
            :active="active"
          />
        </MenuItem>
      </NuxtLink>
    </ul>
  </DropdownBase>
</template>

<script setup lang="ts">
import { MenuItem } from "@headlessui/vue";
import type { LocaleObject } from "@nuxtjs/i18n";
import { i18nMap } from "~/types/i18n-map";
import { IconMap } from "~/types/icon-map";
import type { DropdownLocation } from "~/types/location";

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
</script>
