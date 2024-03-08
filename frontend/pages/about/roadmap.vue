<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-layer-0 dark:bg-dark-layer-0"
  >
    <Head>
      <Title>{{ $t("_global.roadmap") }}</Title>
    </Head>
    <PageDocs
      imgURL="/images/content_pages/icons/arcticons_bike_location"
      imgAltText="pages.about._global.roadmap-img-alt-text"
    >
      <h1 class="pb-2 font-bold responsive-h1">
        {{ $t("_global.roadmap") }}
      </h1>
      <div class="flex flex-row py-2 space-x-3">
        <Icon
          class="text-light-link-text dark:text-dark-link-text mt-[0.125rem]"
          name="bi:info-circle-fill"
          size="1.25em"
        />
        <p>
          {{ $t("pages._global.visit-source-code-pt-1") }}
          <a
            class="items-center focus-brand link-text"
            href="https://github.com/activist-org/activist"
            target="_blank"
          >
            {{ $t("pages._global.visit-source-code-pt-2") }}
            <Icon
              name="bi:box-arrow-up-right"
              size="1em"
              style="vertical-align: baseline"
            />
          </a>
          {{ $t("pages._global.visit-source-code-pt-3") }}
        </p>
      </div>
      <p>
        {{ $t("pages.about.roadmap.section-1-paragraph-1") }}
      </p>
      <p class="pb-2 lg:pb-4">
        {{ $t("pages.about.roadmap.section-1-paragraph-2-1") }}
        <a
          class="items-center focus-brand link-text"
          href="https://github.com/orgs/activist-org/projects/1"
          target="_blank"
        >
          {{ $t("pages.about.roadmap.section-1-paragraph-2-2") }}
          <Icon
            name="bi:box-arrow-up-right"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("pages.about.roadmap.section-1-paragraph-2-3") }}
        <a
          class="items-center focus-brand link-text"
          href="https://matrix.to/#/#activist_community:matrix.org"
          target="_blank"
        >
          {{ $t("pages.about.roadmap.section-1-paragraph-2-4") }}
          <Icon
            name="bi:box-arrow-up-right"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("pages._global.share-ideas-say-hi") }}
      </p>
      <div
        class="grid grid-cols-1 max-w-[70%] sm:max-w-[90%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] 2xl:max-w-[80%] grid-rows-2 gap-y-4 sm:gap-y-0 sm:gap-x-4 md:gap-x-6 xl:gap-x-8 mx-auto sm:mx-0 sm:grid-cols-2 sm:grid-rows-1"
      >
        <BtnRouteExternal
          class="w-full"
          :cta="true"
          label="components.btn-route-external.suggest-a-feature"
          linkTo="https://github.com/activist-org/activist/issues"
          fontSize="lg"
          ariaLabel="
                components.btn-route-external.suggest-a-feature-aria-label
              "
        />
        <BtnRouteInternal
          class="w-full"
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
