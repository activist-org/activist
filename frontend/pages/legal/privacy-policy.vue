<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <head>
      <title>{{ $t("pages.legal.privacy-policy.title") }}</title>
    </head>
    <pagedocs
      imgURL="/images/content_pages/icons/bootstrap_shield_check"
      imgAltText="pages.legal.privacy-policy.img-alt-text"
    >
      <h1 class="pb-2 font-bold responsive-h1">
        {{ $t("pages.legal.privacy-policy.header") }}
      </h1>
      <p
        class="responsive-h4 text-light-special-text dark:text-dark-special-text"
      >
        {{ $t("pages.legal.privacy-policy.last-updated") }}
      </p>
      <p>
        {{ $t("pages.legal.privacy-policy.section-1-paragraph-1") }}
      </p>
      <p>
        {{ $t("pages.legal.privacy-policy.section-1-paragraph-2") }}
      </p>
      <p>
        {{ $t("pages.legal.privacy-policy.section-1-paragraph-3") }}
      </p>
      <h2 class="font-bold responsive-h3">
        {{ $t("pages.legal.privacy-policy.section-2-subheader") }}
      </h2>
      <p>
        {{ $t("pages.legal.privacy-policy.section-2-paragraph-1") }}
      </p>
      <h2 class="font-bold responsive-h3">
        {{ $t("pages.legal.privacy-policy.section-3-subheader") }}
      </h2>
      <p>
        {{ $t("pages.legal.privacy-policy.section-3-paragraph-1") }}
      </p>
      <h2 class="font-bold responsive-h3">
        {{ $t("pages.legal.privacy-policy.section-4-subheader") }}
      </h2>
      <p>
        {{ $t("pages.legal.privacy-policy.section-4-paragraph-1") }}
      </p>
      <h2 class="font-bold responsive-h3">
        {{ $t("pages.legal.privacy-policy.section-5-subheader") }}
      </h2>
      <p>
        {{ $t("pages.legal.privacy-policy.section-5-paragraph-1") }}
      </p>
      <p>
        {{ $t("pages.legal.privacy-policy.section-5-paragraph-2") }}
      </p>
      <h2 class="font-bold responsive-h3">
        {{ $t("pages.legal.privacy-policy.section-6-subheader") }}
      </h2>
      <p>
        {{ $t("pages.legal.privacy-policy.section-6-paragraph-1") }}
      </p>
      <h2 class="font-bold responsive-h3">
        {{ $t("pages.legal.privacy-policy.section-7-subheader") }}
      </h2>
      <p>
        {{ $t("pages.legal.privacy-policy.section-7-paragraph-1") }}
      </p>
      <p class="pb-2 lg:pb-4">
        {{ $t("pages.legal.privacy-policy.section-8-paragraph-1-1") }}
        <a
          class="items-center focus-brand link-text"
          href="https://github.com/orgs/activist-org"
          target="_blank"
        >
          {{ $t("pages.legal.privacy-policy.section-8-paragraph-1-2") }}
          <icon
            name="bi:box-arrow-up-right"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("pages.legal.privacy-policy.section-8-paragraph-1-3") }}
        <a
          class="items-center focus-brand link-text"
          href="https://matrix.to/#/#activist_community:matrix.org"
          target="_blank"
        >
          {{ $t("pages.legal.privacy-policy.section-8-paragraph-1-4") }}
          <icon
            name="bi:box-arrow-up-right"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("pages.legal.privacy-policy.section-8-paragraph-1-5") }}
      </p>
      <div
        class="flex flex-col items-center space-y-2 md:items-left sm:space-x-4 sm:space-y-0 sm:flex-row"
      >
        <btnlabeled
          :cta="false"
          label="components.btn-labeled.return-home"
          linkTo="/"
          fontSize="lg"
          ariaLabel="components.btn-labeled.return-home-aria-label"
        />
      </div>
    </pagedocs>
  </div>
</template>
