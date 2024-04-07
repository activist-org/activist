<template>
  <component
    :is="infoComponent.is"
    v-bind="infoComponent"
    class="flex w-full items-center rounded-md text-sm"
    :class="{
      'group py-2 pl-4 pr-3': !isSideLeftMenu,
      'bg-light-cta-orange/80 dark:bg-dark-cta-orange/25 dark:text-dark-cta-orange':
        active,
      'text-light-text dark:text-dark-text': !active,
      'relative z-0 space-x-2 p-2 text-left font-medium': isSideLeftMenu,
    }"
  >
    <Icon
      v-if="iconName"
      :name="iconName"
      size="1em"
      :class="{ 'h-5 w-5 flex-shrink-0': isSideLeftMenu }"
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
const props = defineProps<{
  isSideLeftMenu?: boolean | undefined;
  isButton: boolean;
  handlerClick?: () => void | undefined;
  iconName?: string | undefined;
  ariaLabel?: string | undefined;
  label: string;
  active: any;
}>();

const sidebar = useSidebar();

const infoComponent = computed(() => {
  return props.isButton
    ? {
        is: "button",
        onclick: props.handlerClick,
        ariaLabel: props.ariaLabel,
      }
    : {
        is: "li",
      };
});

const infoLabel = computed(() => {
  return props.isButton
    ? {
        is: "p",
        class: "pl-2 pr-2",
      }
    : props.isSideLeftMenu
      ? {
          is: "p",
          class:
            "select-none whitespace-nowrap hover:light-menu-selection dark:hover:dark-menu-selection",
        }
      : props.iconName
        ? {
            is: "p",
            class: "pl-2 pr-2",
          }
        : {
            is: "span",
          };
});
</script>
