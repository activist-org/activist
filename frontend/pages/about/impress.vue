<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ $t("pages.about.impress.title") }}</Title>
    </Head>
    <div
      class="flex flex-col items-center w-full responsive-py-4 responsive-px-5"
    >
      <!-- Note: image on top of content. -->
      <img
        v-if="$colorMode.value == 'light'"
        class="h-40 mb-4 md:hidden sm:h-52"
        src="/images/content_pages/icons/bootstrap_info_circle_light.png"
        alt="A information circle."
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        class="h-40 mb-4 md:hidden sm:h-52"
        src="/images/content_pages/icons/bootstrap_info_circle_dark.png"
        alt="A information circle."
      />
      <div class="w-10/12 grid grid-cols-1 md:w-full 2xl:grid-cols-2">
        <div class="items-center text-left space-y-4 md:items-start">
          <!-- Note: image floating right of content. -->
          <img
            v-if="$colorMode.value == 'light'"
            class="hidden float-right p-4 h-52 md:block 2xl:hidden lg:h-64"
            src="/images/content_pages/icons/bootstrap_info_circle_light.png"
            alt="A information circle."
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            class="hidden float-right p-4 h-52 md:block 2xl:hidden lg:h-64"
            src="/images/content_pages/icons/bootstrap_info_circle_dark.png"
            alt="A information circle."
          />
          <h1 class="pb-2 font-bold responsive-h1">
            {{ $t("pages.about.impress.header") }}
          </h1>
          <div class="flex flex-row py-2 space-x-3">
            <Icon
              class="text-light-link-text dark:text-dark-link-text mt-[0.125rem]"
              name="bi:info-circle-fill"
              size="1.25em"
            />
            <p>
              {{ $t("pages.about.impress.subheader-1") }}
              <a
                class="items-center focus-brand link-text"
                href="/help/contact"
              >
                {{ $t("pages.about.impress.subheader-2") }}
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
              <a
                class="focus-brand link-text"
                href="mailto:team@activist.org"
              >
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
            <BtnLabeled
              :cta="false"
              :label="$t('components.btn-labeled.return-home')"
              linkTo="/"
              fontSize="lg"
              :alternateText="$t('components.btn-labeled.return-home-aria-label')"
            />
          </div>
        </div>
        <div class="flex justify-end pr-32">
          <!-- Note: image right of content. -->
          <img
            v-if="$colorMode.value == 'light'"
            class="hidden 2xl:block h-72"
            src="/images/content_pages/icons/bootstrap_info_circle_light.png"
            alt="A information circle."
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            class="hidden 2xl:block h-72"
            src="/images/content_pages/icons/bootstrap_info_circle_dark.png"
            alt="A information circle."
          />
        </div>
      </div>
    </div>
  </div>
</template>
