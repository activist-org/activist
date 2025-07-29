<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="grid w-fit grid-flow-row gap-3 sm:grid-flow-col md:gap-5">
    <ShieldGitHub
      class="fill-primary-text"
      href="https://github.com/activist-org/activist"
      :isLoading="isLoading"
    >
      <Icon :name="IconMap.GITHUB" size="2em" />
      <div class="ml-4 place-self-center pb-1">
        <div class="ml-0.5 text-xs font-semibold leading-4">
          {{ $t("i18n.components.grid_git_hub_shields.visit_us") }}
        </div>
        <div class="text-2xl font-semibold leading-4">
          {{ $t("i18n.components._global.github") }}
        </div>
      </div>
    </ShieldGitHub>
    <ShieldGitHub
      class="fill-primary-text"
      href="https://github.com/activist-org/activist/stargazers"
      :text="$t('i18n.components._global.star')"
      :isLoading="isLoading"
      :count="GitHubData.stargazers_count"
    >
      <Icon :name="IconMap.STAR" size="2em" />
    </ShieldGitHub>
    <ShieldGitHub
      class="fill-primary-text"
      href="https://github.com/activist-org/activist/forks"
      :text="$t('i18n.components.grid_git_hub_shields.fork')"
      :isLoading="isLoading"
      :count="GitHubData.forks_count"
    >
      <Icon :name="IconMap.FORK" size="2em" />
    </ShieldGitHub>
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

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
