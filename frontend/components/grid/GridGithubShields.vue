<template>
  <div class="grid grid-flow-row gap-3 md:gap-5 sm:grid-flow-col w-fit">
    <ImageGithubShield
      class="fill-light-text dark:fill-dark-text"
      href="https://github.com/activist-org/activist"
      :isLoading="isLoading"
    >
      <Icon name="cib:github" size="2em" />
      <div class="pb-1 ml-4 place-self-center">
        <div class="font-semibold text-xs leading-4 ml-0.5">
          {{ $t("components.grid-github-shields.visit-us") }}
        </div>
        <div class="text-2xl font-semibold leading-4">
          {{ $t("components.grid-github-shields.github") }}
        </div>
      </div>
    </ImageGithubShield>

    <ImageGithubShield
      class="fill-light-text dark:fill-dark-text"
      href="https://github.com/activist-org/activist/forks"
      :text="$t('components.grid-github-shields.fork')"
      :isLoading="isLoading"
      :count="GitHubData.forks_count"
    >
      <Icon name="octicon:repo-forked-24" size="2em" />
    </ImageGithubShield>

    <ImageGithubShield
      class="fill-light-text dark:fill-dark-text"
      href="https://github.com/activist-org/activist/stargazers"
      :text="$t('components.grid-github-shields.star')"
      :isLoading="isLoading"
      :count="GitHubData.stargazers_count"
    >
      <Icon name="octicon:star-24" size="2em" />
    </ImageGithubShield>
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
