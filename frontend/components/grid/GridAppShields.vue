<template>
  <div
    class="grid grid-flow-row gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:gap-3 w-fit"
  >
    <ImageAppShield
      class="fill-light-text dark:fill-dark-text"
      href="https://github.com/activist-org/activist"
      :isLoading="isLoading"
    >
      <Icon name="cib:apple" size="2em" />
      <div class="pb-1 ml-4 place-self-center">
        <div class="font-semibold text-xs leading-4 ml-0.5 whitespace-nowrap">
          {{ $t("components.grid-shields.download-on-the") }}
        </div>
        <div class="text-2xl font-semibold leading-4 whitespace-nowrap">
          {{ $t("components.grid-shields.app-store") }}
        </div>
      </div>
    </ImageAppShield>

    <ImageAppShield
      class="fill-light-text dark:fill-dark-text"
      href="https://github.com/activist-org/activist"
      :isLoading="isLoading"
    >
      <Icon name="cib:google-play" size="2em" />
      <div class="pb-1 ml-4 place-self-center">
        <div class="font-semibold text-xs leading-4 ml-0.5 whitespace-nowrap">
          {{ $t("components.grid-shields.get-it-on") }}
        </div>
        <div class="text-2xl font-semibold leading-4 whitespace-nowrap">
          {{ $t("components.grid-shields.google-play") }}
        </div>
      </div>
    </ImageAppShield>

    <ImageAppShield
      class="fill-light-text dark:fill-dark-text"
      href="https://github.com/activist-org/activist"
      :isLoading="isLoading"
    >
      <Icon name="cib:google-play" size="2em" />
      <div class="pb-1 ml-4 place-self-center">
        <div
          class="font-semibold text-xs leading-4 ml-0.5 uppercase whitespace-nowrap"
        >
          {{ $t("components.grid-shields.get-it-on") }}
        </div>
        <div class="text-2xl font-semibold leading-4 whitespace-nowrap">
          {{ $t("components.grid-shields.f-droid") }}
        </div>
      </div>
    </ImageAppShield>

    <ImageAppShield
      class="fill-light-text dark:fill-dark-text"
      href="https://github.com/activist-org/activist"
      :isLoading="isLoading"
    >
      <Icon name="cib:github" size="2em" />
      <div class="pb-1 ml-4 place-self-center">
        <div class="font-semibold text-xs leading-4 ml-0.5 whitespace-nowrap">
          {{ $t("components.grid-shields.visit-us") }}
        </div>
        <div class="text-2xl font-semibold leading-4 whitespace-nowrap">
          {{ $t("components.grid-shields.github") }}
        </div>
      </div>
    </ImageAppShield>

    <ImageAppShield
      class="fill-light-text dark:fill-dark-text"
      href="https://github.com/activist-org/activist/forks"
      :text="$t('components.grid-shields.fork')"
      :isLoading="isLoading"
      :count="GitHubData.forks_count"
    >
      <Icon name="octicon:repo-forked-24" size="2em" />
    </ImageAppShield>

    <ImageAppShield
      class="fill-light-text dark:fill-dark-text"
      href="https://github.com/activist-org/activist/stargazers"
      :text="$t('components.grid-shields.star')"
      :isLoading="isLoading"
      :count="GitHubData.stargazers_count"
    >
      <Icon name="octicon:star-24" size="2em" />
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
