<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
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
    name: "i18n.components._global.github",
    url: "https://github.com/activist-org/activist",
    iconName: `${IconMap.GITHUB}`,
    iconSize: "1.05em",
  },
  {
    name: "i18n.components._global.matrix",
    url: "https://matrix.to/#/#activist_community:matrix.org",
    iconName: `${IconMap.MATRIX}`,
    iconSize: "1.061em",
  },
  {
    name: "i18n.components._global.instagram",
    url: "https://instagram.com/activist_org",
    iconName: `${IconMap.INSTAGRAM}`,
    iconSize: "1em",
  },
];

const resourcesLinks = [
  {
    name: "i18n.components._global.documentation",
    url: "https://docs.activist.org/activist",
    ariaLabel: "i18n.components.footer_website.documentation_aria_label"
  },
  // {
  //   name: "i18n._global.contact,
  //   url: "/contact",
  // },
];

const organizationLinks = [
  {
    name: "i18n._global.about",
    url: "https://docs.activist.org/activist/organization/community",
    ariaLabel: "i18n.components.footer_website.about_aria_label"
  },
  {
    name: "i18n.components.footer_website.supporters",
    url: "https://docs.activist.org/activist/organization/community/supporters",
    ariaLabel: "i18n.components.footer_website.supporters_aria_label"
  },
  {
    name: "i18n.components.footer_website.imprint",
    url: "https://docs.activist.org/activist/organization/legal/imprint",
    ariaLabel: "i18n.components.footer_website.imprint_aria_label"
  },
];

const platformLinks = [
  {
    name: "i18n.components.footer_website.version_number",
    isLocalePath: false,
    url: "https://github.com/activist-org/activist/releases",
  },
  {
    name: "i18n.components.footer_website.source_code",
    isLocalePath: false,
    url: "https://github.com/activist-org/activist",
  },
  {
    name: "i18n.components._global.roadmap",
    isLocalePath: true,
    url: "https://docs.activist.org/activist/product/about/roadmap",
    ariaLabel: "i18n.components.footer.website.road_map_aria_label"
  },
];

const legalLinks = [
  {
    name: "i18n.components.footer_website.trademark_policy",
    url: "https://docs.activist.org/activist/organization/legal/trademark",
    ariaLabel: "i18n.components.footer_website.trademark_policy_aria_label"
  },
  {
    name: "i18n.components.footer_website.privacy_policy",
    url: "https://docs.activist.org/activist/product/data-and-security/privacy-policy",
    ariaLabel: "i18n.components.footer_website.privacy_policy_aria_label"
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
