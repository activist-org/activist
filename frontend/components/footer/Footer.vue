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
const connectLinks = [
  {
    name: "components._global.github",
    url: "https://github.com/activist-org/activist",
    iconName: "cib:github",
    iconSize: "1em",
  },
  {
    name: "components._global.matrix",
    url: "https://matrix.to/#/#activist_community:matrix.org",
    iconName: "IconMatrix",
    iconSize: "1.061em",
  },
  {
    name: "components._global.instagram",
    url: "https://instagram.com/activist_org",
    iconName: "cib:instagram",
    iconSize: "1em",
  },
];

const resourcesLinks = [
  {
    name: "_global.help",
    url: "/help",
  },
  {
    name: "_global.documentation",
    url: "/docs",
  },
  {
    name: "_global.legal",
    url: "/legal",
  },
  {
    name: "_global.contact",
    url: "/help/contact",
  },
];

const organizationLinks = [
  {
    name: "_global.about",
    url: "/about",
  },
  {
    name: "_global.supporters",
    url: "/supporters",
  },
  {
    name: "_global.imprint",
    url: "/about/impress",
  },
];

const platformLinks = [
  {
    name: "components.footer.version-number",
    isLocalePath: false,
    url: "https://github.com/activist-org/activist/releases",
  },
  {
    name: "components.footer.source-code",
    isLocalePath: false,
    url: "https://github.com/activist-org/activist",
  },
  {
    name: "_global.roadmap",
    isLocalePath: true,
    url: "/about/roadmap",
  },
];

const legalLinks = [
  {
    name: "_global.trademark-policy",
    url: "/legal/trademark-policy",
  },
  {
    name: "_global.privacy-policy",
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
