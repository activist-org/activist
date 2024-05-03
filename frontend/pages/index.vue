<template>
  <div class="overflow-hidden bg-light-layer-0 dark:bg-dark-layer-0">
    <Head>
      <Title>{{ $t("pages.index.title") }}</Title>
    </Head>
    <LandingSplash />
    <LandingCommunityBanner />
    <div
      class="mb-2 mt-4 flex flex-col sm:mb-4 sm:mt-10 xl:mb-8 xl:mt-16 2xl:mb-12 2xl:mt-24"
    >
      <LandingContent
        contentPosition="left"
        header="_global.get-active"
        tagline="pages.index.get-active-tagline"
        text="pages.index.get-active-text"
        :imageURL="GET_ACTIVE_IMAGE_URL"
        imageAltText="pages._global.get-active-img-alt-text"
        btnText1="components.btn-route-internal.learn-more"
        btnURL1="/docs/get-active"
        btnAriaLabel1="components.btn-route-internal.get-active-aria-label"
      />
      <LandingContent
        contentPosition="right"
        header="_global.get-organized"
        tagline="pages.index.get-organized-tagline"
        text="pages.index.get-organized-text"
        :imageURL="GET_ORGANIZED_IMAGE_URL"
        imageAltText="pages._global.get-organized-img-alt-text"
        btnText1="components.btn-route-internal.learn-more"
        btnURL1="/docs/get-organized"
        btnAriaLabel1="components.btn-route-internal.get-organized-aria-label"
      />
      <LandingContent
        contentPosition="left"
        header="pages.index.grow-organization-header"
        tagline="pages.index.grow-organization-tagline"
        text="pages.index.grow-organization-text"
        :imageURL="GROW_ORGANIZATION_IMAGE_URL"
        imageAltText="pages._global.grow-organization-img-alt-text"
        btnText1="components.btn-route-internal.learn-more"
        btnURL1="/docs/grow-organization"
        btnAriaLabel1="components.btn-route-internal.grow-organization-aria-label"
      />
      <LandingTechBanner />
      <LandingContent
        contentPosition="right"
        header="pages._global.about-us"
        tagline="pages.index.activist-section-tagline"
        text="pages.index.activist-section-text"
        imageURL="/icons/activist/activist_icon"
        imageAltText="_global.activist-icon-img-alt-text"
        btnText1="components.btn-route-internal.learn-more"
        btnURL1="/about/activist"
        btnAriaLabel1="pages.index.activist-section-btn-aria-label"
      />
      <LandingContent
        contentPosition="top"
        header="pages._global.our-supporters"
        tagline="pages.index.our-supporters-tagline"
        text="pages.index.our-supporters-text"
        imageAltText=""
        btnText1="pages._global.become-supporter"
        btnURL1="/supporters/join"
        btnAriaLabel1="pages.index.our-supporters-btn-become-aria-label"
        btnText2="pages.index.view-all-supporters"
        btnURL2="/supporters/showcase"
        btnAriaLabel2="pages.index.our-supporters-btn-view-aria-label"
        subText="pages.index.our-supporters-sub-text"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import useRouteToName from "~/composables/useRouteToName";

const emit = defineEmits(["routeToName"]);
useRouteToName(emit);
</script>
