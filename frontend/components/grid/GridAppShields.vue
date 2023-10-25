<template>
  <div class="grid grid-flow-row gap-3 md:gap-5 sm:grid-flow-col w-fit">
    <ImageAppShield
      class="fill-light-text dark:fill-dark-text"
      href="https://github.com/activist-org/activist"
      :isLoading="isLoading"
    >
      <Icon name="simple-icons:apple" size="2em" />
      <div class="pb-1 ml-4 place-self-center">
        <div class="font-semibold text-xs leading-4 ml-0.5 whitespace-nowrap">
          {{ $t("components.grid-app-shields.download-on-the") }}
        </div>
        <div class="text-2xl font-semibold leading-4 whitespace-nowrap">
          {{ $t("components.grid-app-shields.app-store") }}
        </div>
      </div>
    </ImageAppShield>

    <ImageAppShield
      class="fill-light-text dark:fill-dark-text"
      href="https://github.com/activist-org/activist"
      :isLoading="isLoading"
    >
      <Icon name="simple-icons:googleplay" size="2em" />
      <div class="pb-1 ml-4 place-self-center">
        <div
          class="font-semibold text-xs leading-4 ml-0.5 uppercase whitespace-nowrap"
        >
          {{ $t("components.grid-app-shields.get-it-on") }}
        </div>
        <div class="text-2xl font-semibold leading-4 whitespace-nowrap">
          {{ $t("components.grid-app-shields.google-play") }}
        </div>
      </div>
    </ImageAppShield>

    <ImageAppShield
      class="fill-light-text dark:fill-dark-text"
      href="https://github.com/activist-org/activist"
      :isLoading="isLoading"
    >
      <Icon name="simple-icons:fdroid" size="2em" />
      <div class="pb-1 ml-4 place-self-center">
        <div
          class="font-semibold text-xs leading-4 ml-0.5 uppercase whitespace-nowrap"
        >
          {{ $t("components.grid-app-shields.get-it-on") }}
        </div>
        <div class="text-2xl font-semibold leading-4 whitespace-nowrap">
          {{ $t("components.grid-app-shields.f-droid") }}
        </div>
      </div>
    </ImageAppShield>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";

const isLoading = ref(false);
const GitHubData = reactive({
  forks_count: 0,
  stargazers_count: 0,
});

onMounted(() => {
  fetchDataFromGitHubAPI();
});

async function fetchDataFromGitHubAPI() {
  isLoading.value = true;
  try {
    const response = await fetch(
      "https://api.github.com/repos/activist-org/activist"
    );
    const data = await response.json();
    GitHubData.forks_count = data.forks_count;
    GitHubData.stargazers_count = data.stargazers_count;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
