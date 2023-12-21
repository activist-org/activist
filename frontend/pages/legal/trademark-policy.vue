<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ $t("pages.legal.trademark-policy.title") }}</Title>
    </Head>
    <PageDocs
      imgURL="/images/content_pages/icons/bootstrap_trademark"
      imgAltText="pages.legal._global.trademark-policy-alt-text"
    >
      <h1 class="pb-2 font-bold responsive-h1">Trademark Policy</h1>
      <p
        class="responsive-h4 text-light-special-text dark:text-dark-special-text"
      >
        {{ $t("pages.legal.trademark-policy.last-updated") }}
      </p>
      <p>
        {{ $t("pages.legal.trademark-policy.section-1-paragraph-1") }}
      </p>
      <p>
        {{ $t("pages.legal.trademark-policy.section-1-paragraph-2") }}
      </p>
      <p>
        {{ $t("pages.legal.trademark-policy.section-1-paragraph-3") }}
      </p>
      <p>
        {{ $t("pages.legal.trademark-policy.section-1-paragraph-4") }}
      </p>
      <p>
        {{ $t("pages.legal.trademark-policy.section-1-paragraph-5-1") }}
        <a class="focus-brand link-text" href="mailto:team@activist.org">
          team@activist.org
        </a>
        .
        {{ $t("pages.legal.trademark-policy.section-1-paragraph-5-2") }}
      </p>
      <h2 class="font-bold responsive-h3">
        {{ $t("pages.legal.trademark-policy.section-2-subheader") }}
      </h2>
      <ul class="ml-6 list-disc">
        <li>
          {{ $t("pages.legal.trademark-policy.section-2-list-1-item-1") }}
        </li>
        <li>
          {{ $t("pages.legal.trademark-policy.section-2-list-1-item-2") }}
        </li>
        <li>
          {{ $t("pages.legal.trademark-policy.section-2-list-1-item-3") }}
        </li>
        <li>
          {{ $t("pages.legal.trademark-policy.section-2-list-1-item-4") }}
        </li>
        <li>
          {{ $t("pages.legal.trademark-policy.section-2-list-1-item-5") }}
        </li>
        <li>
          {{ $t("pages.legal.trademark-policy.section-2-list-1-item-6") }}
        </li>
        <li>
          {{ $t("pages.legal.trademark-policy.section-2-list-1-item-7") }}
        </li>
        <li>
          {{ $t("pages.legal.trademark-policy.section-2-list-1-item-8") }}
        </li>
      </ul>
      <h2 class="font-bold responsive-h3">
        {{ $t("pages.legal.trademark-policy.section-3-subheader") }}
      </h2>
      <p>
        {{ $t("pages.legal.trademark-policy.section-3-paragraph-1") }}
      </p>
      <ul class="ml-6 list-disc">
        <li>
          {{ $t("pages.legal.trademark-policy.section-3-list-1-item-1") }}
        </li>
        <li>
          {{ $t("pages.legal.trademark-policy.section-3-list-1-item-2") }}
        </li>
      </ul>
      <h2 class="font-bold responsive-h3">
        {{ $t("pages.legal.trademark-policy.section-4-subheader") }}
      </h2>
      <ul class="ml-6 list-disc">
        <li>
          {{ $t("pages.legal.trademark-policy.section-4-list-1-item-1") }}
        </li>
      </ul>
      <h2 class="font-bold responsive-h3">
        {{ $t("pages.legal.trademark-policy.section-5-subheader") }}
      </h2>
      <p>
        {{ $t("pages.legal.trademark-policy.section-5-paragraph-1") }}
      </p>
      <p class="pb-2 lg:pb-4">
        {{ $t("pages._global.interested-in-helping") }}
        <a
          class="items-center focus-brand link-text"
          href="https://github.com/orgs/activist-org"
          target="_blank"
        >
          {{ $t("pages._global.on-github") }}
          <Icon
            name="bi:box-arrow-up-right"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("pages._global.contribute-request-feature") }}
        <a
          class="items-center focus-brand link-text"
          href="https://matrix.to/#/#activist_community:matrix.org"
          target="_blank"
        >
          {{ $t("pages._global.public-matrix-chat-rooms") }}
          <Icon
            name="bi:box-arrow-up-right"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("pages._global.share-ideas-say-hi") }}
      </p>
      <div
        class="flex flex-col items-center space-y-2 md:items-left sm:space-x-4 sm:space-y-0 sm:flex-row"
      >
        <BtnLabeled
          :cta="false"
          label="components.btn-labeled.return-home"
          linkTo="/"
          fontSize="lg"
          ariaLabel="components.btn-labeled.return-home-aria-label"
        />
      </div>
    </PageDocs>
  </div>
</template>
