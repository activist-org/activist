<template>
  <!-- note: content sections left and right for desktop (xl) -->
  <div class="flex flex-row justify-start">
    <!-- note: content sections left -->
    <div class="mt-0 justify-items-start w-[80%] flex flex-col">
      <!-- overflow-y-hidden is to prevent the logo from expanding beyond its bound on mobile safari. -->
      <div class="relative z-0 h-10 overflow-y-hidden w-36">
        <logoactivist
          class="absolute inset-0 flex items-center justify-center z-1 overflow-clip"
        />
      </div>
      <p class="mt-3 text-light-text dark:text-dark-text">
        {{ $t("components.footer-flex.activist-tagline") }}
      </p>
      <!-- note: platform links -->
      <div class="flex justify-start mt-2">
        <template v-for="(platform, index) in links.platformLinks">
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <nuxtlink
              v-if="platform.isLocalePath"
              class="focus-brand"
              :to="localePath(platform.url)"
            >
              {{ $t(platform.name) }}
            </nuxtlink>
            <a v-else class="focus-brand" :href="platform.url" target="_blank">
              {{ $t(platform.name) }}
            </a>
          </div>
          <div v-if="index < links.platformLinks.length - 1" class="px-2">
            •
          </div>
        </template>
      </div>
      <!-- note: legal links -->
      <div class="flex mt-5">
        <template v-for="(policy, index) in links.legalLinks">
          <div class="hover:text-light-text dark:hover:text-dark-text">
            <nuxtlink class="focus-brand" :to="localePath(policy.url)">
              {{ $t(policy.name) }}
            </nuxtlink>
          </div>
          <div v-if="index < links.legalLinks.length - 1" class="px-2">•</div>
        </template>
      </div>
      <div class="mt-2 text-light-text dark:text-dark-text">
        {{ $t("components.footer-flex.website-copyright") }}
      </div>
    </div>
    <!-- note: content sections right -->
    <div
      class="flex justify-end w-full lg:space-x-6 xl:space-x-8 2xl:space-x-24"
    >
      <!-- note: connect links -->
      <div>
        <p class="text-xl font-medium text-light-text dark:text-dark-text">
          {{ $t("components.footer-flex.connect") }}
        </p>
        <template v-for="(connect, index) in links.connectLinks">
          <a
            class="flex items-center mt-2 text-base space-x-2 hover:text-light-text dark:hover:text-dark-text focus-brand"
            :class="{ 'mt-3': index === 0 }"
            :href="connect.url"
            target="_blank"
          >
            <icon :name="connect.iconName" :size="connect.iconSize" />
            <p>{{ $t(connect.name) }}</p>
          </a>
        </template>
      </div>
      <!-- note: resources links -->
      <div>
        <p class="text-xl font-medium text-light-text dark:text-dark-text">
          {{ $t("components.footer-flex.resources") }}
        </p>
        <template v-for="(resource, index) in links.resourcesLinks">
          <p
            class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text"
            :class="{ 'mt-3': index === 0 }"
          >
            <nuxtlink class="focus-brand" :to="localePath(resource.url)">
              {{ $t(resource.name) }}
            </nuxtlink>
          </p>
        </template>
      </div>
      <!-- note: organization links -->
      <div>
        <p class="text-xl font-medium text-light-text dark:text-dark-text">
          {{ $t("components.footer-flex.organization") }}
        </p>
        <template v-for="(oLink, index) in links.organizationLinks">
          <p
            class="mt-2 text-base hover:text-light-text dark:hover:text-dark-text"
            :class="{ 'mt-3': index === 0 }"
          >
            <nuxtlink class="focus-brand" :to="localePath(oLink.url)">
              {{ $t(oLink.name) }}
            </nuxtlink>
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
