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
        src="/images/content_pages/icons/bootstrap_shield_check_light.png"
        alt="A shield with a checkmark in the middle of it to indicate that privacy is protected."
        class="h-40 mb-4 md:hidden sm:h-52"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        src="/images/content_pages/icons/bootstrap_shield_check_dark.png"
        alt="A shield with a checkmark in the middle of it to indicate that privacy is protected."
        class="h-40 mb-4 md:hidden sm:h-52"
      />
      <div class="w-10/12 grid grid-cols-1 md:w-full 2xl:grid-cols-2">
        <div class="items-center text-left space-y-4 md:items-start">
          <!-- Note: image floating right of content. -->
          <img
            v-if="$colorMode.value == 'light'"
            src="/images/content_pages/icons/bootstrap_shield_check_light.png"
            alt="A shield with a checkmark in the middle of it to indicate that privacy is protected."
            class="hidden float-right p-4 h-52 md:block 2xl:hidden lg:h-64"
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            src="/images/content_pages/icons/bootstrap_shield_check_dark.png"
            alt="A shield with a checkmark in the middle of it to indicate that privacy is protected."
            class="hidden float-right p-4 h-52 md:block 2xl:hidden lg:h-64"
          />
          <h1 class="pb-2 font-bold responsive-h1">{{ $t("pages.legal.privacy-policy.title-page") }}</h1>
          <p
            class="responsive-h4 text-light-special-text dark:text-dark-special-text"
          >
            {{ $t("pages.legal.privacy-policy.last-updated") }}
          </p>
          <p>
            {{ $t("pages.legal.privacy-policy.paragraph-1") }}
          </p>
          <p>
            {{ $t("pages.legal.privacy-policy.paragraph-2") }}
          </p>
          <h2 class="font-bold responsive-h3">{{ $t("pages.legal.privacy-policy.subtitle-1") }}</h2>
          <p>
            {{ $t("pages.legal.privacy-policy.paragraph-3") }}
          </p>
          <p>
            {{ $t("pages.legal.privacy-policy.paragraph-4") }}
          </p>
          <h2 class="font-bold responsive-h3">{{ $t("pages.legal.privacy-policy.subtitle-2") }}</h2>
          <p>
            {{ $t("pages.legal.privacy-policy.paragraph-5") }}
          </p>
          <p>
            {{ $t("pages.legal.privacy-policy.paragraph-6") }}
          </p>
          <h2 class="font-bold responsive-h3">
            {{ $t("pages.legal.privacy-policy.subtitle-3") }}
          </h2>
          <p>
            {{ $t("pages.legal.privacy-policy.paragraph-7") }}
          </p>
          <p>
            {{ $t("pages.legal.privacy-policy.paragraph-8") }}
          </p>
          <h2 class="font-bold responsive-h3">{{ $t("pages.legal.privacy-policy.subtitle-4") }}</h2>
          <p>
            {{ $t("pages.legal.privacy-policy.paragraph-9") }}
          </p>
          <p>
            {{ $t("pages.legal.privacy-policy.paragraph-10") }}
          </p>
          <h2 class="font-bold responsive-h3">{{ $t("pages.legal.privacy-policy.subtitle-5") }}</h2>
          <p>
            {{ $t("pages.legal.privacy-policy.paragraph-11") }}
          </p>
          <p>
            {{ $t("pages.legal.privacy-policy.paragraph-12") }}
          </p>
          <h2 class="font-bold responsive-h3">{{ $t("pages.legal.privacy-policy.subtitle-6") }}</h2>
          <p>
            {{ $t("pages.legal.privacy-policy.paragraph-13") }}
          </p>
          <p>
            {{ $t("pages.legal.privacy-policy.paragraph-14") }}
          </p>
          <h2 class="font-bold responsive-h3">{{ $t("pages.legal.privacy-policy.subtitle-7") }}</h2>
          <p>
            {{ $t("pages.legal.privacy-policy.paragraph-15") }}
          </p>
          <p>
            {{ $t("pages.legal.privacy-policy.paragraph-16") }}
          </p>
          <p class="pb-2 lg:pb-4">
            {{ $t("pages.legal.privacy-policy.paragraph-17-pt1") }}
            <a
              href="https://github.com/orgs/activist-org"
              class="items-center focus-brand link-text"
              target="_blank"
            >
              {{ $t("pages.legal.privacy-policy.paragraph-17-pt2") }}
              <Icon
                name="bi:box-arrow-up-right"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
            {{ $t("pages.legal.privacy-policy.paragraph-17-pt3") }}
            <a
              href="https://matrix.to/#/#activist_community:matrix.org"
              class="items-center focus-brand link-text"
              target="_blank"
            >
              {{ $t("pages.legal.privacy-policy.paragraph-17-pt4") }}
              <Icon
                name="bi:box-arrow-up-right"
                size="1em"
                style="vertical-align: baseline"
              />
            </a>
            {{ $t("pages.legal.privacy-policy.paragraph-17-pt5") }}
          </p>
          <div
            class="flex flex-col items-center space-y-2 md:items-left sm:space-x-4 sm:space-y-0 sm:flex-row"
          >
            <BtnLabeled
              :cta="false"
              label="Return home"
              linkTo="/"
              fontSize="lg"
            />
          </div>
        </div>
        <div class="flex justify-end pr-32">
          <!-- Note: image right of content. -->
          <img
            v-if="$colorMode.value == 'light'"
            src="/images/content_pages/icons/bootstrap_shield_check_light.png"
            alt="A shield with a checkmark in the middle of it to indicate that privacy is protected."
            class="hidden 2xl:block h-72"
          />
          <img
            v-else-if="$colorMode.value == 'dark'"
            src="/images/content_pages/icons/bootstrap_shield_check_dark.png"
            alt="A shield with a checkmark in the middle of it to indicate that privacy is protected."
            class="hidden 2xl:block h-72"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
