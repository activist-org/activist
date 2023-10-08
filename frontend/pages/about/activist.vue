<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <head>
      <title>{{ $t("pages.about.activist.title") }}</title>
    </head>
    <pagedocs
      imgURL="/images/content_pages/icons/activist_icon"
      imgAltText="pages.about.activist.img-alt-text"
    >
      <h1 class="pb-2 font-bold responsive-h1">
        {{ $t("pages.about.activist.header") }}
      </h1>
      <div class="flex flex-row py-2 space-x-3">
        <icon
          class="text-light-link-text dark:text-dark-link-text mt-[0.125rem]"
          name="bi:info-circle-fill"
          size="1.25em"
        />
        <p>
          {{ $t("pages.about.activist.subheader-1") }}
          <a
            class="items-center focus-brand link-text"
            href="https://www.figma.com/file/i9mcffalu1riiwp5ip3yje/activist_public_designs?node-id=805%3A231&t=vNWHCPdiq5EbPaO9-1"
            target="_blank"
          >
            {{ $t("pages.about.activist.subheader-2") }}
            <icon
              name="bi:box-arrow-up-right"
              size="1em"
              style="vertical-align: baseline"
            />
          </a>
          {{ $t("pages.about.activist.subheader-3") }}
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
        {{ $t("pages.about.activist.section-1-paragraph-5-1") }}
        <a
          class="items-center focus-brand link-text"
          href="https://github.com/orgs/activist-org"
          target="_blank"
        >
          {{ $t("pages.about.activist.section-1-paragraph-5-2") }}
          <icon
            name="bi:box-arrow-up-right"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("pages.about.activist.section-1-paragraph-5-3") }}
        <a
          class="items-center focus-brand link-text"
          href="https://matrix.to/#/#activist_community:matrix.org"
          target="_blank"
        >
          {{ $t("pages.about.activist.section-1-paragraph-5-4") }}
          <icon
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
        <btnlabeled
          class="w-full"
          :cta="true"
          label="components.btn-labeled.request-access"
          linkTo="https://tally.so/r/nprxbq"
          fontSize="lg"
          ariaLabel="
                components.btn-labeled.request-access-aria-label
              "
        />
        <btnlabeled
          class="w-full"
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
