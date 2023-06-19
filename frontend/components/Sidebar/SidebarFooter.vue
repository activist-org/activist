<template>
  <footer
    class="border-r transition-all duration-500 bg-light-header dark:bg-dark-header border-light-section-div dark:border-dark-section-div"
    :class="{
      'w-48': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
      'w-16 absolute bottom-0':
        sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      'absolute bottom-0': onHomePage,
    }"
  >
    <div class="flex">
      <div
        class="flex flex-col justify-center px-[0.375rem] pt-2 pb-3 space-y-1"
        :class="{
          'w-[11.4rem]':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'w-[3.4rem]':
            sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
      >
        <Disclosure v-slot="{ open, close }">
          <DisclosureButton
            :ref="(el) => (disclosure[0] = close)"
            class="flex items-center w-full rounded-md bg-light-menu-selection dark:bg-dark-menu-selection text-light-content dark:text-dark-content hover:bg-light-highlight dark:hover:bg-dark-highlight hover:text-light-special-text hover:dark:text-dark-special-text focus-brand"
            @click="closeOtherMenus(0)"
          >
            <div
              class="relative z-0 flex items-center w-full px-[0.625rem] py-2 space-x-2 text-sm font-medium text-left"
            >
              <Icon
                name="bi:plus-circle"
                size="1em"
                class="flex-shrink-0 w-5 h-5 text-center"
              />
              <Transition name="text">
                <p
                  v-if="
                    sidebar.collapsed == false ||
                    sidebar.collapsedSwitch == false
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
                class="absolute right-0 mr-8"
                :class="open ? 'rotate-180 transform' : ''"
              />
            </Transition>
          </DisclosureButton>
          <DisclosurePanel class="flex flex-col">
            <div
              class="p-1 space-y-1 rounded-md bg-light-header dark:bg-dark-header"
            >
              <SidebarSelector
                iconURL="bi:calendar-check"
                btnText="New event"
                btnURL="/"
                :selected="false"
                :active="true"
              />
              <SidebarSelector
                iconURL="IconOrganization"
                btnText="New organization"
                btnURL="/"
                :selected="false"
                :active="true"
              />
              <SidebarSelector
                iconURL="IconGroup"
                btnText="New group"
                btnURL="/"
                :selected="false"
                :active="true"
              />
              <SidebarSelector
                iconURL="IconResource"
                btnText="New resource"
                btnURL="/"
                :selected="false"
                :active="true"
              />
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
              class="relative z-0 flex items-center w-full px-[0.625rem] py-2 space-x-2 text-sm font-medium text-left"
            >
              <Icon
                name="bi:info-circle"
                size="1em"
                class="flex-shrink-0 w-5 h-5"
              />
              <Transition name="text">
                <p
                  v-if="
                    sidebar.collapsed == false ||
                    sidebar.collapsedSwitch == false
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
                class="absolute right-0 mr-8"
                :class="open ? 'rotate-180 transform' : ''"
              />
            </Transition>
          </DisclosureButton>
          <DisclosurePanel class="flex flex-col">
            <div
              class="p-1 space-y-1 rounded-md bg-light-header dark:bg-dark-header"
            >
              <SidebarSelector
                iconURL="bi:question-circle"
                btnText="Help"
                btnURL="/help"
                :selected="false"
                :active="true"
              />
              <SidebarSelector
                iconURL="bi:layout-text-sidebar-reverse"
                btnText="Documentation"
                btnURL="/docs"
                :selected="false"
                :active="true"
              />
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
              class="relative z-0 flex items-center w-full px-[0.625rem] py-2 space-x-2 text-sm font-medium text-left"
            >
              <Icon
                name="bi:person-circle"
                size="1em"
                class="flex-shrink-0 w-5 h-5"
              />
              <Transition name="text">
                <p
                  v-if="
                    sidebar.collapsed == false ||
                    sidebar.collapsedSwitch == false
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
                class="absolute right-0 mr-8"
                :class="open ? 'rotate-180 transform' : ''"
              />
            </Transition>
          </DisclosureButton>
          <DisclosurePanel class="flex flex-col">
            <div
              class="p-1 space-y-1 rounded-md bg-light-header dark:bg-dark-header"
            >
              <SidebarSelector
                iconURL="bi:person-circle"
                btnText="Your profile"
                btnURL="/"
                :selected="false"
                :active="true"
              />
              <SidebarSelector
                iconURL="bi:calendar-check"
                btnText="Your events"
                btnURL="/"
                :selected="false"
                :active="true"
              />
              <SidebarSelector
                iconURL="IconOrganization"
                btnText="Your orgs"
                btnURL="/"
                :selected="false"
                :active="true"
              />
              <SidebarSelector
                iconURL="bi:bell"
                btnText="Notifications"
                btnURL="/"
                :selected="false"
                :active="true"
              />
              <SidebarSelector
                iconURL="bi:gear"
                btnText="Settings"
                btnURL="/"
                :selected="false"
                :active="true"
              />
              <SidebarSelector
                iconURL="bi:box-arrow-left"
                btnText="Sign out"
                btnURL="/"
                :selected="false"
                :active="true"
              />
            </div>
          </DisclosurePanel>
        </Disclosure>
      </div>
      <div
        class="flex right-0 w-[0.6rem] bg-light-section-div dark:bg-dark-section-div"
      ></div>
    </div>
  </footer>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
const { locale, locales } = useI18n();

const route = useRoute();
const onHomePage = route.path.includes("home");

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
