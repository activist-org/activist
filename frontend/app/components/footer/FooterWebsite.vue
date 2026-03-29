<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <footer
    class="responsive-px-5 responsive-py-5 grid grid-cols-1 items-center justify-center space-y-5 bg-layer-2 text-distinct-text lg:grid-cols-2 lg:justify-start lg:space-y-2"
  >
    <div
      class="col-span-1 flex flex-col items-center justify-center space-y-2 lg:mt-0 lg:w-[80%] lg:items-start lg:space-y-0"
    >
      <!-- overflow-y-hidden is to prevent the logo from expanding beyond its bound on mobile Safari. -->
      <div class="relative z-0 h-10 w-36 overflow-y-hidden focus-inside">
        <LogoActivist
          class="z-1 absolute inset-0 flex items-center justify-center overflow-clip"
        />
      </div>
      <p class="lg:mt-3">
        {{ $t("i18n.components.footer_website.activist_tagline") }}
      </p>
      <!-- Note: Platform Links -->
      <div
        class="flex flex-wrap items-center justify-center lg:mt-2 lg:flex-none lg:justify-start"
      >
        <template v-for="(platform, index) in links.platformLinks" :key="index">
          <div class="flex">
            <NuxtLink
              v-if="platform.isLocalePath"
              :aria-label="$t(platform.ariaLabel)"
              class="text-primary-text focus-brand hover:text-distinct-text"
              :to="localePath(platform.url)"
            >
              {{ $t(platform.name) }}
            </NuxtLink>
            <a
              v-else
              :aria-label="$t(platform.ariaLabel)"
              class="text-primary-text focus-brand hover:text-distinct-text"
              :href="platform.url"
              target="_blank"
            >
              {{ $t(platform.name) }}
            </a>
            <div v-if="index < links.platformLinks.length - 1" class="px-2">
              •
            </div>
          </div>
        </template>
      </div>
    </div>
    <div
      class="col-span-1 flex flex-col items-center justify-center text-center sm:flex-row sm:items-start sm:gap-12 sm:text-start md:gap-16 lg:justify-end lg:gap-0 lg:space-x-6 xl:space-x-8 2xl:space-x-24"
    >
      <!-- Note: Connect Links -->
      <div>
        <p class="text-xl font-medium">
          {{ $t("i18n.components._global.connect") }}
        </p>
        <div class="mt-1 flex gap-10 sm:mt-0 sm:flex-col sm:gap-0">
          <template v-for="(connect, index) in links.connectLinks">
            <a
              :aria-label="$t(connect.name)"
              class="mt-2 flex items-center space-x-2 text-base text-primary-text focus-brand hover:text-distinct-text"
              :class="{ 'mt-3': index === 0 }"
              :href="connect.url"
              target="_blank"
            >
              <MetaTagSocialMedia
                class="text-2xl sm:text-base"
                :iconName="connect.iconName"
                :text="$t(connect.name)"
                textUtilityClasses="sr-only sm:not-sr-only"
              />
            </a>
          </template>
        </div>
      </div>
      <!-- Note: Resources Links -->
      <div>
        <p class="mt-6 text-xl font-medium sm:mt-0">
          {{ $t("i18n._global.resources") }}
        </p>
        <div class="flex flex-wrap justify-center gap-x-1 sm:flex-col sm:gap-0">
          <template v-for="(resource, index) in links.resourcesLinks">
            <p
              class="mt-2 text-base text-primary-text hover:text-distinct-text"
              :class="{ 'sm:mt-3': index === 0 }"
            >
              <NuxtLink
                :aria-label="$t(resource.ariaLabel)"
                class="focus-brand"
                :to="localePath(resource.url)"
              >
                {{ $t(resource.name) }}
              </NuxtLink>
              <span
                v-if="index < links.resourcesLinks.length - 1"
                class="flex-inline px-2 sm:hidden"
              >
                •
              </span>
            </p>
          </template>
        </div>
      </div>
      <!-- Note: Organization Links -->
      <div>
        <p class="mt-6 text-xl font-medium sm:mt-0">
          {{ $t("i18n._global.organization") }}
        </p>
        <div class="flex flex-wrap justify-center gap-x-1 sm:flex-col sm:gap-0">
          <template v-for="(oLink, index) in links.organizationLinks">
            <p
              class="mt-2 text-base text-primary-text hover:text-distinct-text"
              :class="{ 'sm:mt-3': index === 0 }"
            >
              <NuxtLink
                :aria-label="$t(oLink.ariaLabel)"
                class="focus-brand"
                :to="localePath(oLink.url)"
              >
                {{ $t(oLink.name) }}
              </NuxtLink>
              <span
                v-if="index < links.organizationLinks.length - 1"
                class="flex-inline px-2 text-distinct-text sm:hidden"
              >
                •
              </span>
            </p>
          </template>
        </div>
      </div>
    </div>
    <div
      class="col-span-1 flex flex-col items-center justify-center lg:items-start"
    >
      <!-- Note: Legal Links -->
      <div class="flex flex-wrap items-center justify-center">
        <template v-for="(policy, index) in links.legalLinks" :key="index">
          <div class="flex">
            <NuxtLink
              :aria-label="$t(policy.ariaLabel)"
              class="text-primary-text focus-brand hover:text-distinct-text"
              :to="localePath(policy.url)"
            >
              {{ $t(policy.name) }}
            </NuxtLink>
            <span
              v-if="index < links.legalLinks.length - 1"
              class="flex-inline px-2"
            >
              •
            </span>
          </div>
        </template>
      </div>
      <a
        class="mt-2 w-fit text-primary-text hover:text-distinct-text"
        href="https://www.netlify.com/"
        target="_blank"
      >
        {{ $t("i18n.components.footer_website.powered_by_netlify") }}
      </a>
      <p class="mt-2">
        {{
          $t("i18n.components.footer_website.copyright", {
            year: new Date().getFullYear(),
          })
        }}
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentWidth = ref(window.innerWidth);
const isMobileDevice = ref(false);
let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
const localePath = useLocalePath();

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
    name: "i18n.components._global.github",
    url: "https://github.com/activist-org/activist",
    iconName: `${IconMap.GITHUB}`,
    iconSize: "1.05em",
    ariaLabel: "i18n.components._global.github_aria_label",
  },
  {
    name: "i18n.components._global.matrix",
    url: "https://matrix.to/#/#activist_community:matrix.org",
    iconName: `${IconMap.MATRIX}`,
    iconSize: "1.061em",
    ariaLabel: "i18n.components._global.matrix_aria_label",
  },
  {
    name: "i18n.components._global.instagram",
    url: "https://instagram.com/activist_org",
    iconName: `${IconMap.INSTAGRAM}`,
    iconSize: "1em",
    ariaLabel: "i18n.components._global.instagram_aria_label",
  },
];

const resourcesLinks = [
  {
    name: "i18n.components._global.documentation",
    url: "https://docs.activist.org/activist",
    ariaLabel: "i18n.components.footer_website.documentation_aria_label",
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
    ariaLabel: "i18n.components.footer_website.about_aria_label",
  },
  {
    name: "i18n.components.footer_website.supporters",
    url: "https://docs.activist.org/activist/organization/community/supporters",
    ariaLabel: "i18n.components.footer_website.supporters_aria_label",
  },
  {
    name: "i18n.components.footer_website.imprint",
    url: "https://docs.activist.org/activist/organization/legal/imprint",
    ariaLabel: "i18n.components.footer_website.imprint_aria_label",
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
    ariaLabel: "i18n.components.footer_website.road_map_aria_label",
  },
];

const legalLinks = [
  {
    name: "i18n.components.footer_website.trademark_policy",
    url: "https://docs.activist.org/activist/organization/legal/trademark",
    ariaLabel: "i18n.components.footer_website.trademark_policy_aria_label",
  },
  {
    name: "i18n.components.footer_website.privacy_policy",
    url: "https://docs.activist.org/activist/product/data-and-security/privacy-policy",
    ariaLabel: "i18n.components.footer_website.privacy_policy_aria_label",
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
