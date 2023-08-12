<template>
  <!-- Note: Content Sections Left and Right for Desktop (lg) -->
  <div class="flex flex-col justify-center lg:flex-row lg:justify-start">
    <!-- Note: Content Sections Left -->
    <div class="mt-0 justify-items-start w-[80%] hidden lg:flex lg:flex-col">
      <div class="relative z-0 h-10 w-36">
        <LogoActivist
          class="absolute inset-0 flex items-center justify-center z-1 overflow-clip"
        />
      </div>

      <p class="mt-3 text-light-text dark:text-dark-text lg:block">
        {{ $t("activist-tagline") }}
      </p>

      <!-- Note: Platform Links -->
      <div class="flex justify-start mt-2">
        <template v-for="(platform, index) in links.platformLinks">
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <NuxtLink
              v-if="platform.isLocalePath"
              :to="platform.url"
              class="focus-brand"
            >
              {{ $t(platform.name) }}
            </NuxtLink>
            <a v-else :href="platform.url" target="_blank" class="focus-brand">
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
            <NuxtLink :to="policy.url" class="focus-brand">
              {{ $t(policy.name) }}
            </NuxtLink>
          </div>
          <div v-if="index < links.legalLinks.length - 1" class="px-2">•</div>
        </template>
      </div>
      <div class="mt-2 text-light-text dark:text-dark-text">
        {{ $t("website-copyright") }}
      </div>
    </div>

    <!-- Note: Content Sections Right -->
    <div
      class="justify-end hidden w-full lg:flex lg:space-x-6 xl:space-x-10 2xl:space-x-24"
    >
      <!-- Note: Connect Links -->
      <div>
        <p class="text-xl font-medium text-light-text dark:text-dark-text">
          {{ $t("connect") }}
        </p>
        <template v-for="(connect, index) in links.connectLinks">
          <a
            :href="connect.url"
            target="_blank"
            class="flex items-center mt-2 text-base space-x-2 hover:text-light-text dark:hover:text-dark-text focus-brand"
            :class="{ 'mt-3': index === 0 }"
          >
            <Icon :name="connect.iconName" :size="connect.iconSize" />
            <p>{{ connect.name }}</p>
          </a>
        </template>
      </div>

      <!-- Note: Resources Links -->
      <div>
        <p class="text-xl font-medium text-light-text dark:text-dark-text">
          {{ $t("resources") }}
        </p>
        <template v-for="(resource, index) in links.resourcesLinks">
          <p
            class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text"
            :class="{ 'mt-3': index === 0 }"
          >
            <NuxtLink :to="localePath(resource.url)" class="focus-brand">
              {{ $t(resource.name) }}
            </NuxtLink>
          </p>
        </template>
      </div>

      <!-- Note: Organization Links -->
      <div>
        <p class="text-xl font-medium text-light-text dark:text-dark-text">
          {{ $t("organization") }}
        </p>
        <template v-for="(organization, index) in links.organizationLinks">
          <p
            class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text"
            :class="{ 'mt-3': index === 0 }"
          >
            <NuxtLink :to="localePath(organization.url)" class="focus-brand">
              {{ $t(organization.name) }}
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
