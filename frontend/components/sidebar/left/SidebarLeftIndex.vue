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
    iconURL: "octicon:comment-discussion-24",
    selected: false,
    active: false,
  },
];

const eventButtons: SidebarLeftSelectorType[] = [
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
    iconURL: "octicon:comment-discussion-24",
    selected: false,
    active: false,
  },
];

const AboutIndexButtons: SidebarLeftSelectorType[] = [
  {
    btnText: "sidebar.about-index.about-activist",
    btnURL: "/about",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    btnText: "sidebar.about-index.activism-network",
    btnURL: "/about/activism-network",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    btnText: "sidebar.about-index.connect",
    btnURL: "/about/connect",
    iconURL: "bi:people",
    selected: false,
    active: true,
  },
  {
    btnText: "sidebar.about-index.roadmap",
    btnURL: "/about/roadmap",
    iconURL: "bi:people",
    selected: false,
    active: true,
  },
  {
    btnText: "sidebar.about-index.impress",
    btnURL: "/about/impress",
    iconURL: "bi:people",
    selected: false,
    active: true,
  },
];

const LegalIndexButtons: SidebarLeftSelectorType[] = [
  {
    btnText: "sidebar.legal-index.legal-support",
    btnURL: "/legal/legal-support",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    btnText: "sidebar.legal-index.privacy-policy",
    btnURL: "/legal/privacy-policy",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    btnText: "sidebar.legal-index.trademark-policy",
    btnURL: "/legal/trademark-policy",
    iconURL: "bi:people",
    selected: false,
    active: true,
  },
];

const HelpIndexButtons: SidebarLeftSelectorType[] = [
  {
    btnText: "sidebar.help-index.faq",
    btnURL: "/help/faq",
    iconURL: "bi:people",
    selected: false,
    active: true,
  },
  {
    btnText: "sidebar.help-index.contact",
    btnURL: "/help/contact",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    btnText: "sidebar.help-index.press",
    btnURL: "/help/press",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    btnText: "sidebar.help-index.status",
    btnURL: "/help/status",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
];

const DocsIndexButtons: SidebarLeftSelectorType[] = [
  {
    btnText: "sidebar.docs-index.get-active",
    btnURL: "/docs/get-active",
    iconURL: "bi:card-text",
    selected: false,
    active: true,
  },
  {
    btnText: "sidebar.docs-index.get-organized",
    btnURL: "/docs/get-organized",
    iconURL: "bi:people",
    selected: false,
    active: true,
  },
  {
    btnText: "sidebar.docs-index.grow-organization",
    btnURL: "/docs/grow-organization",
    iconURL: "bi:people",
    selected: false,
    active: true,
  },
];
</script>
