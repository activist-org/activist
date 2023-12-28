<template>
  <!-- Note: Content Sections Left and Right for Desktop (xl) -->
  <div class="flex flex-row justify-start">
    <!-- Note: Content Sections Left -->
    <div class="mt-0 justify-items-start w-[80%] flex flex-col">
      <!-- overflow-y-hidden is to prevent the logo from expanding beyond its bound on mobile Safari. -->
      <div class="relative z-0 h-10 overflow-y-hidden w-36 focus-inside">
        <LogoActivist
          class="absolute inset-0 flex items-center justify-center z-1 overflow-clip"
        />
      </div>
      <p class="mt-3 text-light-text dark:text-dark-text">
        {{ $t("components.footer._global.activist-tagline") }}
      </p>
      <!-- Note: Platform Links -->
      <div class="flex justify-start mt-2">
        <template v-for="(platform, index) in links.platformLinks">
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink
              v-if="platform.isLocalePath"
              class="focus-brand"
              :to="localePath(platform.url)"
            >
              {{ $t(platform.name) }}
            </NuxtLink>
            <a v-else class="focus-brand" :href="platform.url" target="_blank">
              {{ $t(platform.name) }}
            </a>
          </div>
          <div v-if="index < links.platformLinks.length - 1" class="px-2">
            •
          </div>
        </template>
      </div>
      <!-- Note: Legal Links -->
      <div class="flex mt-5">
        <template v-for="(policy, index) in links.legalLinks">
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink class="focus-brand" :to="localePath(policy.url)">
              {{ $t(policy.name) }}
            </NuxtLink>
          </div>
          <div v-if="index < links.legalLinks.length - 1" class="px-2">•</div>
        </template>
      </div>
      <a
        class="mt-2 w-fit hover:text-light-text dark:hover:text-dark-text focus-brand"
        href="https://www.netlify.com/"
        target="_blank"
      >
        {{ $t("components.footer._global.powered-by-netlify") }}
      </a>
      <div class="mt-2 text-light-text dark:text-dark-text">
        {{ $t("components._global.copyright") }}
      </div>
    </div>
    <!-- Note: Content Sections Right -->
    <div
      class="flex justify-end w-full lg:space-x-6 xl:space-x-8 2xl:space-x-24"
    >
      <!-- Note: Connect Links -->
      <div>
        <p class="text-xl font-medium text-light-text dark:text-dark-text">
          {{ $t("components._global.connect") }}
        </p>
        <template v-for="(connect, index) in links.connectLinks">
          <a
            class="flex items-center mt-2 text-base space-x-2 hover:text-light-text dark:hover:text-dark-text focus-brand"
            :class="{ 'mt-3': index === 0 }"
            :href="connect.url"
            target="_blank"
          >
            <Icon :name="connect.iconName" :size="connect.iconSize" />
            <p>{{ $t(connect.name) }}</p>
          </a>
        </template>
      </div>
      <!-- Note: Resources Links -->
      <div>
        <p class="text-xl font-medium text-light-text dark:text-dark-text">
          {{ $t("_global.resources") }}
        </p>
        <template v-for="(resource, index) in links.resourcesLinks">
          <p
            class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text"
            :class="{ 'mt-3': index === 0 }"
          >
            <NuxtLink class="focus-brand" :to="localePath(resource.url)">
              {{ $t(resource.name) }}
            </NuxtLink>
          </p>
        </template>
      </div>
      <!-- Note: Organization Links -->
      <div>
        <p class="text-xl font-medium text-light-text dark:text-dark-text">
          {{ $t("_global.organization") }}
        </p>
        <template v-for="(oLink, index) in links.organizationLinks">
          <p
            class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text"
            :class="{ 'mt-3': index === 0 }"
          >
            <NuxtLink class="focus-brand" :to="localePath(oLink.url)">
              {{ $t(oLink.name) }}
            </NuxtLink>
          </p>
        </template>
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
