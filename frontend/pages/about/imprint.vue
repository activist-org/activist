<template>
  <div
    class="bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("_global.imprint") }}</Title>
    </Head>
    <PageDocs
      :imgURL="BOOTSTRAP_INFO_CIRCLE_URL"
      imgAltText="pages.about._global.imprint_img_alt_text"
    >
      <h1 class="responsive-h1 pb-2 font-bold">
        {{ $t("_global.imprint") }}
      </h1>
      <div class="flex flex-row space-x-3 py-2">
        <Icon
          class="mt-[0.125rem] text-light-link-text dark:text-dark-link-text"
          :name="IconMap.CIRCLE_INFO"
          size="1.25em"
        />
        <p>
          {{ $t("pages.about.imprint.subheader_1") }}
          <NuxtLink
            class="focus-brand link-text items-center"
            to="/help/contact"
          >
            {{ $t("pages._global.contact_page") }}
            <Icon
              :name="IconMap.EXTERNAL_LINK"
              size="1em"
              style="vertical-align: baseline"
            />
          </NuxtLink>
          {{ $t("pages.about.imprint.subheader_3") }}
        </p>
      </div>
      <p>
        {{ $t("pages.about.imprint.section_1_paragraph_1") }}
      </p>
      <p>
        {{ $t("pages.about.imprint.section_1_paragraph_2") }}
      </p>
      <ul>
        <li>
          <strong>{{ $t("pages.about.imprint.inquiries") }}</strong>
        </li>
        <li>
          <a class="focus-brand link-text" href="mailto:team@activist.org">
            team@activist.org
          </a>
        </li>
      </ul>
      <p>
        {{ $t("pages.about.imprint.message") }}
      </p>
      <PageCommunityFooter>
        <BtnRouteInternal
          class="w-full"
          :cta="false"
          label="_global.return_home"
          linkTo="/"
          fontSize="lg"
          ariaLabel="_global.return_home_aria_label"
        />
      </PageCommunityFooter>
    </PageDocs>
  </div>
</template>

<script script setup="ts">
import { IconMap } from "~/types/icon-map";
</script>
