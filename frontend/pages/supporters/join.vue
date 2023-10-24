<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ $t("pages.supporters.join.title") }}</Title>
    </Head>
    <PageDocs
      imgURL="/images/content_pages/icons/join_icon"
      imgAltText="pages.supporters.join.join-alt-text"
    >
      <h1 class="font-bold responsive-h1">
        {{ $t("pages.supporters.join.title") }}
      </h1>
      <p>
        {{ $t("pages.supporters.join.section-1-paragraph-1-1") }}
        <NuxtLink class="focus-brand link-text" :to="localePath('/supporters')">
          {{ $t("pages.supporters.join.section-1-paragraph-1-2") }}
        </NuxtLink>
        .
      </p>
      <h2 class="font-bold responsive-h4">
        {{ $t("pages.supporters.join.section-2-subheader") }}
      </h2>
      <p>
        {{ $t("pages.supporters.join.section-2-paragraph-1-1") }}
        <a
          class="focus-brand link-text"
          href="https://www.wikimedia.de/unlock"
          target="_blank"
        >
          {{ $t("pages.supporters.join.section-2-paragraph-1-2") }}
          <Icon
            name="bi:box-arrow-up-right"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("pages.supporters.join.section-2-paragraph-1-3") }}
      </p>
      <h2 class="font-bold responsive-h4">
        {{ $t("pages.supporters.join.section-3-subheader") }}
      </h2>
      <p>
        {{ $t("pages.supporters.join.section-3-paragraph-1-1") }}
      </p>
      <h2 class="font-bold responsive-h4">
        {{ $t("pages.supporters.join.section-4-subheader") }}
      </h2>
      <p>
        {{ $t("pages.supporters.join.section-4-paragraph-1-1") }}
        <NuxtLink
          class="focus-brand link-text"
          :to="localePath('/help/contact')"
        >
          {{ $t("pages.supporters.join.section-4-paragraph-1-2") }}
        </NuxtLink>
        {{ $t("pages.supporters.join.section-4-paragraph-1-3") }}
      </p>
      <h2 class="font-bold responsive-h4">
        {{ $t("pages.supporters.join.section-5-subheader") }}
      </h2>
      <p>
        {{ $t("pages.supporters.join.section-5-paragraph-1-1") }}
        <NuxtLink class="focus-brand link-text" :to="localePath('/supporters')">
          {{ $t("pages.supporters.join.section-5-paragraph-1-2") }}
        </NuxtLink>
        .
      </p>
      <h2 class="font-bold responsive-h4">
        {{ $t("pages.supporters.join.section-6-subheader") }}
      </h2>
      <p>
        {{ $t("pages.supporters.join.section-6-paragraph-1-1") }}
        <a
          class="focus-brand link-text"
          href="https://explore.transifex.com/activist-org/activist"
          target="_blank"
        >
          {{ $t("pages.supporters.join.section-6-paragraph-1-2") }}
          <Icon
            name="bi:box-arrow-up-right"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("pages.supporters.join.section-6-paragraph-1-3") }}
      </p>
    </PageDocs>
  </div>
</template>
