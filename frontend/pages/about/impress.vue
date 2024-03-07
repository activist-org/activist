<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-layer-0 dark:bg-dark-layer-0"
  >
    <Head>
      <Title>{{ $t("_global.imprint") }}</Title>
    </Head>
    <PageDocs
      imgURL="/images/content_pages/icons/bootstrap_info_circle"
      imgAltText="pages.about._global.imprint-img-alt-text"
    >
      <h1 class="pb-2 font-bold responsive-h1">
        {{ $t("_global.imprint") }}
      </h1>
      <div class="flex flex-row py-2 space-x-3">
        <Icon
          class="text-light-link-text dark:text-dark-link-text mt-[0.125rem]"
          name="bi:info-circle-fill"
          size="1.25em"
        />
        <p>
          {{ $t("pages.about.impress.subheader-1") }}
          <a class="items-center focus-brand link-text" href="/help/contact">
            {{ $t("pages._global.contact-page") }}
            <Icon
              name="bi:box-arrow-up-right"
              size="1em"
              style="vertical-align: baseline"
            />
          </a>
          {{ $t("pages.about.impress.subheader-3") }}
        </p>
      </div>
      <p>
        {{ $t("pages.about.impress.section-1-paragraph-1") }}
      </p>
      <p>
        {{ $t("pages.about.impress.section-1-paragraph-2") }}
      </p>
      <ul>
        <li>
          <strong>{{ $t("pages.about.impress.inquiries") }}</strong>
        </li>
        <li>
          <a class="focus-brand link-text" href="mailto:team@activist.org">
            team@activist.org
          </a>
        </li>
      </ul>
      <p class="pb-2 lg:pb-4">
        {{ $t("pages.about.impress.message") }}
      </p>
      <div
        class="flex flex-col items-center space-y-2 md:items-left sm:space-x-4 sm:space-y-0 sm:flex-row"
      >
        <BtnRouteInternal
          :cta="false"
          label="components.btn-route-internal.return-home"
          linkTo="/"
          fontSize="lg"
          ariaLabel="components.btn-route-internal.return-home-aria-label"
        />
      </div>
    </PageDocs>
  </div>
</template>
