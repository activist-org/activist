<template>
  <div
    class="mx-1 transition-all duration-500 text-light-text dark:text-dark-text"
  >
    <div
      v-if="pageType === 'organization' || pageType === 'event'"
      class="flex flex-col items-center"
    >
      <div
        v-if="pageType === 'organization'"
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
        v-else="pageType === 'event'"
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
          v-if="pageType === 'organization'"
          v-for="button in organizationButtons"
        >
          <SidebarLeftSelector
            :btn-text="button.btnText"
            :icon-u-r-l="button.iconURL"
            :btnURL="button.btnURL"
            :selected="button.selected"
            :active="button.active"
          />
        </li>
        <li v-if="pageType === 'event'" v-for="button in eventButtons">
          <SidebarLeftSelector
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
  pageType: "organization" | "event";
  logoUrl?: string;
}>();

const nameAbbreviation = props.name
  .split(" ")
  .map(function (item) {
    return item[0];
  })
  .join("");

interface SidebarLeftSelectorType {
  btnText: string;
  btnURL: string;
  iconURL: string;
  selected: boolean;
  active: boolean;
}

const organizationButtons: SidebarLeftSelectorType[] = [
  {
    btnText: "components.sidebar.left.index.about",
    btnURL: "/",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    btnText: "components.sidebar.left.index.events",
    btnURL: "/",
    iconURL: "bi:calendar-check",
    selected: false,
    active: true,
  },
  {
    btnText: "components.sidebar.left.index.groups",
    btnURL: "/",
    iconURL: "IconGroup",
    selected: false,
    active: true,
  },
  {
    btnText: "components.sidebar.left.index.resources",
    btnURL: "/",
    iconURL: "IconResource",
    selected: false,
    active: true,
  },
  {
    btnText: "components.sidebar.left.index.faq",
    btnURL: "/",
    iconURL: "IconFAQ",
    selected: false,
    active: true,
  },
  {
    btnText: "components.sidebar.left.index.settings",
    btnURL: "/",
    iconURL: "bi:gear",
    selected: false,
    active: true,
  },
  {
    btnText: "components.sidebar.left.index.affiliates",
    btnURL: "/",
    iconURL: "IconSupport",
    selected: false,
    active: false,
  },
  {
    btnText: "components.sidebar.left.index.tasks",
    btnURL: "/",
    iconURL: "bi:check-square",
    selected: false,
    active: false,
  },
  {
    btnText: "components.sidebar.left.index.discussions",
    btnURL: "/",
    iconURL: "IconDiscussion",
    selected: false,
    active: false,
  },
];

const eventButtons: SidebarLeftSelectorType[] = [
  {
    btnText: "components.sidebar.left.index.about",
    btnURL: "/",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    btnText: "components.sidebar.left.index.team",
    btnURL: "/",
    iconURL: "bi:people",
    selected: false,
    active: true,
  },
  {
    btnText: "components.sidebar.left.index.resources",
    btnURL: "/",
    iconURL: "IconResource",
    selected: false,
    active: true,
  },
  {
    btnText: "components.sidebar.left.index.settings",
    btnURL: "/",
    iconURL: "bi:gear",
    selected: false,
    active: true,
  },
  {
    btnText: "components.sidebar.left.index.tasks",
    btnURL: "/",
    iconURL: "bi:check-square",
    selected: false,
    active: false,
  },
  {
    btnText: "components.sidebar.left.index.discussions",
    btnURL: "/",
    iconURL: "IconDiscussion",
    selected: false,
    active: false,
  },
];

const AboutIndexButtons: SidebarLeftSelectorType[] = [
  {
    btnText: "components.sidebar.left.index.about-activist",
    btnURL: "/about",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    btnText: "components.sidebar.left.index.activism-network",
    btnURL: "/about/activism-network",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    btnText: "components.sidebar.left.index.connect",
    btnURL: "/about/connect",
    iconURL: "bi:people",
    selected: false,
    active: true,
  },
  {
    btnText: "components.sidebar.left.index.roadmap",
    btnURL: "/about/roadmap",
    iconURL: "bi:people",
    selected: false,
    active: true,
  },
  {
    btnText: "components.sidebar.left.index.impress",
    btnURL: "/about/impress",
    iconURL: "bi:people",
    selected: false,
    active: true,
  },
];

const LegalIndexButtons: SidebarLeftSelectorType[] = [
  {
    btnText: "components.sidebar.left.index.legal-support",
    btnURL: "/legal/legal-support",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    btnText: "components.sidebar.left.index.privacy-policy",
    btnURL: "/legal/privacy-policy",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    btnText: "components.sidebar.left.index.trademark-policy",
    btnURL: "/legal/trademark-policy",
    iconURL: "bi:people",
    selected: false,
    active: true,
  },
];

const HelpIndexButtons: SidebarLeftSelectorType[] = [
  {
    btnText: "components.sidebar.left.index.faq",
    btnURL: "/help/faq",
    iconURL: "bi:people",
    selected: false,
    active: true,
  },
  {
    btnText: "components.sidebar.left.index.contact",
    btnURL: "/help/contact",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    btnText: "components.sidebar.left.index.press",
    btnURL: "/help/press",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    btnText: "components.sidebar.left.index.status",
    btnURL: "/help/status",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
];

const DocsIndexButtons: SidebarLeftSelectorType[] = [
  {
    btnText: "components.sidebar.left.index.get-active",
    btnURL: "/docs/get-active",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    btnText: "components.sidebar.left.index.get-organized",
    btnURL: "/docs/get-organized",
    iconURL: "bi:people",
    selected: false,
    active: true,
  },
  {
    btnText: "components.sidebar.left.index.grow-organization",
    btnURL: "/docs/grow-organization",
    iconURL: "bi:people",
    selected: false,
    active: true,
  },
];
</script>
