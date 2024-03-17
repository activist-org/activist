<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-layer-0 dark:bg-dark-layer-0"
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
        class="responsive-h4 text-light-distinct-text dark:text-dark-distinct-text"
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
      <PageCommunityFooter>
        <BtnRouteInternal
          class="w-full"
          :cta="false"
          label="components.btn-route-internal.return-home"
          linkTo="/"
          fontSize="lg"
          ariaLabel="components.btn-route-internal.return-home-aria-label"
        />
      </PageCommunityFooter>
    </PageDocs>
  </div>
</template>
