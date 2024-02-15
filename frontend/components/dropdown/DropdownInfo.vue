<template>
  <DropdownBase
    :location = location
    menuButtonAriaLabel="components.sidebar-left-footer.info-aria-label"
    menuButtonIcon="bi:info-circle"
    :menuButtonLabel="$t(`components.sidebar-left-footer.info`)"
    :isMenuButtonUppercase="false"
  >
    <DropdownItemsLayout
      :location = location
      :options = infoOpt
    />
  </DropdownBase>
</template>
  
<script setup lang="ts">
import { DropdownLocation } from "~/types/location";
import type { MenuSelector } from "~/types/menu-selector";

defineProps<{
  location?: DropdownLocation;
}>();

const infoOpt: MenuSelector[] = [
  {
    id: 1,
    label: "_global.help",
    routeURL: "/help",
    iconURL: "bi:question-circle",
    selected: false,
  },
  {
    id: 2,
    label: "_global.documentation",
    routeURL: "/docs",
    iconURL: "bi:layout-text-sidebar-reverse",
    selected: false,
  },
  {
    id: 3,
    label: "_global.legal",
    routeURL: "/legal",
    iconURL: "IconLegal",
    selected: false,
  },
];
    
</script>
