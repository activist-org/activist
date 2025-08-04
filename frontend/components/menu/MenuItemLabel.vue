<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <component
    @click="conditionallyLogOut()"
    @enter="conditionallyLogOut()"
    :is="infoComponent.is"
    v-bind="infoComponent"
    class="flex w-full items-center rounded-md text-sm"
    :class="{
      'group py-2 pl-4 pr-3': !isSideLeftMenu,
      'bg-cta-orange/80 dark:bg-cta-orange/25 dark:text-cta-orange': active,
      'text-primary-text hover:bg-cta-orange/80 dark:hover:bg-cta-orange/25 dark:hover:fill-cta-orange dark:hover:text-cta-orange':
        !active,
      'relative z-0 space-x-2 p-2 text-left font-medium': isSideLeftMenu,
    }"
  >
    <Icon
      v-if="iconName"
      :name="iconName"
      size="1em"
      :class="{
        'h-5 w-5 flex-shrink-0': isSideLeftMenu,
      }"
    />
    <Transition>
      <component
        v-if="
          !isSideLeftMenu ||
          sidebar.collapsed == false ||
          sidebar.collapsedSwitch == false
        "
        :is="infoLabel.is"
        v-bind="infoLabel"
      >
        {{ label }}
      </component>
    </Transition>
  </component>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

const props = defineProps<{
  isSideLeftMenu?: boolean | undefined;
  isButton: boolean;
  handlerClick?: () => void;
  iconName?: string | undefined;
  ariaLabel?: string | undefined;
  label: string;
  active: boolean;
}>();

const sidebar = useSidebar();
const { signOutUser } = useUser();

const infoComponent = computed(() => {
  return props.isButton
    ? {
        is: "button",
        onclick: props.handlerClick,
        "aria-label": props.ariaLabel,
      }
    : {
        is: "li",
      };
});

const infoLabel = computed(() => {
  return props.isButton
    ? {
        is: "p",
        class: "px-2 dark:group-hover:text-cta-orange",
      }
    : props.isSideLeftMenu
      ? {
          is: "p",
          class:
            "select-none whitespace-nowrap hover:menu-selection dark:group-hover:text-cta-orange",
        }
      : props.iconName
        ? {
            is: "p",
            class: "px-2 dark:group-hover:text-cta-orange",
          }
        : {
            is: "span",
          };
});

function conditionallyLogOut() {
  if (props.iconName === `${IconMap.SIGN_OUT}`) {
    signOutUser();
  }
}
</script>
