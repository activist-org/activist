<template>
  <footer
    class="w-full border-t border-r transition-all duration-500 bg-light-header dark:bg-dark-header border-light-section-div dark:border-dark-section-div"
  >
    <div class="flex">
      <div
        class="flex flex-col justify-center px-[0.375rem] pt-2 pb-3 space-y-1"
        :class="{
          'w-full':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'w-[3.4rem]':
            sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
      >
        <disclosure v-slot="{ open, close }">
          <disclosurebutton
            v-on:keyup.enter="closeOtherMenus(0)"
            @click="closeOtherMenus(0)"
            class="flex items-center w-full rounded-md bg-light-menu-selection dark:bg-dark-menu-selection text-light-content dark:text-dark-content hover:bg-light-highlight dark:hover:bg-dark-highlight hover:text-light-special-text hover:dark:text-dark-special-text focus-brand"
            :ref="(el) => (disclosureButtons[0] = { close, el })"
            :aria-label="$t('components.sidebar-left-footer.create-aria-label')"
          >
            <div
              class="relative z-0 flex items-center w-full px-[0.625rem] py-2 space-x-2 text-sm font-medium text-left"
            >
              <icon
                class="flex-shrink-0 w-5 h-5 text-center"
                name="bi:plus-circle"
                size="1em"
              />
              <transition name="text">
                <p
                  v-if="
                    sidebar.collapsed == false ||
                    sidebar.collapsedSwitch == false
                  "
                  class="select-none"
                >
                  {{ $t("components.sidebar-left-footer.create") }}
                </p>
              </transition>
            </div>
            <transition name="chevron">
              <icon
                v-if="
                  sidebar.collapsed == false || sidebar.collapsedSwitch == false
                "
                class="absolute right-0 mr-8"
                :class="{ 'rotate-180 transform': open }"
                name="bi:chevron-up"
              />
            </transition>
          </disclosurebutton>
          <disclosurepanel class="flex flex-col">
            <div
              class="p-1 space-y-1 rounded-md bg-light-header dark:bg-dark-header"
              :ref="(el) => (disclosurePanels[0] = el)"
            >
              <sidebarleftselector
                v-for="button in createButtons"
                :label="button.label"
                :routeURL="button.routeURL"
                :iconURL="button.iconURL"
                :selected="button.selected"
                :active="button.active"
              />
            </div>
          </disclosurepanel>
        </disclosure>
        <disclosure v-slot="{ open, close }">
          <disclosurebutton
            v-on:keyup.enter="closeOtherMenus(1)"
            @click="closeOtherMenus(1)"
            class="flex items-center w-full rounded-md bg-light-menu-selection dark:bg-dark-menu-selection text-light-content dark:text-dark-content hover:bg-light-highlight dark:hover:bg-dark-highlight hover:text-light-special-text hover:dark:text-dark-special-text focus-brand"
            :ref="(el) => (disclosureButtons[1] = { close, el })"
            :aria-label="$t('components.sidebar-left-footer.info-aria-label')"
          >
            <div
              class="relative z-0 flex items-center w-full px-[0.625rem] py-2 space-x-2 text-sm font-medium text-left"
            >
              <icon
                class="flex-shrink-0 w-5 h-5"
                name="bi:info-circle"
                size="1em"
              />
              <transition name="text">
                <p
                  v-if="
                    sidebar.collapsed == false ||
                    sidebar.collapsedSwitch == false
                  "
                  class="select-none"
                >
                  {{ $t("components.sidebar-left-footer.info") }}
                </p>
              </transition>
            </div>
            <transition name="chevron">
              <icon
                v-if="
                  sidebar.collapsed == false || sidebar.collapsedSwitch == false
                "
                class="absolute right-0 mr-8"
                :class="{ 'rotate-180 transform': open }"
                name="bi:chevron-up"
              />
            </transition>
          </disclosurebutton>
          <disclosurepanel class="flex flex-col">
            <div
              class="p-1 space-y-1 rounded-md bg-light-header dark:bg-dark-header"
              :ref="(el) => (disclosurePanels[1] = el)"
            >
              <sidebarleftselector
                v-for="button in infoButtons"
                :label="button.label"
                :routeURL="button.routeURL"
                :iconURL="button.iconURL"
                :selected="button.selected"
                :active="button.active"
              />
            </div>
          </disclosurepanel>
        </disclosure>
        <disclosure v-slot="{ open, close }">
          <disclosurebutton
            v-on:keyup.enter="closeOtherMenus(2)"
            @click="closeOtherMenus(2)"
            class="flex items-center w-full rounded-md bg-light-menu-selection dark:bg-dark-menu-selection text-light-content dark:text-dark-content hover:bg-light-highlight dark:hover:bg-dark-highlight hover:text-light-special-text hover:dark:text-dark-special-text focus-brand"
            :ref="(el) => (disclosureButtons[2] = { close, el })"
            :aria-label="
              $t('components.sidebar-left-footer.username-aria-label')
            "
          >
            <div
              class="relative z-0 flex items-center w-full px-[0.625rem] py-2 space-x-2 text-sm font-medium text-left"
            >
              <icon
                class="flex-shrink-0 w-5 h-5"
                name="bi:person-circle"
                size="1em"
              />
              <transition name="text">
                <p
                  v-if="
                    sidebar.collapsed == false ||
                    sidebar.collapsedSwitch == false
                  "
                  class="font-bold select-none"
                >
                  {{ $t("components.sidebar-left-footer.username") }}
                </p>
              </transition>
            </div>
            <transition name="chevron">
              <icon
                v-if="
                  sidebar.collapsed == false || sidebar.collapsedSwitch == false
                "
                class="absolute right-0 mr-8"
                :class="{ 'rotate-180 transform': open }"
                name="bi:chevron-up"
              />
            </transition>
          </disclosurebutton>
          <disclosurepanel class="flex flex-col">
            <div
              class="p-1 space-y-1 rounded-md bg-light-header dark:bg-dark-header"
              :ref="(el) => (disclosurePanels[2] = el)"
            >
              <sidebarleftselector
                v-for="button in userButtons"
                :label="button.label"
                :routeURL="button.routeURL"
                :iconURL="button.iconURL"
                :selected="button.selected"
                :active="button.active"
              />
            </div>
          </disclosurepanel>
        </disclosure>
      </div>
      <div
        class="flex right-0 w-[0.6rem] bg-light-section-div dark:bg-dark-section-div"
      ></div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { disclosure, disclosurebutton, disclosurepanel } from "@headlessui/vue";
