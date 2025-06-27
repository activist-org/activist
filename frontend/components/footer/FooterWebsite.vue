<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <footer class="responsive-px-5 responsive-py-5 bg-layer-2 text-distinct-text">
    <!-- Note: Content Sections Top for Mobile -->
    <FooterFlexCol v-if="isMobileDevice" class="flex flex-col" :links="links" />
    <!-- Note: Content Sections Left and Right for Desktop (xl) -->
    <FooterFlex v-else class="flex" :links="links" />
  </footer>
</template>

<script setup lang="ts">
import { BreakpointMap } from "~/types/breakpoint-map";
import { IconMap } from "~/types/icon-map";

const currentWidth = ref(window.innerWidth);
const isMobileDevice = ref(false);
let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

const updateWidth = () => {
  currentWidth.value = window.innerWidth;
  if (currentWidth.value < BreakpointMap.LARGE) {
    isMobileDevice.value = true;
  } else {
    isMobileDevice.value = false;
  }
};

const handleResize = () => {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  resizeTimeout = setTimeout(updateWidth, 10);
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  updateWidth();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

const connectLinks = [
  {
    name: "i18n._global.github",
    url: "https://github.com/activist-org/activist",
    iconName: `${IconMap.GITHUB}`,
    iconSize: "1.05em",
    ariaLabel: "i18n._global.github_aria_label",
  },
  {
    name: "i18n._global.matrix",
    url: "https://matrix.to/#/#activist_community:matrix.org",
    iconName: `${IconMap.MATRIX}`,
    iconSize: "1.061em",
    ariaLabel: "i18n._global.matrix_aria_label",
  },
  {
    name: "i18n._global.instagram",
    url: "https://instagram.com/activist_org",
    iconName: `${IconMap.INSTAGRAM}`,
    iconSize: "1em",
    ariaLabel: "i18n._global.instagram_aria_label",
  },
];

const resourcesLinks = [
  {
    name: "i18n.components._global.documentation",
    url: "https://docs.activist.org/activist",
    ariaLabel: "i18n._global.documentation_aria_label",
  },
  // {
  //   name: "i18n._global.contact,
  //   url: "/contact",
  //   ariaLabel: "",
  // },
];

const organizationLinks = [
  {
    name: "i18n._global.about",
    url: "https://docs.activist.org/activist/organization/community",
    ariaLabel: "i18n._global.about_aria_label",
  },
  {
    name: "i18n.components.footer_website.supporters",
    url: "https://docs.activist.org/activist/organization/community/supporters",
    ariaLabel: "i18n._global.supporters_aria_label",
  },
  {
    name: "i18n._global.imprint",
    url: "https://docs.activist.org/activist/organization/legal/imprint",
    ariaLabel: "i18n._global.imprint_aria_label",
  },
];

const platformLinks = [
  {
    name: "i18n.components.footer_website.version_number",
    isLocalePath: false,
    url: "https://github.com/activist-org/activist/releases",
    ariaLabel: "i18n.components.footer_website.version_number_aria_label",
  },
  {
    name: "i18n.components.footer_website.source_code",
    isLocalePath: false,
    url: "https://github.com/activist-org/activist",
    ariaLabel: "i18n.components.footer_website.source_code_aria_label",
  },
  {
    name: "i18n.components._global.roadmap",
    isLocalePath: true,
    url: "https://docs.activist.org/activist/product/about/roadmap",
    ariaLabel: "i18n._global.road_map_aria_label",
  },
];

const legalLinks = [
  {
    name: "i18n._global.trademark_policy",
    url: "https://docs.activist.org/activist/organization/legal/trademark",
    ariaLabel: "i18n._global.trademark_policy_aria_label",
  },
  {
    name: "i18n._global.privacy_policy",
    url: "https://docs.activist.org/activist/product/data-and-security/privacy-policy",
    ariaLabel: "i18n._global.privacy_policy_aria_label",
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
