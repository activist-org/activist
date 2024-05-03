<template>
  <div
    class="bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("pages.legal.trademark-policy.title") }}</Title>
    </Head>
    <PageDocs
      :imgURL="BOOTSTRAP_TRADEMARK_URL"
      imgAltText="pages.legal._global.trademark-policy-alt-text"
    >
      <h1 class="responsive-h1 pb-2 font-bold">
        {{ $t("_global.trademark-policy") }}
      </h1>
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
        <a class="focus-brand link-text -mr-1" href="mailto:team@activist.org">
          team@activist.org
        </a>
        .
        {{ $t("pages.legal.trademark-policy.section-1-paragraph-5-2") }}
      </p>
      <h2 class="responsive-h3 font-bold">
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
      <h2 class="responsive-h3 font-bold">
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
      <h2 class="responsive-h3 font-bold">
        {{ $t("pages.legal.trademark-policy.section-4-subheader") }}
      </h2>
      <ul class="ml-6 list-disc">
        <li>
          {{ $t("pages.legal.trademark-policy.section-4-list-1-item-1") }}
        </li>
      </ul>
      <h2 class="responsive-h3 font-bold">
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
