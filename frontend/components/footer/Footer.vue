<template>
  <footer
    class="responsive-px-5 responsive-py-5 bg-light-header dark:bg-dark-header text-light-special-text dark:text-dark-special-text"
  >
    <!-- Note: Content Sections Top for Mobile -->
    <FooterFlexCol class="flex flex-col lg:hidden" :links="links" />

    <!-- Note: Content Sections Left and Right for Desktop (xl) -->
    <FooterFlex class="hidden lg:flex" :links="links" />
  </footer>
</template>

<script setup lang="ts">
import { ref } from "vue";

const hasSidebar = ref(false);

const connectLinks = [
  {
    name: "GitHub",
    url: "https://github.com/activist-org/activist",
    iconName: "cib:github",
    iconSize: "1em",
  },
  {
    name: "Matrix",
    url: "https://matrix.to/#/#activist_community:matrix.org",
    iconName: "IconMatrix",
    iconSize: "1.061em",
  },
  {
    name: "Instagram",
    url: "https://instagram.com/activist_org",
    iconName: "cib:instagram",
    iconSize: "1em",
  },
];

const resourcesLinks = [
  {
    name: "components.footer.faq",
    url: "/help/faq",
  },
  {
    name: "components.footer.help",
    url: "/help",
  },
  {
    name: "components.footer.documentation",
    url: "/docs",
  },
  {
    name: "components.footer.contact",
    url: "/help/contact",
  },
];

const organizationLinks = [
  {
    name: "components.footer.about",
    url: "/about",
  },
  {
    name: "components.footer.supporters",
    url: "/supporters",
  },
  {
    name: "components.footer.impress",
    url: "/about/impress",
  },
];

const platformLinks = [
  {
    name: "v0.0.1",
    isLocalePath: false,
    url: "https://github.com/activist-org/activist/releases",
  },
  {
    name: "components.footer.source-code",
    isLocalePath: false,
    url: "https://github.com/activist-org/activist",
  },
  {
    name: "components.footer.roadmap",
    isLocalePath: true,
    url: "/about/roadmap",
  },
];

const legalLinks = [
  {
    name: "components.footer.trademark-policy",
    url: "/legal/trademark-policy",
  },
  {
    name: "components.footer.privacy-policy",
    url: "/legal/privacy-policy",
  },
];

const links = {
  connectLinks,
  resourcesLinks,
  organizationLinks,
  platformLinks,
  legalLinks,
};
</script>
