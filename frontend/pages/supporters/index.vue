<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ $t("pages.supporters.index.title") }}</Title>
    </Head>
    <div class="flex flex-col space-y-4 responsive-py-4 responsive-px-5">
      <h1 class="font-bold responsive-h1">
        {{ $t("pages.supporters.index.title") }}
      </h1>
      <p class="pt-2 lg:pt-4 xl:pt-6">
        {{ $t("pages.supporters.index.section-1-paragraph-1-1") }}
        <NuxtLink
          class="focus-brand link-text"
          :to="localePath('/supporters/join')"
        >
          {{ $t("pages.supporters.index.section-1-paragraph-1-2") }}
        </NuxtLink>
        .
      </p>
      <h2 class="font-bold responsive-py-1 responsive-h3">
        {{ $t("pages.supporters.index.section-2-subheader") }}
      </h2>
      <p>
        {{ $t("pages.supporters.index.section-2-paragraph-1-1") }}
        <a
          class="items-center focus-brand link-text"
          href="https://www.wikimedia.de/unlock"
          target="_blank"
        >
          {{ $t("pages.supporters.index.section-2-paragraph-1-2") }}
          <Icon
            name="bi:box-arrow-up-right"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        . {{ $t("pages.supporters.index.section-2-paragraph-1-3") }}
      </p>
      <div class="flex items-center justify-center">
        <GridSupporters class="mt-6 xl:mt-8" />
      </div>
      <h2 class="font-bold responsive-py-1 responsive-h3">
        {{ $t("pages.supporters.index.section-3-subheader") }}
      </h2>
      <h3 class="font-bold responsive-h4">
        {{ $t("pages.supporters.index.section-3-1-subheader") }}
      </h3>
      <p class="space-x-1">
        {{ $t("pages.supporters.index.section-3-1-paragraph-1-1") }}
        <a
          class="focus-brand link-text"
          href="https://github.com/activist-org/activist/graphs/contributors"
          target="_blank"
        >
          {{ $t("pages.supporters.index.section-3-1-paragraph-1-2") }}
          <Icon
            name="bi:box-arrow-up-right"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        <Icon
          name="bi:heart-fill"
          size="1em"
          style="vertical-align: baseline"
        />
      </p>
      <GridGitHubContributors />
      <h3 class="pt-4 font-bold responsive-h4">
        {{ $t("pages.supporters.index.section-3-2-subheader") }}
      </h3>
      <p>{{ $t("pages.supporters.index.section-3-2-paragraph-1") }}</p>
      <!-- <ul class="py-4 pl-4 space-y-2"></ul> -->
      <p class="text-light-special-text dark:text-dark-special-text">
        {{ $t("pages.supporters.index.thanks") }}
      </p>
    </div>
  </div>
</template>
