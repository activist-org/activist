<template>
  <footer
    class="absolute bottom-0 transition-all duration-500 bg-light-header dark:bg-dark-header"
    :class="{
      'w-48': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
      'w-16': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
    }"
  >
    <div
      class="flex flex-col justify-center pl-[14px] pr-[10px] px-2 pt-2 pb-3 space-y-1"
    >
      <Disclosure v-slot="{ open, close }">
        <DisclosureButton
          :ref="(el) => (disclosure[0] = close)"
          class="flex items-center w-full rounded-md bg-light-menu-selection dark:bg-dark-menu-selection text-light-content dark:text-dark-content hover:bg-light-highlight dark:hover:bg-dark-highlight hover:text-light-special-text hover:dark:text-dark-special-text focus-brand"
          @click="closeOtherMenus(0)"
        >
          <div
            class="relative z-0 flex items-center w-full px-3 py-2 space-x-2 text-sm font-medium text-left"
          >
            <Icon
              name="bi:plus-circle"
              size="1em"
              class="flex-shrink-0 w-5 h-5 text-center"
            />
            <Transition name="text">
              <p
                v-if="
                  sidebar.collapsed == false || sidebar.collapsedSwitch == false
                "
              >
                {{ $t("Create") }}
              </p>
            </Transition>
          </div>
          <Transition name="chevron">
            <Icon
              v-if="
                sidebar.collapsed == false || sidebar.collapsedSwitch == false
              "
              name="bi:chevron-up"
              class="absolute right-0 mr-6"
              :class="open ? 'rotate-180 transform' : ''"
            />
          </Transition>
        </DisclosureButton>
        <DisclosurePanel class="flex flex-col">
          <div
            class="p-1 space-y-1 rounded-md bg-light-header dark:bg-dark-header"
          >
            <MenuSelector
              :selected="false"
              iconURL="bi:calendar-check"
              btnText="New event"
              btnURL="/"
            ></MenuSelector>
            <MenuSelector
              :selected="false"
              iconURL="bi:person-square"
              btnText="New organization"
              btnURL="/"
            ></MenuSelector>
            <MenuSelector
              :selected="false"
              iconURL="bi:people-fill"
              btnText="New group"
              btnURL="/"
            ></MenuSelector>
            <MenuSelector
              :selected="false"
              iconURL="bi:pencil"
              btnText="New resource"
              btnURL="/"
            ></MenuSelector>
          </div>
        </DisclosurePanel>
      </Disclosure>
      <Disclosure v-slot="{ open, close }">
        <DisclosureButton
          :ref="(el) => (disclosure[1] = close)"
          class="flex items-center w-full rounded-md bg-light-menu-selection dark:bg-dark-menu-selection text-light-content dark:text-dark-content hover:bg-light-highlight dark:hover:bg-dark-highlight hover:text-light-special-text hover:dark:text-dark-special-text focus-brand"
          @click="closeOtherMenus(1)"
        >
          <div
            class="relative z-0 flex items-center w-full px-3 py-2 space-x-2 text-sm font-medium text-left"
          >
            <Icon
              name="bi:info-circle"
              size="1em"
              class="flex-shrink-0 w-5 h-5"
            />
            <Transition name="text">
              <p
                v-if="
                  sidebar.collapsed == false || sidebar.collapsedSwitch == false
                "
              >
                {{ $t("Info") }}
              </p>
            </Transition>
          </div>
          <Transition name="chevron">
            <Icon
              v-if="
                sidebar.collapsed == false || sidebar.collapsedSwitch == false
              "
              name="bi:chevron-up"
              class="absolute right-0 mr-6"
              :class="open ? 'rotate-180 transform' : ''"
            />
          </Transition>
        </DisclosureButton>
        <DisclosurePanel class="flex flex-col">
          <div
            class="p-1 space-y-1 rounded-md bg-light-header dark:bg-dark-header"
          >
            <MenuSelector
              :selected="false"
              iconURL="bi:question-circle"
              btnText="Help"
              btnURL="/help"
            ></MenuSelector>
            <MenuSelector
              :selected="false"
              iconURL="bi:layout-text-sidebar-reverse"
              btnText="Documentation"
              btnURL="/docs"
            ></MenuSelector>
          </div>
        </DisclosurePanel>
      </Disclosure>
      <Disclosure v-slot="{ open, close }">
        <DisclosureButton
          :ref="(el) => (disclosure[2] = close)"
          class="flex items-center w-full rounded-md bg-light-menu-selection dark:bg-dark-menu-selection text-light-content dark:text-dark-content hover:bg-light-highlight dark:hover:bg-dark-highlight hover:text-light-special-text hover:dark:text-dark-special-text focus-brand"
          @click="closeOtherMenus(2)"
        >
          <div
            class="relative z-0 flex items-center w-full px-3 py-2 space-x-2 text-sm font-medium text-left"
          >
            <Icon
              name="bi:person-circle"
              size="1em"
              class="flex-shrink-0 w-5 h-5"
            />
            <Transition name="text">
              <p
                v-if="
                  sidebar.collapsed == false || sidebar.collapsedSwitch == false
                "
                class="font-bold"
              >
                {{ $t("Username") }}
              </p>
            </Transition>
          </div>
          <Transition name="chevron">
            <Icon
              v-if="
                sidebar.collapsed == false || sidebar.collapsedSwitch == false
              "
              name="bi:chevron-up"
              class="absolute right-0 mr-6"
              :class="open ? 'rotate-180 transform' : ''"
            />
          </Transition>
        </DisclosureButton>
        <DisclosurePanel class="flex flex-col">
          <div
            class="p-1 space-y-1 rounded-md bg-light-header dark:bg-dark-header"
          >
            <MenuSelector
              :selected="false"
              iconURL="bi:person-circle"
              btnText="Your profile"
              btnURL="/"
            ></MenuSelector>
            <MenuSelector
              :selected="false"
              iconURL="bi:calendar-check"
              btnText="Your events"
              btnURL="/"
            ></MenuSelector>
            <MenuSelector
              :selected="false"
              iconURL="bi:person-square"
              btnText="Your orgs"
              btnURL="/"
            ></MenuSelector>
            <MenuSelector
              :selected="false"
              iconURL="bi:bell"
              btnText="Notifications"
              btnURL="/"
            ></MenuSelector>
            <MenuSelector
              :selected="false"
              iconURL="bi:gear"
              btnText="Settings"
              btnURL="/"
            ></MenuSelector>
            <MenuSelector
              :selected="false"
              iconURL="bi:box-arrow-left"
              btnText="Sign out"
              btnURL="/"
            ></MenuSelector>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
  </footer>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
const { locale, locales } = useI18n();

const disclosure = ref([]);
const closeOtherMenus = (id) => {
  disclosure.value.filter((d, i) => i !== id).forEach((c) => c());
};
const sidebar = useSidebar();
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
