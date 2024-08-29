<template>
  <div
    class="bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("pages._global.our_supporters") }}</Title>
    </Head>
    <div class="responsive-py-4 responsive-px-5 flex flex-col space-y-4">
      <PageBreadcrumbs />
      <h1 class="responsive-h1 font-bold">
        {{ $t("pages._global.our_supporters") }}
      </h1>
      <p class="pt-2 lg:pt-4 xl:pt-6">
        {{ $t("pages.supporters.showcase.section_1_paragraph_1_1") }}
        <NuxtLink
          class="focus-brand link-text"
          :to="localePath('/supporters/join')"
        >
          {{
            $t("pages.supporters.showcase.section_1_paragraph_1_2")
          }} </NuxtLink
        >.
      </p>
      <h2 class="responsive-py-1 responsive-h3 font-bold">
        {{ $t("pages.supporters.showcase.section_2_subheader") }}
      </h2>
      <h3 class="responsive-h4 font-bold">
        {{ $t("pages.supporters.showcase.section_2_1_subheader") }}
      </h3>
      <p class="space-x-1">
        {{ $t("pages.supporters.showcase.section_2_1_paragraph_1_1") }}
        <a
          class="focus-brand link-text"
          href="https://github.com/activist-org/activist/graphs/contributors"
          target="_blank"
        >
          {{ $t("pages.supporters.showcase.section_2_1_paragraph_1_2") }}
          <Icon
            :name="IconMap.EXTERNAL_LINK"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        <Icon
          :name="IconMap.HEART"
          size="1em"
          style="vertical-align: baseline"
        />
      </p>
      <GridGitHubContributors />
      <h3 class="responsive-h4 pt-4 font-bold">
        {{ $t("pages.supporters.showcase.section_2_2_subheader") }}
      </h3>
      <p>{{ $t("pages.supporters.showcase.section_2_2_paragraph_1") }}</p>
      <!-- <ul class="py-4 pl-4 space-y-2"></ul> -->
      <p class="text-light-distinct-text dark:text-dark-distinct-text">
        {{ $t("pages.supporters.showcase.section_2_2_thanks") }}
      </p>
      <h2 class="responsive-py-1 responsive-h3 font-bold">
        {{ $t("pages.supporters.showcase.section_3_subheader") }}
      </h2>
      <p>
        {{ $t("pages.supporters.showcase.section_3_paragraph_1_1") }}
        <a
          class="focus-brand link-text items-center"
          href="https://www.wikimedia.de/unlock"
          target="_blank"
        >
          {{ $t("pages.supporters.showcase.section_3_paragraph_1_2") }}
          <Icon
            :name="IconMap.EXTERNAL_LINK"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        . {{ $t("pages.supporters.showcase.section_3_paragraph_1_3") }}
      </p>
      <div class="flex items-center justify-center pb-6 xl:pb-8">
        <GridSupporters class="mt-6 xl:mt-8" />
      </div>
      <PageCommunityFooter>
        <BtnRouteInternal
          class="w-full"
          :cta="false"
          label="_global.return_home"
          linkTo="/"
          fontSize="lg"
          ariaLabel="_global.return_home_aria_label"
        />
      </PageCommunityFooter>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

const localePath = useLocalePath();
</script>
