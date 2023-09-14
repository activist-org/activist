<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ $t("pages.legal.privacy-policy.title") }}</Title>
    </Head>
    <div
      class="flex flex-col items-center w-full responsive-py-4 responsive-px-5"
    >
      <!-- Note: image on top of content. -->
      <img
        v-if="$colorMode.value == 'light'"
        class="h-40 mb-4 md:hidden sm:h-52"
        src="/images/content_pages/icons/bootstrap_shield_check_light.png"
        alt="A shield with a checkmark in the middle of it to indicate that privacy is protected."
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        class="h-40 mb-4 md:hidden sm:h-52"
        src="/images/content_pages/icons/bootstrap_shield_check_dark.png"
        alt="A shield with a checkmark in the middle of it to indicate that privacy is protected."
      />
      <div class="w-10/12 grid grid-cols-1 md:w-full 2xl:grid-cols-2">
        <div class="items-center text-left space-y-4 md:items-start">
          <!-- Note: image floating right of content. -->
          <img
            v-if="$colorMode.value == 'light'"
            class="hidden float-right p-4 h-52 md:block 2xl:hidden lg:h-64"
            src="/images/content_pages/icons/bootstrap_shield_check_light.png"
            alt="A shield with a checkmark in the middle of it to indicate that privacy is protected."
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            class="hidden float-right p-4 h-52 md:block 2xl:hidden lg:h-64"
            src="/images/content_pages/icons/bootstrap_shield_check_dark.png"
            alt="A shield with a checkmark in the middle of it to indicate that privacy is protected."
          />
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
              <Icon
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
              <Icon
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
            class="hidden 2xl:block h-72"
            src="/images/content_pages/icons/bootstrap_shield_check_light.png"
            alt="A shield with a checkmark in the middle of it to indicate that privacy is protected."
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            class="hidden 2xl:block h-72"
            src="/images/content_pages/icons/bootstrap_shield_check_dark.png"
            alt="A shield with a checkmark in the middle of it to indicate that privacy is protected."
          />
        </div>
      </div>
    </div>
  </div>
</template>
