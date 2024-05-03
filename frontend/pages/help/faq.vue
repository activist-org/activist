<template>
  <div
    class="bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("_global.faq") }}</Title>
    </Head>
    <PageDocs
      :imgURL="BOOTSTRAP_QUESTION_SQUARE_URL"
      imgAltText="pages._global.faq-img-alt-text"
    >
      <h1 class="responsive-h1 pb-2 font-bold">
        {{ $t("pages.help._global.frequently-asked-questions") }}
      </h1>
      <div class="flex flex-row space-x-3 py-2">
        <Icon
          class="mt-[0.125rem] text-light-link-text dark:text-dark-link-text"
          name="bi:info-circle-fill"
          size="1.25em"
        />
        <p>
          {{ $t("pages.help.faq.subheader-1") }}
          <a
            class="focus-brand link-text items-center"
            href="https://matrix.to/#/#activist_community:matrix.org"
            target="_blank"
          >
            {{ $t("_global.public-matrix-chat-rooms") }}
            <Icon
              name="bi:box-arrow-up-right"
              size="1em"
              style="vertical-align: baseline"
            />
          </a>
          !
        </p>
      </div>
      <p class="responsive-h4 font-bold">
        {{ $t("pages.help.faq.section-1-paragraph-1") }}
      </p>
      <p class="sm:text-lg">
        {{ $t("pages.help.faq.section-1-paragraph-2") }}
      </p>
      <p class="responsive-h4 font-bold">
        {{ $t("pages.help.faq.section-2-paragraph-1") }}
      </p>
      <p class="sm:text-lg">
        {{ $t("pages.help.faq.section-2-paragraph-2") }}
      </p>
      <p class="responsive-h4 font-bold">
        {{ $t("pages.help.faq.section-3-paragraph-1") }}
      </p>
      <p class="sm:text-lg">
        {{ $t("pages.help.faq.section-3-paragraph-2") }}
      </p>
      <p class="responsive-h4 font-bold">
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
      <PageCommunityFooter>
        <BtnRouteInternal
          class="w-full"
          :cta="false"
          label="components.btn-route-internal.return-home"
          linkTo="/"
          fontSize="lg"
          ariaLabel="components.btn-route-internal.return-home-aria-label"
        />
      </PageCommunityFooter>
    </PageDocs>
  </div>
</template>

<script script setup="ts">
import useRouteToName from "~/composables/useRouteToName";

const emit = defineEmits(["routeToName"]);
useRouteToName(emit);
</script>