import type { ref } from "vue";
import { menuselector } from "../../../types/menu-selector";

const route = useRoute();
const onHomePage = route.path.includes("home");

const disclosureButtons = ref<
  {
    close: (ref?: ref | htmlelement) => void;
    el: ref | htmlelement;
  }[]
>([]);
const disclosurePanels = ref<(element | componentpublicinstance | null)[]>([]);

const closeOtherMenus = (id: number) => {
  disclosureButtons.value
    .filter((d, i) => i !== id)
    .forEach((disclosureButton) => disclosureButton.close());

  // focus on the first item in disclosurePanels when opening.
  // focus on the disclosureButton when closing.
  if (disclosurePanels.value[id]?.childNodes) {
    disclosurePanels.value[id]?.childNodes[1].focus();
  } else {
    disclosureButtons.value[id]?.el?.$el.focus();
  }
};

const sidebar = useSidebar();

const createButtons: menuselector[] = [
  {
    label: "components.sidebar-left-selector.label.new-event",
    routeURL: "/",
    iconURL: "bi:calendar-check",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.new-organization",
    routeURL: "/",
    iconURL: "iconorganization",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.new-group",
    routeURL: "/",
    iconURL: "icongroup",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.new-resource",
    routeURL: "/",
    iconURL: "iconresource",
    selected: false,
    active: true,
  },
];

const infoButtons: menuselector[] = [
  {
    label: "components.sidebar-left-selector.label.help",
    routeURL: "/help",
    iconURL: "bi:question-circle",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.documentation",
    routeURL: "/docs",
    iconURL: "bi:layout-text-sidebar-reverse",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.legal",
    routeURL: "/legal",
    iconURL: "iconlegal",
    selected: false,
    active: true,
  },
];

const userButtons: menuselector[] = [
  {
    label: "components.sidebar-left-selector.label.your-profile",
    routeURL: "/",
    iconURL: "bi:person-circle",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.your-events",
    routeURL: "/",
    iconURL: "bi:calendar-check",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.your-orgs",
    routeURL: "/",
    iconURL: "iconorganization",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.notifications",
    routeURL: "/",
    iconURL: "bi:bell",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.settings",
    routeURL: "/",
    iconURL: "bi:gear",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.sign-out",
    routeURL: "/",
    iconURL: "bi:box-arrow-left",
    selected: false,
    active: true,
  },
];
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
