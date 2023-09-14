<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ $t("pages.about.roadmap.title") }}</Title>
    </Head>
    <div
      class="flex flex-col items-center w-full responsive-py-4 responsive-px-5"
    >
      <!-- Note: image on top of content. -->
      <img
        v-if="$colorMode.value == 'light'"
        class="h-40 mb-4 md:hidden sm:h-52"
        src="/images/content_pages/icons/arcticons_bike_location_light.png"
        alt="A bicycle within a balloon-shaped icon."
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        class="h-40 mb-4 md:hidden sm:h-52"
        src="/images/content_pages/icons/arcticons_bike_location_dark.png"
        alt="A bicycle within a balloon-shaped icon."
      />
      <div class="w-10/12 grid grid-cols-1 md:w-full 2xl:grid-cols-2">
        <div class="items-center text-left space-y-4 md:items-start">
          <!-- Note: image floating right of content. -->
          <img
            v-if="$colorMode.value == 'light'"
            class="hidden float-right h-64 p-4 md:block 2xl:hidden lg:h-72"
            src="/images/content_pages/icons/arcticons_bike_location_light.png"
            alt="A bicycle within a balloon-shaped icon."
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            class="hidden float-right h-64 p-4 md:block 2xl:hidden lg:h-72"
            src="/images/content_pages/icons/arcticons_bike_location_dark.png"
            alt="A bicycle within a balloon-shaped icon."
          />
          <h1 class="pb-2 font-bold responsive-h1">Roadmap</h1>
          <div class="flex flex-row py-2 space-x-3">
            <Icon
              class="text-light-link-text dark:text-dark-link-text mt-[0.125rem]"
              name="bi:info-circle-fill"
              size="1.25em"
            />
            <p>
              {{ $t("pages.about.roadmap.subheader-1") }}
              <a
                class="items-center focus-brand link-text"
                href="https://github.com/activist-org/activist"
                target="_blank"
              >
                {{ $t("pages.about.roadmap.subheader-2") }}
                <Icon
                  name="bi:box-arrow-up-right"
                  size="1em"
                  style="vertical-align: baseline"
                />
              </a>
              {{ $t("pages.about.roadmap.subheader-3") }}
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
            {{ $t("pages.about.roadmap.section-1-paragraph-2-5") }}
          </p>
          <div
            class="flex flex-col items-center space-y-2 md:items-left sm:space-x-4 sm:space-y-0 sm:flex-row"
          >
            <BtnLabeled
              :cta="true"
              :label="$t('components.btn-labeled.suggest-a-feature')"
              linkTo="https://github.com/activist-org/activist/issues"
              fontSize="lg"
              :alternateText="
                $t('components.btn-labeled.suggest-a-feature-aria-label')
              "
            />
            <BtnLabeled
              :cta="false"
              :label="$t('components.btn-labeled.return-home')"
              linkTo="/"
              fontSize="lg"
              :alternateText="
                $t('components.btn-labeled.return-home-aria-label')
              "
            />
          </div>
        </div>
        <div class="flex justify-end pr-32">
          <!-- Note: image right of content. -->
          <img
            v-if="$colorMode.value == 'light'"
            class="hidden 2xl:block h-80"
            src="/images/content_pages/icons/arcticons_bike_location_light.png"
            alt="A bicycle within a balloon-shaped icon."
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            class="hidden 2xl:block h-80"
            src="/images/content_pages/icons/arcticons_bike_location_dark.png"
            alt="A bicycle within a balloon-shaped icon."
          />
        </div>
      </div>
    </div>
  </div>
</template>
