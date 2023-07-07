<template>
  <div class="grid grid-flow-row gap-3 md:gap-5 sm:grid-flow-col w-fit">
    <ImageGithubShield
      href="https://github.com/activist-org/activist"
      class="fill-light-text dark:fill-dark-text"
    >
      <Icon name="cib:github" size="2em" />
      <div class="pb-1 ml-4 place-self-center">
        <div class="font-semibold text-xs leading-4 ml-0.5">Visit us on</div>
        <div class="text-2xl font-semibold leading-4">GitHub</div>
      </div>
    </ImageGithubShield>

    <ImageGithubShield
      href="https://github.com/activist-org/activist/forks"
      text="Fork"
      :count="result.forks_count"
      class="fill-light-text dark:fill-dark-text"
    >
      <Icon name="octicon:repo-forked-24" size="2em" />
    </ImageGithubShield>

    <ImageGithubShield
      href="https://github.com/activist-org/activist/stargazers"
      text="Star"
      :count="result.stargazers_count"
      class="fill-light-text dark:fill-dark-text"
    >
      <Icon name="octicon:star-24" size="2em" />
    </ImageGithubShield>
  </div>
</template>

<script lang="ts">
import ImageGithubShield from "../Image/ImageGithubShield.vue";

export default {
  data() {
    return {
      loading: false,
      result: {},
      error: null,
    };
  },
  methods: {
    async getData() {
      this.loading = true;
      try {
        const response = await fetch(
          "https://api.github.com/repos/activist-org/activist"
        );
        const json = await response.json();
        this.result = json;
      } catch (e) {
        this.error = e;
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.getData();
  },
  components: { ImageGithubShield },
};
</script>
