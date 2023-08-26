<template>
  <div class="grid grid-flow-row gap-3 md:gap-5 sm:grid-flow-col w-fit">
    <ImageGithubShield
      href="https://github.com/activist-org/activist"
      class="fill-light-text dark:fill-dark-text"
      :isLoading="isLoading"
    >
      <Icon name="cib:github" size="2em" />
      <div class="pb-1 ml-4 place-self-center">
        <div class="font-semibold text-xs leading-4 ml-0.5">{{ $t("components.grid.grid-github-shields.visit") }}</div>
        <div class="text-2xl font-semibold leading-4">GitHub</div>
      </div>
    </ImageGithubShield>

    <ImageGithubShield
      href="https://github.com/activist-org/activist/forks"
      text="Fork"
      :isLoading="isLoading"
      :count="GitHubData.forks_count"
      class="fill-light-text dark:fill-dark-text"
    >
      <Icon name="octicon:repo-forked-24" size="2em" />
    </ImageGithubShield>

    <ImageGithubShield
      href="https://github.com/activist-org/activist/stargazers"
      text="Star"
      :isLoading="isLoading"
      :count="GitHubData.stargazers_count"
      class="fill-light-text dark:fill-dark-text"
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
