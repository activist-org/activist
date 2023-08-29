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
            :label="button.label"
            :routeURL="button.routeURL"
            :iconURL="button.iconURL"
            :selected="button.selected"
            :active="button.active"
          />
        </li>
        <li v-if="pageType === 'event'" v-for="button in eventButtons">
          <SidebarLeftSelector
            :label="button.label"
            :routeURL="button.routeURL"
            :iconURL="button.iconURL"
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
  label: string;
  routeURL: string;
  iconURL: string;
  selected: boolean;
  active: boolean;
}

const organizationButtons: SidebarLeftSelectorType[] = [
  {
    label: "components.sidebar-left-selector.label.about",
    routeURL: "/",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.events",
    routeURL: "/",
    iconURL: "bi:calendar-check",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.groups",
    routeURL: "/",
    iconURL: "IconGroup",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.resources",
    routeURL: "/",
    iconURL: "IconResource",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.faq",
    routeURL: "/",
    iconURL: "IconFAQ",
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
    label: "components.sidebar-left-selector.label.affiliates",
    routeURL: "/",
    iconURL: "IconSupport",
    selected: false,
    active: false,
  },
  {
    label: "components.sidebar-left-selector.label.tasks",
    routeURL: "/",
    iconURL: "bi:check-square",
    selected: false,
    active: false,
  },
  {
    label: "components.sidebar-left-selector.label.discussions",
    routeURL: "/",
    iconURL: "octicon:comment-discussion-24",
    selected: false,
    active: false,
  },
];

const eventButtons: SidebarLeftSelectorType[] = [
  {
    label: "components.sidebar-left-selector.label.about",
    routeURL: "/",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.team",
    routeURL: "/",
    iconURL: "bi:people",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.resources",
    routeURL: "/",
    iconURL: "IconResource",
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
    label: "components.sidebar-left-selector.label.tasks",
    routeURL: "/",
    iconURL: "bi:check-square",
    selected: false,
    active: false,
  },
  {
    label: "components.sidebar-left-selector.label.discussions",
    routeURL: "/",
    iconURL: "octicon:comment-discussion-24",
    selected: false,
    active: false,
  },
];

const AboutIndexButtons: SidebarLeftSelectorType[] = [
  {
    label: "components.sidebar-left-selector.label.about-activist",
    routeURL: "/about",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.activism-network",
    routeURL: "/about/activism-network",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.connect",
    routeURL: "/about/connect",
    iconURL: "bi:people",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.roadmap",
    routeURL: "/about/roadmap",
    iconURL: "bi:people",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.impress",
    routeURL: "/about/impress",
    iconURL: "bi:people",
    selected: false,
    active: true,
  },
];

const LegalIndexButtons: SidebarLeftSelectorType[] = [
  {
    label: "components.sidebar-left-selector.label.legal-support",
    routeURL: "/legal/legal-support",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.privacy-policy",
    routeURL: "/legal/privacy-policy",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.trademark-policy",
    routeURL: "/legal/trademark-policy",
    iconURL: "bi:people",
    selected: false,
    active: true,
  },
];

const HelpIndexButtons: SidebarLeftSelectorType[] = [
  {
    label: "components.sidebar-left-selector.label.faq",
    routeURL: "/help/faq",
    iconURL: "bi:people",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.contact",
    routeURL: "/help/contact",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.press",
    routeURL: "/help/press",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.status",
    routeURL: "/help/status",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
];

const DocsIndexButtons: SidebarLeftSelectorType[] = [
  {
    label: "components.sidebar-left-selector.label.get-active",
    routeURL: "/docs/get-active",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.get-organized",
    routeURL: "/docs/get-organized",
    iconURL: "bi:people",
    selected: false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.grow-organization",
    routeURL: "/docs/grow-organization",
    iconURL: "bi:people",
    selected: false,
    active: true,
  },
];
</script>
