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
    name: "faq",
    url: "/help/faq",
  },
  {
    name: "help",
    url: "/help",
  },
  {
    name: "documentation",
    url: "/docs",
  },
  {
    name: "contact",
    url: "/help/contact",
  },
];

const organizationLinks = [
  {
    name: "about",
    url: "/about",
  },
  {
    name: "supporters",
    url: "/supporters",
  },
  {
    name: "impress",
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
    name: "source-code",
    isLocalePath: false,
    url: "https://github.com/activist-org/activist",
  },
  {
    name: "roadmap",
    isLocalePath: true,
    url: "/about/roadmap",
  },
];

const legalLinks = [
  {
    name: "components.footer.footer.trademark-policy",
    url: "/legal/trademark-policy",
  },
  {
    name: "privacy-policy",
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
