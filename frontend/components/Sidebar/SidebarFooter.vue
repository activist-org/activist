<template>
  <footer
    class="absolute bottom-0 bg-light-header dark:bg-dark-header transition-all duration-500"
    :class="{
      'w-48': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
      'w-16': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
    }"
  >
    <div
      class="flex flex-col pt-2 pb-3 space-y-2"
      :class="{
        'px-2': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
        'px-3': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
      }"
    >
      <Disclosure v-slot="{ open, close }">
        <DisclosureButton
          :ref="(el) => (disclosure[0] = close)"
          class="flex items-center w-full rounded-md bg-light-menu-selection dark:bg-dark-menu-selection text-light-content dark:text-dark-content hover:bg-light-highlight dark:hover:bg-dark-highlight hover:text-light-special-text hover:dark:text-dark-special-text"
          @click="closeOtherMenus(0)"
        >
          <div
            class="relative z-0 flex items-center w-full px-3 py-2 space-x-2 text-sm font-medium text-left"
          >
            <Icon name="bi:plus-circle" size="1.25em" />
            <p
              v-if="
                sidebar.collapsed == false || sidebar.collapsedSwitch == false
              "
            >
              {{ $t("Create") }}
            </p>
          </div>
          <Icon
            v-if="
              sidebar.collapsed == false || sidebar.collapsedSwitch == false
            "
            name="bi:chevron-up"
            class="absolute right-0 mr-6"
            :class="open ? 'rotate-180 transform' : ''"
          />
        </DisclosureButton>
        <DisclosurePanel class="space-y-1">
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
        </DisclosurePanel>
      </Disclosure>
      <Disclosure v-slot="{ open, close }">
        <DisclosureButton
          :ref="(el) => (disclosure[1] = close)"
          class="flex items-center w-full rounded-md bg-light-menu-selection dark:bg-dark-menu-selection text-light-content dark:text-dark-content hover:bg-light-highlight dark:hover:bg-dark-highlight hover:text-light-special-text hover:dark:text-dark-special-text"
          @click="closeOtherMenus(1)"
        >
          <div
            class="relative z-0 flex items-center w-full px-3 py-2 space-x-2 text-sm font-medium text-left"
          >
            <Icon name="bi:info-circle" size="1.25em" />
            <p
              v-if="
                sidebar.collapsed == false || sidebar.collapsedSwitch == false
              "
            >
              {{ $t("Info") }}
            </p>
          </div>
          <Icon
            v-if="
              sidebar.collapsed == false || sidebar.collapsedSwitch == false
            "
            name="bi:chevron-up"
            class="absolute right-0 mr-6"
            :class="open ? 'rotate-180 transform' : ''"
          />
        </DisclosureButton>
        <DisclosurePanel class="space-y-1">
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
        </DisclosurePanel>
      </Disclosure>
      <Disclosure v-slot="{ open, close }">
        <DisclosureButton
          :ref="(el) => (disclosure[2] = close)"
          class="flex items-center w-full rounded-md bg-light-menu-selection dark:bg-dark-menu-selection text-light-content dark:text-dark-content hover:bg-light-highlight dark:hover:bg-dark-highlight hover:text-light-special-text hover:dark:text-dark-special-text"
          @click="closeOtherMenus(2)"
        >
          <div
            class="relative z-0 flex items-center w-full px-3 py-2 space-x-2 text-sm font-medium text-left"
          >
            <Icon name="bi:person-circle" size="1.25em" />
            <p
              v-if="
                sidebar.collapsed == false || sidebar.collapsedSwitch == false
              "
              class="font-bold"
            >
              {{ $t("Username") }}
            </p>
          </div>
          <Icon
            v-if="
              sidebar.collapsed == false || sidebar.collapsedSwitch == false
            "
            name="bi:chevron-up"
            class="absolute right-0 mr-6"
            :class="open ? 'rotate-180 transform' : ''"
          />
        </DisclosureButton>
        <DisclosurePanel class="space-y-1">
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
