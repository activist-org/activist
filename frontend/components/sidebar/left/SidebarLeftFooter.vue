<template>
  <footer
    class="w-full p-1 transition-all duration-500 bg-light-distinct dark:bg-dark-distinct"
  >
    <div
      class="flex flex-col justify-center w-full p-1 bg-light-header dark:bg-dark-header elem-shadow-sm space-y-1 rounded-md"
    >
      <Disclosure
        v-for="(subMenu, index) in menu"
        v-slot="{ open, close }"
        :key="subMenu.id"
      >
        <DisclosureButton
          @keyup.enter="closeOtherMenus(index)"
          @click="closeOtherMenus(index)"
          :ref="(el) => (disclosureButtons[0] = { close, el })"
          class="flex items-center w-full rounded-md style-menu-option-cta pl-1"
          :aria-label="
            $t(`components.sidebar-left-footer.${subMenu.ariaLabel}`)
          "
        >
          <div
            class="relative z-0 flex items-center w-full px-[0.625rem] py-2 space-x-2 text-sm font-medium text-left"
          >
            <Icon
              class="flex-shrink-0 w-5 h-5 text-center"
              :name="subMenu.icon"
              size="1em"
            />
            <Transition name="text">
              <p
                v-if="
                  sidebar.collapsed == false || sidebar.collapsedSwitch == false
                "
                class="select-none"
              >
                {{ $t(`components.sidebar-left-footer.${subMenu.label}`) }}
              </p>
            </Transition>
          </div>
          <Transition name="chevron">
            <Icon
              v-if="
                sidebar.collapsed == false || sidebar.collapsedSwitch == false
              "
              class="absolute right-0 mr-8"
              :class="{ 'rotate-180 transform': open }"
              name="bi:chevron-up"
            />
          </Transition>
        </DisclosureButton>
        <DisclosurePanel class="flex flex-col">
          <div
            :ref="(el) => (disclosurePanels[index] = el)"
            class="p-1 space-y-1 rounded-md bg-light-header dark:bg-dark-header"
          >
            <SidebarLeftSelector
              v-for="button in subMenu.panelButtons"
              :key="button.id"
              :label="button.label"
              :routeURL="button.routeURL"
              :iconURL="button.iconURL"
              :selected="button.selected"
            />
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import type { Ref } from "vue";
import type { BarMenu } from "~/types/menu-selector";

const disclosureButtons = ref<
  {
    close: (ref?: Ref | HTMLElement) => void;
    el: Ref | HTMLElement;
  }[]
>([]);
const disclosurePanels = ref<(Element | ComponentPublicInstance | null)[]>([]);

const closeOtherMenus = (id: number) => {
  console.log(id);
  disclosureButtons.value
    .filter((d, i) => i !== id)
    .forEach((disclosureButton) => disclosureButton.close());

  // Focus on the first item in disclosurePanels when opening.
  // Focus on the disclosureButton when closing.
  if (disclosurePanels.value[id]?.childNodes) {
    disclosurePanels.value[id]?.childNodes[1].focus();
  } else {
    disclosureButtons.value[id]?.el?.$el.focus();
  }
};

const sidebar = useSidebar();

const menu: BarMenu[] = [
  {
    id: "createButtons",
    ariaLabel: "create-aria-label",
    icon: "bi:plus-circle",
    label: "create",
    panelButtons: [
      {
        id: 1,
        label: "components._global.new-event",
        routeURL: "/events/create",
        iconURL: "bi:calendar-check",
        selected: false,
      },
      {
        id: 2,
        label: "components.sidebar-left-selector.label.new-organization",
        routeURL: "/organizations/create",
        iconURL: "IconOrganization",
        selected: false,
      },
      {
        id: 3,
        label: "components._global.new-group",
        routeURL: "/",
        iconURL: "IconGroup",
        selected: false,
      },
      {
        id: 4,
        label: "components._global.new-resource",
        routeURL: "/resources/create",
        iconURL: "IconResource",
        selected: false,
      },
    ],
  },
  {
    id: "infoButtons",
    ariaLabel: "info-aria-label",
    icon: "bi:info-circle",
    label: "info",
    panelButtons: [
      {
        id: 1,
        label: "_global.help",
        routeURL: "/help",
        iconURL: "bi:question-circle",
        selected: false,
      },
      {
        id: 2,
        label: "_global.documentation",
        routeURL: "/docs",
        iconURL: "bi:layout-text-sidebar-reverse",
        selected: false,
      },
      {
        id: 3,
        label: "_global.legal",
        routeURL: "/legal",
        iconURL: "IconLegal",
        selected: false,
      },
    ],
  },
  {
    id: "userButtons",
    ariaLabel: "username-aria-label",
    icon: "bi:person-circle",
    label: "username",
    panelButtons: [
      {
        id: 1,
        label: "components.sidebar-left-selector.label.your-profile",
        routeURL: "/",
        iconURL: "bi:person-circle",
        selected: false,
      },
      {
        id: 2,
        label: "components.sidebar-left-selector.label.your-events",
        routeURL: "/",
        iconURL: "bi:calendar-check",
        selected: false,
      },
      {
        id: 3,
        label: "components.sidebar-left-selector.label.your-orgs",
        routeURL: "/",
        iconURL: "IconOrganization",
        selected: false,
      },
      {
        id: 4,
        label: "components.sidebar-left-selector.label.notifications",
        routeURL: "/",
        iconURL: "bi:bell",
        selected: false,
      },
      {
        id: 5,
        label: "_global.settings",
        routeURL: "/",
        iconURL: "bi:gear",
        selected: false,
      },
      {
        id: 6,
        label: "components.sidebar-left-selector.label.sign-out",
        routeURL: "/",
        iconURL: "bi:box-arrow-left",
        selected: false,
      },
    ],
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
