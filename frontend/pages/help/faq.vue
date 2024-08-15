<template>
  <div
    class="bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("_global.faq") }}</Title>
    </Head>
    <PageDocs
      :imgURL="BOOTSTRAP_QUESTION_SQUARE_URL"
      imgAltText="pages._global.faq_img_alt_text"
    >
      <h1 class="responsive-h1 pb-2 font-bold">
        {{ $t("pages.help._global.frequently_asked_questions") }}
      </h1>
      <div class="flex flex-row space-x-3 py-2">
        <Icon
          class="mt-[0.125rem] text-light-link-text dark:text-dark-link-text"
          :name="IconMap.CIRCLE_INFO"
          size="1.25em"
        />
        <p>
          {{ $t("pages.help.faq.subheader_1") }}
          <a
            class="focus-brand link-text items-center"
            href="https://matrix.to/#/#activist_community:matrix.org"
            target="_blank"
          >
            {{ $t("_global.public_matrix_chat_rooms") }}
            <Icon
              :name="IconMap.EXTERNAL_LINK"
              size="1em"
              style="vertical-align: baseline"
            />
          </a>
          !
        </p>
      </div>
      <p class="responsive-h4 font-bold">
        {{ $t("pages.help.faq.section_1_paragraph_1") }}
      </p>
      <p class="sm:text-lg">
        {{ $t("pages.help.faq.section_1_paragraph_2") }}
      </p>
      <p class="responsive-h4 font-bold">
        {{ $t("pages.help.faq.section_2_paragraph_1") }}
      </p>
      <p class="sm:text-lg">
        {{ $t("pages.help.faq.section_2_paragraph_2") }}
      </p>
      <p class="responsive-h4 font-bold">
        {{ $t("pages.help.faq.section_3_paragraph_1") }}
      </p>
      <p class="sm:text-lg">
        {{ $t("pages.help.faq.section_3_paragraph_2") }}
      </p>
      <p class="responsive-h4 font-bold">
        {{ $t("pages.help.faq.section_4_paragraph_1") }}
      </p>
      <p class="sm:text-lg">
        {{ $t("pages.help.faq.section-4-paragraph-2-1") }}
        <a
          class="focus-brand link-text"
          href="https://matrix.to/#/#activist_community:matrix.org"
        >
          {{ $t("pages.help.faq.section_4_paragraph_2_2") }}
          <Icon
            :name="IconMap.EXTERNAL_LINK"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        {{ $t("pages.help.faq.section-4-paragraph-2-3") }}
      </p>
      <PageCommunityFooter>
        <BtnRouteInternal
          class="w-full"
          :cta="false"
          label="components.btn_route_internal.return_home"
          linkTo="/"
          fontSize="lg"
          ariaLabel="components.btn_route_internal.return_home_aria_label"
        />
      </PageCommunityFooter>
    </PageDocs>
  </div>
</template>

<script script setup="ts">
import { IconMap } from "~/types/icon-map";
</script>
