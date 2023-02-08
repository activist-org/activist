<template>
  <footer class="absolute bottom-0 w-48 bg-light-header dark:bg-dark-header">
    <div class="flex flex-col px-2 py-3 space-y-2">
      <Disclosure v-slot="{ open, close }">
        <DisclosureButton
          :ref="(el) => (disclosure[0] = close)"
          :class="[
            open ? '' : '',
            'flex w-full rounded-md items-center pr-6 bg-light-menu-selection dark:bg-dark-menu-selection text-light-content dark:text-dark-content hover:bg-light-highlight dark:hover:bg-dark-highlight',
          ]"
          @click="hideOther(0)"
        >
          <div
            class="relative z-0 flex items-center w-full px-3 py-2 space-x-2 text-sm font-medium text-left"
          >
            <Icon name="bi:plus-circle" size="1.25em" />
            <p>{{ $t("Create") }}</p>
          </div>
          <Icon
            name="bi:chevron-up"
            :class="
              open
                ? 'absolute right-0 mr-6 rotate-180 transform'
                : 'absolute right-0 mr-6'
            "
          />
        </DisclosureButton>
        <DisclosurePanel class="py-1 space-y-1">
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
            iconURL="bi:pencil"
            btnText="New resource"
            btnURL="/"
          ></MenuSelector>
        </DisclosurePanel>
      </Disclosure>
      <Disclosure v-slot="{ open, close }">
        <DisclosureButton
          :ref="(el) => (disclosure[1] = close)"
          :class="[
            open ? '' : '',
            'flex w-full rounded-md items-center pr-6 bg-light-menu-selection dark:bg-dark-menu-selection text-light-content dark:text-dark-content hover:bg-light-highlight dark:hover:bg-dark-highlight',
          ]"
          @click="hideOther(1)"
        >
          <div
            class="relative z-0 flex items-center w-full px-3 py-2 space-x-2 text-sm font-medium text-left"
          >
            <Icon name="bi:info-circle" size="1.25em" />
            <p>{{ $t("Info") }}</p>
          </div>
          <Icon
            name="bi:chevron-up"
            :class="
              open
                ? 'absolute right-0 mr-6 rotate-180 transform'
                : 'absolute right-0 mr-6'
            "
          />
        </DisclosureButton>
        <DisclosurePanel class="py-1 space-y-1">
          <MenuSelector
            :selected="false"
            iconURL="bi:question-circle"
            btnText="Help"
            btnURL="/"
          ></MenuSelector>
          <MenuSelector
            :selected="false"
            iconURL="bi:layout-text-sidebar-reverse"
            btnText="Documentation"
            btnURL="/"
          ></MenuSelector>
        </DisclosurePanel>
      </Disclosure>
      <Disclosure v-slot="{ open, close }">
        <DisclosureButton
          :ref="(el) => (disclosure[2] = close)"
          :class="[
            open ? '' : '',
            'flex w-full rounded-md items-center pr-6 bg-light-menu-selection dark:bg-dark-menu-selection text-light-content dark:text-dark-content hover:bg-light-highlight dark:hover:bg-dark-highlight',
          ]"
          @click="hideOther(2)"
        >
          <div
            class="relative z-0 flex items-center w-full px-3 py-2 space-x-2 text-sm font-medium text-left"
          >
            <Icon name="bi:person-circle" size="1.25em" />
            <p class="font-bold">{{ $t("Username") }}</p>
          </div>
          <Icon
            name="bi:chevron-up"
            :class="
              open
                ? 'absolute right-0 mr-6 rotate-180 transform'
                : 'absolute right-0 mr-6'
            "
          />
        </DisclosureButton>
        <DisclosurePanel class="py-1 space-y-1">
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
const hideOther = (id) => {
  disclosure.value.filter((d, i) => i !== id).forEach((c) => c());
};
</script>
