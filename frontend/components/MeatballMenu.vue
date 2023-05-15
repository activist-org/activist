<template>
  <Menu
    as="div"
    class="relative inline-block text-left"
    v-slot="{ open, close }"
  >
    <MenuButton
      class="justify-center select-none rounded-md text-light-text dark:text-dark-text active:text-light-cta-orange active:dark:text-dark-cta-orange focus-brand"
    >
      <div>
        <Icon name="bi:three-dots-vertical" size="1.5em" />
      </div>
    </MenuButton>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0 transform scale-95"
      enter-to-class="opacity-100 transform scale-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="opacity-100 transform scale-100"
      leave-to-class="opacity-0 transform scale-95"
    >
      <MenuItems
        class="absolute right-0 mt-2 border shadow-lg origin-top-right rounded-md bg-light-content dark:bg-dark-content ring-1 ring-black ring-opacity-5 focus:outline-none border-light-text dark:border-dark-text overflow-clip"
      >
        <div class="w-full mx-auto grid divide-y grid-row-2">
          <button
            @click="toggleThemeVisible"
            :class="[
              isThemeVisible
                ? 'bg-light-cta-orange dark:bg-dark-cta-orange text-light-content dark:text-dark-content'
                : 'text-light-text dark:text-dark-text hover:bg-light-highlight dark:hover:bg-dark-highlight',
              'flex w-full items-center pr-6',
            ]"
          >
            <div
              class="relative z-0 flex items-center w-full px-3 py-2 text-sm font-semibold text-left space-x-2"
            >
              <Icon
                v-if="$colorMode.preference == 'system'"
                name="bi:circle-half"
              />
              <Icon v-if="$colorMode.preference == 'light'" name="bi:sun" />
              <Icon
                v-else-if="$colorMode.preference == 'dark'"
                name="bi:moon"
              />
              <p>{{ $t("theme") }}</p>
            </div>
            <Icon
              name="bi:chevron-down"
              :class="
                open
                  ? 'absolute right-0 mr-2 rotate-180 transform'
                  : 'absolute right-0 mr-2'
              "
            />
          </button>
          <div v-if="isThemeVisible" class="px-3 py-2">
            <MenuItem>
              <button
                class="flex items-center w-full px-2 py-2 text-sm rounded-md group text-light-text dark:text-dark-text hover:bg-light-highlight dark:hover:bg-dark-highlight"
                @click="
                  $colorMode.preference = 'system';
                  toggleThemeVisible();
                  close();
                "
              >
                <Icon name="bi:circle-half" size="1em" />
                <p class="px-1">System</p>
              </button>
            </MenuItem>
            <MenuItem>
              <button
                class="flex items-center w-full px-2 py-2 text-sm rounded-md group text-light-text dark:text-dark-text hover:bg-light-highlight dark:hover:bg-dark-highlight"
                @click="
                  $colorMode.preference = 'light';
                  toggleThemeVisible();
                  close();
                "
              >
                <Icon name="bi:sun" size="1em" />
                <p class="px-1">Light</p>
              </button>
            </MenuItem>
            <MenuItem>
              <button
                class="flex items-center w-full px-2 py-2 text-sm rounded-md group text-light-text dark:text-dark-text hover:bg-light-highlight dark:hover:bg-dark-highlight"
                @click="
                  $colorMode.preference = 'dark';
                  toggleThemeVisible();
                  close();
                "
              >
                <Icon name="bi:moon" size="1em" />
                <p class="px-1">Dark</p>
              </button>
            </MenuItem>
          </div>
          <button
            @click="toggleLocaleVisible"
            :class="[
              isLocaleVisible
                ? 'bg-light-cta-orange dark:bg-dark-cta-orange text-light-content dark:text-dark-content'
                : 'text-light-text dark:text-dark-text hover:bg-light-highlight dark:hover:bg-dark-highlight',
              'flex w-full items-center pr-6',
            ]"
          >
            <div
              class="relative z-0 flex items-center w-full px-3 py-2 text-sm font-semibold text-left space-x-2"
            >
              <Icon name="bi:globe" />
              <p class="uppercase">{{ $i18n.locale }}</p>
            </div>
            <Icon
              name="bi:chevron-down"
              :class="
                open
                  ? 'absolute right-0 mr-2 rotate-180 transform'
                  : 'absolute right-0 mr-2'
              "
            />
          </button>
          <MenuItem v-if="isLocaleVisible" class="px-2 py-2">
            <ul>
              <NuxtLink
                v-for="locale in availableLocales"
                :key="locale.code"
                :to="switchLocalePath(locale.code)"
              >
                <!-- <button @click="close"> -->
                <li
                  @click="
                    toggleLocaleVisible();
                    close();
                  "
                  class="flex w-24 px-1 py-2 text-sm rounded-md group items-left text-light-text dark:text-dark-text hover:bg-light-highlight dark:hover:bg-dark-highlight"
                >
                  {{ locale.name }}
                </li>
                <!-- </button> -->
              </NuxtLink>
            </ul>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ref } from "vue";
const isThemeVisible = ref(false);
const isLocaleVisible = ref(false);

const toggleThemeVisible = () => {
  isThemeVisible.value = !isThemeVisible.value;
};
const toggleLocaleVisible = () => {
  isLocaleVisible.value = !isLocaleVisible.value;
};

const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const availableLocales = computed(() => {
  return locales.value.filter((i) => i.code !== locale.value);
});
</script>
