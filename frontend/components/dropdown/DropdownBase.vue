<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        @focus="expandOnFocus"
        v-slot="{ open }"
        class="style-btn inline-flex w-full select-none whitespace-nowrap rounded-md px-4 py-2 font-semibold"
        :class="{
          'pl-6': isSideMenu,
          'style-menu-option-cta flex items-center rounded-md pl-1':
            isSideLeftMenu,
        }"
        :aria-label="$t(`${menuButtonAriaLabel}`)"
      >
        <div
          class="flex items-center justify-between space-x-2 text-sm"
          :class="{
            'relative z-0 w-full pl-[0.625rem] text-left font-medium':
              isSideLeftMenu,
          }"
        >
          <div class="flex items-center space-x-2">
            <Icon
              :name="menuButtonIcon"
              :class="{
                'h-5 w-5 flex-shrink-0 text-center': isSideLeftMenu,
              }"
              :size="isSideLeftMenu ? '1em' : ''"
            />
            <Transition name="text">
              <p
                v-if="
                  !isSideLeftMenu ||
                  sidebar.collapsed == false ||
                  sidebar.collapsedSwitch == false
                "
                :class="{
                  'sr-only lg:not-sr-only': !isSideLeftMenu,
                  '!not-sr-only !ml-3': isSideMenu,
                  uppercase: isMenuButtonUppercase,
                  'font-bold': isMenuButtonBold,
                  'select-none': isSideLeftMenu,
                }"
              >
                {{ menuButtonLabel }}
              </p>
            </Transition>
          </div>
          <Transition name="chevron">
            <Icon
              v-if="
                !isSideLeftMenu ||
                sidebar.collapsed == false ||
                sidebar.collapsedSwitch == false
              "
              class="right-3"
              :class="{
                'rotate-180 transform': open,
                absolute: isSideMenu,
                'absolute right-2': isSideLeftMenu,
              }"
              :size="isSideLeftMenu ? '1rem' : ''"
              :name="isSideLeftMenu ? 'bi:chevron-up' : 'bi:chevron-down'"
            />
          </Transition>
        </div>
      </MenuButton>
    </div>
    <MenuItems
      class="focus-brand rounded-md"
      :class="{
        'absolute right-0 mt-2 origin-top-right divide-y bg-light-layer-0 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border dark:border-dark-text dark:bg-dark-layer-0':
          !isSideLeftMenu,
        '!static': isSideMenu || isSideLeftMenu,
        'mt-1 bg-light-layer-2 p-1 dark:bg-dark-layer-2': isSideLeftMenu,
      }"
    >
      <slot />
    </MenuItems>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItems } from "@headlessui/vue";
import { DropdownLocation } from "~/types/location";

const props = defineProps<{
  location?: DropdownLocation;
  menuButtonAriaLabel: string;
  menuButtonIcon: string;
  isMenuButtonUppercase?: boolean;
  isMenuButtonBold?: boolean;
  menuButtonLabel: string;
}>();

const sidebar = useSidebar();

const isSideLeftMenu = computed(() => {
  return props.location === DropdownLocation.SIDE_LEFT_MENU;
});

const isSideMenu = computed(() => {
  return props.location === DropdownLocation.SIDE_MENU;
});

const expandOnFocus = () => {
  if (sidebar.collapsed === true) {
    sidebar.collapsed = false;
  }
};
</script>

<style>
.text-enter-active {
  transition: opacity 0.25s ease;
  transition-delay: 0.125s;
}
.text-leave-active {
  transition: opacity 0.25s ease;
}

.text-enter-from,
.text-leave-to {
  opacity: 0;
}
.text-enter-from {
  transition-delay: 0.25s;
}

.chevron-enter-active {
  transition: opacity 0.25s ease;
  transition-delay: 0.25s;
}
.chevron-leave-active {
  transition: opacity 0.25s ease;
}

.chevron-enter-from,
.chevron-leave-to {
  opacity: 0;
}
</style>
