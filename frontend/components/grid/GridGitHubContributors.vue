<template>
  <div>
    <ul class="flex justify-center md:justify-normal flex-wrap gap-4">
      <li
        v-for="item in githubData"
        :key="item.loginID"
      >
        <NuxtLink
          class="flex flex-col w-20 items-center focus-brand"
          :to="item.htmlUrl"
        >
          <img
            class="rounded-full w-16 h-16 ring-2 hover:ring-light-cta-orange hover:ring-2 hover:ring-offset-2 ring-light-section-div dark:ring-dark-section-div dark:hover:ring-light-cta-orange dark:hover:ring-offset-dark-content"
            :src="item.avatarUrl"
            alt=""
          />
          <p class="truncate w-full text-center text-base text-light-text hover:text-light-text dark:text-dark-text dark:hover:text-dark-text">
            {{ item.loginID }}
          </p>
        </NuxtLink>
      </li>
      <li v-if="hasMoreContributors">
        <button
          @click="onClickLoadMoreContributors"
          class="flex flex-col w-20 items-center focus-brand"
          :aria-label="$t('components.grid-github-contributors.load-more')"
        >
          <span
            class="rounded-full w-16 h-16 ring-2 hover:ring-light-cta-orange hover:ring-2 hover:ring-offset-2 ring-light-section-div dark:ring-dark-section-div dark:hover:ring-light-cta-orange dark:hover:ring-offset-dark-content bg-light-section-div dark:bg-dark-section-div flex items-center justify-center"
            alt=""
          >
            <Icon name="bx:dots-horizontal-rounded" size="3em" class="text-light-text dark:text-dark-text" />
          </span>
          <p class="truncate w-full text-center text-base text-light-text hover:text-light-text dark:text-dark-text dark:hover:text-dark-text">
            Load more
          </p>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

interface GithubContributor {
  avatarUrl: string;
  htmlUrl: string;
  loginID: string;
}

const isLoading = ref<boolean>(false);
const githubData = ref<GithubContributor[]>([]);
const currentPage = ref<number>(1);
const hasMoreContributors = ref<boolean>(true);

onMounted(() => {
  fetchDataFromGitHubAPI(currentPage.value);
});

async function fetchDataFromGitHubAPI(page : number, numPerPage: number = 30) {
  isLoading.value = true;
  try {
    const response = await fetch(
      `https://api.github.com/repos/activist-org/activist/contributors?per_page=${numPerPage}&page=${page}`
    );
    const data = await response.json();

    if (data.length < numPerPage) {
      hasMoreContributors.value = false;
    }

    githubData.value = githubData.value.concat(data.map((item : any) => {
      return {
        avatarUrl: item.avatar_url,
        htmlUrl: item.html_url,
        loginID: item.login,
      }
    }));
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

function onClickLoadMoreContributors() {
  currentPage.value ++;
  fetchDataFromGitHubAPI(currentPage.value);
}
</script>