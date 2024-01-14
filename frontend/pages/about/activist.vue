<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ $t("pages._global.about-us") }}</Title>
    </Head>
    <PageDocs
      imgURL="/images/content_pages/icons/activist_icon"
      imgAltText="_global.activist-icon-img-alt-text"
    >
      <h1 class="pb-2 font-bold responsive-h1">
        {{ $t("pages.about.activist.header") }}
      </h1>
      <div class="flex flex-row py-2 space-x-3">
        <Icon
          class="text-light-link-text dark:text-dark-link-text mt-[0.125rem]"
          name="bi:info-circle-fill"
          size="1.25em"
        />
        <p>
          {{ $t("pages._global.see-the") }}
          <a
            class="items-center focus-brand link-text"
            href="https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_public_designs?node-id=805%3A231&t=vNWHCPdiq5EbPaO9-1"
            target="_blank"
          >
            {{ $t("pages.about.activist.subheader-2") }}
            <Icon
              name="bi:box-arrow-up-right"
              size="1em"
              style="vertical-align: baseline"
            />
          </a>
          {{ $t("pages._global.to-learn-more") }}
        </p>
      </div>
      <p>
        {{ $t("pages.about.activist.section-1-paragraph-1") }}
      </p>
      <p>
        {{ $t("pages.about.activist.section-1-paragraph-2") }}
      </p>
      <p>
        {{ $t("pages.about.activist.section-1-paragraph-3") }}
      </p>
      <p>
        {{ $t("pages.about.activist.section-1-paragraph-4") }}
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
        {{ $t("pages.about.activist.section-1-paragraph-5-5") }}
      </p>
      <div
        class="grid grid-cols-1 max-w-[70%] sm:max-w-[90%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] 2xl:max-w-[80%] grid-rows-2 gap-y-4 sm:gap-y-0 sm:gap-x-4 md:gap-x-6 xl:gap-x-8 mx-auto sm:mx-0 sm:grid-cols-2 sm:grid-rows-1"
      >
        <BtnRouteExternal
          class="w-full"
          :cta="true"
          label="components.btn-route-external.request-access"
          linkTo="https://tally.so/r/nprxbq"
          fontSize="lg"
          ariaLabel="
                components.btn-route-external.request-access-aria-label
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
