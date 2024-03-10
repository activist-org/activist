<template>
  <!-- Note: Content Sections Top for Mobile -->
  <div class="flex flex-col items-center justify-center space-y-5">
    <div class="flex flex-col items-center justify-center space-y-2">
      <!-- overflow-y-hidden is to prevent the logo from expanding beyond its bound on mobile Safari. -->
      <div class="relative z-0 h-10 overflow-y-hidden w-36 focus-inside">
        <LogoActivist
          class="absolute inset-0 flex items-center justify-center z-1 overflow-clip"
        />
      </div>
      <p class="text-light-text dark:text-dark-text">
        {{ $t("components.footer._global.activist-tagline") }}
      </p>
      <!-- Note: Platform Links -->
      <div class="flex flex-wrap items-center justify-center">
        <template v-for="(platform, index) in links.platformLinks">
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink
              v-if="platform.isLocalePath"
              class="focus-brand"
              :to="localePath(platform.url)"
            >
              {{ $t(platform.name) }}
            </NuxtLink>
            <a v-else :href="platform.url" class="focus-brand" target="_blank">
              {{ $t(platform.name) }}
            </a>
          </div>
          <div v-if="index < links.platformLinks.length - 1" class="px-2">
            •
          </div>
        </template>
      </div>
    </div>
    <div
      class="max-w-xl text-center grid gap-0 sm:text-left justify-items-center sm:grid-cols-3 sm:gap-12 md:gap-16"
    >
      <!-- Note: Connect Links -->
      <div>
        <p class="text-xl font-medium text-light-text dark:text-dark-text">
          {{ $t("components._global.connect") }}
        </p>
        <div class="flex mt-1 gap-10 sm:mt-0 sm:flex-col sm:gap-0">
          <template v-for="(connect, index) in links.connectLinks">
            <a
              class="flex items-center mt-2 text-base space-x-2 hover:text-light-text dark:hover:text-dark-text focus-brand"
              :class="{ 'mt-3': index === 0 }"
              :href="connect.url"
              target="_blank"
            >
              <MetaTagSocialMedia
                class="text-2xl sm:text-base"
                :iconName="connect.iconName"
                :text="$t(connect.name)"
                textStyleClass="sr-only sm:not-sr-only"
              />
            </a>
          </template>
        </div>
      </div>
      <!-- Note: Resources Links -->
      <div>
        <p
          class="mt-6 text-xl font-medium sm:mt-0 text-light-text dark:text-dark-text"
        >
          {{ $t("_global.resources") }}
        </p>
        <div class="flex flex-wrap justify-center sm:flex-col gap-x-1 sm:gap-0">
          <template v-for="(resource, index) in links.resourcesLinks">
            <p
              class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text"
              :class="{ 'sm:mt-3': index === 0 }"
            >
              <NuxtLink class="focus-brand" :to="localePath(resource.url)">
                {{ $t(resource.name) }}
              </NuxtLink>
              <span
                v-if="index < links.resourcesLinks.length - 1"
                class="px-2 flex-inline sm:hidden"
              >
                •
              </span>
            </p>
          </template>
        </div>
      </div>
      <!-- Note: Organization Links -->
      <div>
        <p
          class="mt-6 text-xl font-medium sm:mt-0 text-light-text dark:text-dark-text"
        >
          {{ $t("_global.organization") }}
        </p>
        <div class="flex flex-wrap justify-center sm:flex-col gap-x-1 sm:gap-0">
          <template v-for="(oLink, index) in links.organizationLinks">
            <p
              class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text"
              :class="{ 'sm:mt-3': index === 0 }"
            >
              <NuxtLink class="focus-brand" :to="localePath(oLink.url)">
                {{ $t(oLink.name) }}
              </NuxtLink>
              <span
                v-if="index < links.organizationLinks.length - 1"
                class="px-2 flex-inline sm:hidden"
              >
                •
              </span>
            </p>
          </template>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center justify-center">
      <!-- Note: Legal Links -->
      <div class="flex flex-wrap items-center justify-center">
        <template v-for="(policy, index) in links.legalLinks">
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink class="focus-brand" :to="localePath(policy.url)">
              {{ $t(policy.name) }}
            </NuxtLink>
            <span
              v-if="index < links.legalLinks.length - 1"
              class="px-2 flex-inline"
            >
              •
            </span>
          </div>
        </template>
      </div>
      <a
        class="mt-2 w-fit hover:text-light-text dark:hover:text-dark-text"
        href="https://www.netlify.com/"
        target="_blank"
      >
        {{ $t("components.footer._global.powered-by-netlify") }}
      </a>
      <div class="mt-2 text-light-text dark:text-dark-text">
        {{
          $t("components._global.copyright", { year: new Date().getFullYear() })
        }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();

defineProps<{
  links: {
    platformLinks: {
      name: string;
      url: string;
      isLocalePath: boolean;
    }[];
    legalLinks: {
      name: string;
      url: string;
    }[];
    connectLinks: {
      name: string;
      url: string;
      iconName: string;
      iconSize: string;
    }[];
    resourcesLinks: {
      name: string;
      url: string;
    }[];
    organizationLinks: {
      name: string;
      url: string;
    }[];
  };
}>();
</script>
