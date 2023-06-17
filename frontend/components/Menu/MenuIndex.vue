<template>
  <div
    class="mx-1 transition-all duration-500 text-light-text dark:text-dark-text"
  >
    <div
      v-if="menuType === 'organization' || menuType === 'event'"
      class="flex flex-col items-center"
    >
      <div
        v-if="menuType === 'organization'"
        :class="{
          'w-32 h-32':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'w-10 h-10':
            sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
        :alt="name + ' logo'"
      >
        <ImageOrganization :imgURL="logoUrl" />
      </div>
      <div
        v-else="menuType === 'event'"
        :class="{
          'w-32 h-32':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'w-10 h-10':
            sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
        :alt="name + ' logo'"
      >
        <ImageEvent eventType="act" />
      </div>
      <p
        v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
        class="mt-1 text-xl font-bold text-center"
      >
        {{ name }}
      </p>
      <p
        v-if="sidebar.collapsed == true && sidebar.collapsedSwitch == true"
        class="mt-1 text-lg font-bold text-center"
      >
        {{ nameAbbreviation }}
      </p>
      <ul class="flex flex-col w-full px-1 mb-1">
        <li
          v-if="menuType === 'organization'"
          v-for="button in organizationButtons"
        >
          <MenuSelector
            :btn-text="button.btnText"
            :icon-u-r-l="button.iconURL"
            :btnURL="button.btnURL"
            :selected="button.selected"
            :active="button.active"
          />
        </li>
        <li v-if="menuType === 'event'" v-for="button in eventButtons">
          <MenuSelector
            :btn-text="button.btnText"
            :icon-u-r-l="button.iconURL"
            :btnURL="button.btnURL"
            :selected="button.selected"
            :active="button.active"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const sidebar = useSidebar();

const props = defineProps<{
  name: string;
  menuType: "organization" | "event";
  logoUrl?: string;
}>();

const nameAbbreviation = props.name
  .split(" ")
  .map(function (item) {
    return item[0];
  })
  .join("");

interface MenuSelectorType {
  btnText: string;
  btnURL: string;
  iconURL: string;
  selected: boolean;
  active: boolean;
}

const organizationButtons: MenuSelectorType[] = [
  {
    btnText: "sidebar.about",
    btnURL: "/",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    btnText: "sidebar.events",
    btnURL: "/",
    iconURL: "bi:calendar-check",
    selected: false,
    active: true,
  },
  {
    btnText: "sidebar.groups",
    btnURL: "/",
    iconURL: "IconGroup",
    selected: false,
    active: true,
  },
  {
    btnText: "sidebar.resources",
    btnURL: "/",
    iconURL: "IconResource",
    selected: false,
    active: true,
  },
  {
    btnText: "sidebar.faq",
    btnURL: "/",
    iconURL: "IconFAQ",
    selected: false,
    active: true,
  },
  {
    btnText: "sidebar.settings",
    btnURL: "/",
    iconURL: "bi:gear",
    selected: false,
    active: true,
  },
  {
    btnText: "sidebar.affiliates",
    btnURL: "/",
    iconURL: "IconSupport",
    selected: false,
    active: false,
  },
  {
    btnText: "sidebar.tasks",
    btnURL: "/",
    iconURL: "bi:check-square",
    selected: false,
    active: false,
  },
  {
    btnText: "sidebar.discussions",
    btnURL: "/",
    iconURL: "IconDiscussion",
    selected: false,
    active: false,
  },
];

const eventButtons: MenuSelectorType[] = [
  {
    btnText: "sidebar.about",
    btnURL: "/",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    btnText: "sidebar.team",
    btnURL: "/",
    iconURL: "bi:people",
    selected: false,
    active: true,
  },
  {
    btnText: "sidebar.resources",
    btnURL: "/",
    iconURL: "IconResource",
    selected: false,
    active: true,
  },
  {
    btnText: "sidebar.settings",
    btnURL: "/",
    iconURL: "bi:gear",
    selected: false,
    active: true,
  },
  {
    btnText: "sidebar.tasks",
    btnURL: "/",
    iconURL: "bi:check-square",
    selected: false,
    active: false,
  },
  {
    btnText: "sidebar.discussions",
    btnURL: "/",
    iconURL: "IconDiscussion",
    selected: false,
    active: false,
  },
];
</script>
