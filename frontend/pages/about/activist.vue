<template>
  <div
    class="bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("pages._global.about-us") }}</Title>
    </Head>
    <PageDocs
      imgURL="/images/content_pages/icons/activist_icon"
      imgAltText="_global.activist-icon-img-alt-text"
    >
      <h1 class="responsive-h1 pb-2 font-bold">
        {{ $t("pages.about.activist.header") }}
      </h1>
      <div class="flex flex-row space-x-3 py-2">
        <Icon
          class="mt-[0.125rem] text-light-link-text dark:text-dark-link-text"
          name="bi:info-circle-fill"
          size="1.25em"
        />
        <p>
          {{ $t("pages._global.see-the") }}
          <a
            class="focus-brand link-text items-center"
            href="https://www.figma.com/file/I9McFfaLu1RiiWp5IP3YjE/activist_public_designs?node-id=805%3A231&t=vNWHCPdiq5EbPaO9-1"
            target="_blank"
          >
            {{ $t("pages.about.activist.subheader-2") }}
            <Icon
              name="bi:box-arrow-up-right"
              size="1em"
              style="vertical-align: baseline"
            />
          </a>
          {{ $t("pages._global.to-learn-more") }}
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
      <PageCommunityFooter>
        <BtnRouteExternal
          class="w-full"
          :cta="true"
          label="components.btn-route-external.request-access"
          :linkTo="REQUEST_ACCESS_URL"
          fontSize="lg"
          ariaLabel="
                components.btn-route-external.request-access-aria-label
              "
        />
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
