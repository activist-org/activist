<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ $t("pages.help.faq.title") }}</Title>
    </Head>
    <div
      class="flex flex-col items-center w-full responsive-py-4 responsive-px-5"
    >
      <!-- Note: image on top of content. -->
      <img
        v-if="$colorMode.value == 'light'"
        class="h-40 mb-4 md:hidden sm:h-52"
        src="/images/content_pages/icons/bootstrap_question_square_light.png"
        alt="A question mark within a square."
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        class="h-40 mb-4 md:hidden sm:h-52"
        src="/images/content_pages/icons/bootstrap_question_square_dark.png"
        alt="A question mark within a square."
      />
      <div class="w-10/12 grid grid-cols-1 md:w-full 2xl:grid-cols-2">
        <div class="items-center text-left space-y-4 md:items-start">
          <!-- Note: image floating right of content. -->
          <img
            v-if="$colorMode.value == 'light'"
            class="hidden float-right p-4 h-52 md:block 2xl:hidden lg:h-64"
            src="/images/content_pages/icons/bootstrap_question_square_light.png"
            alt="A question mark within a square."
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            class="hidden float-right p-4 h-52 md:block 2xl:hidden lg:h-64"
            src="/images/content_pages/icons/bootstrap_question_square_dark.png"
            alt="A question mark within a square."
          />
          <PageBreadcrumbs />
          <h1 class="pb-2 font-bold responsive-h1">
            {{ $t("pages.help.faq.header") }}
          </h1>
          <div class="flex flex-row py-2 space-x-3">
            <Icon
              class="text-light-link-text dark:text-dark-link-text mt-[0.125rem]"
              name="bi:info-circle-fill"
              size="1.25em"
            />
            <p>
              {{ $t("pages.help.faq.subheader-1") }}
              <a
                class="items-center focus-brand link-text"
                href="https://matrix.to/#/#activist_community:matrix.org"
                target="_blank"
              >
                {{ $t("pages.help.faq.subheader-2") }}
                <Icon
                  name="bi:box-arrow-up-right"
                  size="1em"
                  style="vertical-align: baseline"
                />
              </a>
              !
            </p>
          </div>
          <p class="font-bold responsive-h4">
            {{ $t("pages.help.faq.section-1-paragraph-1") }}
          </p>
          <p class="sm:text-lg">
            {{ $t("pages.help.faq.section-1-paragraph-2") }}
          </p>
          <p class="font-bold responsive-h4">
            {{ $t("pages.help.faq.section-2-paragraph-1") }}
          </p>
          <p class="sm:text-lg">
            {{ $t("pages.help.faq.section-2-paragraph-2") }}
          </p>
          <p class="font-bold responsive-h4">
            {{ $t("pages.help.faq.section-3-paragraph-1") }}
          </p>
          <p class="sm:text-lg">
            {{ $t("pages.help.faq.section-3-paragraph-2") }}
          </p>
          <p class="font-bold responsive-h4">
            {{ $t("pages.help.faq.section-4-paragraph-1") }}
          </p>
          <p class="sm:text-lg">
            {{ $t("pages.help.faq.section-4-paragraph-2-1") }}
            <a
              class="focus-brand link-text"
              href="https://matrix.to/#/#activist_community:matrix.org"
            >
              {{ $t("pages.help.faq.section-4-paragraph-2-2") }}
              <Icon
                name="bi:box-arrow-up-right"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
            {{ $t("pages.help.faq.section-4-paragraph-2-3") }}
          </p>
        </div>
        <div class="flex justify-end pr-32">
          <!-- Note: image right of content. -->
          <img
            v-if="$colorMode.value == 'light'"
            class="hidden 2xl:block h-72"
            src="/images/content_pages/icons/bootstrap_question_square_light.png"
            alt="A question mark within a square."
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            class="hidden 2xl:block h-72"
            src="/images/content_pages/icons/bootstrap_question_square_dark.png"
            alt="A question mark within a square."
          />
        </div>
      </div>
    </div>
  </div>
</template>
