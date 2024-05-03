<template>
  <div
    class="bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("_global.imprint") }}</Title>
    </Head>
    <PageDocs
      imgURL="/images/content_pages/icons/bootstrap_info_circle"
      imgAltText="pages.about._global.imprint-img-alt-text"
    >
      <h1 class="responsive-h1 pb-2 font-bold">
        {{ $t("_global.imprint") }}
      </h1>
      <div class="flex flex-row space-x-3 py-2">
        <Icon
          class="mt-[0.125rem] text-light-link-text dark:text-dark-link-text"
          name="bi:info-circle-fill"
          size="1.25em"
        />
        <p>
          {{ $t("pages.about.imprint.subheader-1") }}
          <NuxtLink
            class="focus-brand link-text items-center"
            to="/help/contact"
          >
            {{ $t("pages._global.contact-page") }}
            <Icon
              name="bi:box-arrow-up-right"
              size="1em"
              style="vertical-align: baseline"
            />
          </NuxtLink>
          {{ $t("pages.about.imprint.subheader-3") }}
        </p>
      </div>
      <p>
        {{ $t("pages.about.imprint.section-1-paragraph-1") }}
      </p>
      <p>
        {{ $t("pages.about.imprint.section-1-paragraph-2") }}
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
