<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        v-slot="{ open }"
        class="inline-flex w-full py-2 px-4 font-semibold select-none rounded-md style-btn"
        :class="{
          'pl-6': isSideMenu,
          'flex items-center pl-1 rounded-md style-menu-option-cta':
            isSideLeftMenu,
        }"
        :aria-label="$t(`${menuButtonAriaLabel}`)"
      >
        <div
          class="flex justify-between items-center text-sm space-x-2"
          :class="{
            'relative z-0 w-full pl-[0.625rem] font-medium text-left':
              isSideLeftMenu,
          }"
        >
          <div class="flex items-center space-x-2">
            <Icon
              :name="menuButtonIcon"
              :class="{
                'flex-shrink-0 w-5 h-5 text-center': isSideLeftMenu,
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
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0 transform scale-95"
      enter-to-class="opacity-100 transform scale-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="opacity-100 transform scale-100"
      leave-to-class="opacity-0 transform scale-95"
    >
      <MenuItems
        class="rounded-md focus-brand"
        :class="{
          'absolute right-0 mt-2 shadow-lg origin-top-right divide-y bg-light-content dark:bg-dark-content ring-1 ring-black ring-opacity-5 focus:outline-none dark:border dark:border-dark-text':
            !isSideLeftMenu,
          '!static': isSideMenu || isSideLeftMenu,
          'p-1 mt-1 bg-light-header dark:bg-dark-header': isSideLeftMenu,
        }"
      >
        <slot />
      </MenuItems>
    </transition>
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
  return props.location === DropdownLocation.SIDELEFTMENU;
});

const isSideMenu = computed(() => {
  return props.location === DropdownLocation.SIDEMENU;
});
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
