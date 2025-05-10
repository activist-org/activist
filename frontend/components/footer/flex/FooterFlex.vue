<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <!-- Note: Content Sections Left and Right for Desktop (xl) -->
  <div class="flex flex-row justify-start">
    <!-- Note: Content Sections Left -->
    <div class="mt-0 flex w-[80%] flex-col justify-items-start">
      <!-- overflow-y-hidden is to prevent the logo from expanding beyond its bound on mobile Safari. -->
      <div class="focus-inside relative z-0 h-10 w-36 overflow-y-hidden">
        <LogoActivist
          class="z-1 absolute inset-0 flex items-center justify-center overflow-clip"
        />
      </div>
      <p class="mt-3 text-primary-text">
        {{ $t("i18n.components.footer.flex._global.activist_tagline") }}
      </p>
      <!-- Note: Platform Links -->
      <div class="mt-2 flex justify-start">
        <template v-for="(platform, index) in links.platformLinks">
          <div class="hover:text-primary-text">
            <NuxtLink
              v-if="platform.isLocalePath"
              class="focus-brand"
              :to="localePath(platform.url)"
              :aria-label="$t(platform.ariaLabel)"
            >
              {{ $t(platform.name) }}
            </NuxtLink>
            <a
              v-else
              class="focus-brand"
              :href="platform.url"
              target="_blank"
              :aria-label="$t(platform.ariaLabel)"
            >
              {{ $t(platform.name) }}
            </a>
          </div>
          <div v-if="index < links.platformLinks.length - 1" class="px-2">
            •
          </div>
        </template>
      </div>
      <!-- Note: Legal Links -->
      <div class="mt-5 flex">
        <template v-for="(policy, index) in links.legalLinks">
          <div class="hover:text-primary-text">
            <NuxtLink class="focus-brand" :to="localePath(policy.url)" :aria-label="$t(policy.ariaLabel)">
              {{ $t(policy.name) }}
            </NuxtLink>
          </div>
          <div v-if="index < links.legalLinks.length - 1" class="px-2">
            <!-- Preserve line break. -->
            •
          </div>
        </template>
      </div>
      <a
        class="focus-brand mt-2 w-fit hover:text-primary-text"
        href="https://www.netlify.com/"
        target="_blank"
      >
        {{ $t("i18n.components.footer.flex._global.powered_by_netlify") }}
      </a>
      <div class="mt-2 text-primary-text">
        {{
          $t("i18n.components.footer.flex._global.copyright", {
            year: new Date().getFullYear(),
          })
        }}
      </div>
    </div>
    <!-- Note: Content Sections Right -->
    <div
      class="flex w-full justify-end lg:space-x-6 xl:space-x-8 2xl:space-x-24"
    >
      <!-- Note: Connect Links -->
      <div>
        <p class="text-xl font-medium text-primary-text">
          {{ $t("i18n.components._global.connect") }}
        </p>
        <template v-for="(connect, index) in links.connectLinks">
          <a
            class="focus-brand mt-2 flex items-center space-x-2 text-base hover:text-primary-text"
            :class="{ 'mt-3': index === 0 }"
            :href="connect.url"
            target="_blank"
            :aria-label="$t(connect.name)"
          >
            <MetaTagSocialMedia
              class="!gap-2"
              :iconName="connect.iconName"
              :text="$t(connect.name)"
              :iconSize="connect.iconSize"
            />
          </a>
        </template>
      </div>
      <!-- Note: Resources Links -->
      <div>
        <p class="text-xl font-medium text-primary-text">
          {{ $t("i18n._global.resources") }}
        </p>
        <template v-for="(resource, index) in links.resourcesLinks">
          <p
            class="mt-2 text-base hover:text-primary-text"
            :class="{ 'mt-3': index === 0 }"
          >
            <NuxtLink class="focus-brand" :to="localePath(resource.url)" :aria-label="$t(resource.ariaLabel)">
              {{ $t(resource.name) }}
            </NuxtLink>
          </p>
        </template>
      </div>
      <!-- Note: Organization Links -->
      <div>
        <p class="text-xl font-medium text-primary-text">
          {{ $t("i18n._global.organization") }}
        </p>
        <template v-for="(oLink, index) in links.organizationLinks">
          <p
            class="mt-2 text-base hover:text-primary-text"
            :class="{ 'mt-3': index === 0 }"
          >
            <NuxtLink class="focus-brand" :to="localePath(oLink.url)" :aria-label="$t(oLink.ariaLabel)">
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
