<template>
  <footer class="responsive-px-5 responsive-py-5 bg-layer-2 text-distinct-text">
    <!-- Note: Content Sections Top for Mobile -->
    <FooterFlexCol class="flex flex-col lg:hidden" :links="links" />
    <!-- Note: Content Sections Left and Right for Desktop (xl) -->
    <FooterFlex class="hidden lg:flex" :links="links" />
  </footer>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

const connectLinks = [
  {
    name: "components._global.github",
    url: "https://github.com/activist-org/activist",
    iconName: `${IconMap.GITHUB}`,
    iconSize: "1.05em",
  },
  {
    name: "components._global.matrix",
    url: "https://matrix.to/#/#activist_community:matrix.org",
    iconName: `${IconMap.MATRIX}`,
    iconSize: "1.061em",
  },
  {
    name: "components._global.instagram",
    url: "https://instagram.com/activist_org",
    iconName: `${IconMap.INSTAGRAM}`,
    iconSize: "1em",
  },
];

const resourcesLinks = [
  {
    name: "components._global.documentation",
    url: "https://docs.activist.org/activist",
  },
  // {
  //   name: "_global.contact",
  //   url: "/contact",
  // },
];

const organizationLinks = [
  {
    name: "_global.about",
    url: "https://docs.activist.org/activist/organization/community",
  },
  {
    name: "components.footer_website.supporters",
    url: "https://docs.activist.org/activist/organization/community/supporters",
  },
  {
    name: "components.footer_website.imprint",
    url: "https://docs.activist.org/activist/organization/legal/imprint",
  },
];

const platformLinks = [
  {
    name: "components.footer_website.version_number",
    isLocalePath: false,
    url: "https://github.com/activist-org/activist/releases",
  },
  {
    name: "components.footer_website.source_code",
    isLocalePath: false,
    url: "https://github.com/activist-org/activist",
  },
  {
    name: "components._global.roadmap",
    isLocalePath: true,
    url: "https://docs.activist.org/activist/product/about/roadmap",
  },
];

const legalLinks = [
  {
    name: "components.footer_website.trademark_policy",
    url: "https://docs.activist.org/activist/organization/legal/trademark",
  },
  {
    name: "components.footer_website.privacy_policy",
    url: "https://docs.activist.org/activist/product/data-and-security/privacy-policy",
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
