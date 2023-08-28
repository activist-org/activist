<template>
  <div class="overflow-hidden bg-light-content dark:bg-dark-content">
    <Head>
      <Title>{{ $t("pages.index.title") }}</Title>
    </Head>
    <LandingSplash />
    <LandingCommunityBanner />
    <div
      class="flex flex-col mt-4 mb-2 sm:mb-4 sm:mt-10 xl:mt-16 xl:mb-8 2xl:mt-24 2xl:mb-12"
    >
      <LandingContent
        contentPosition="left"
        header="pages.index.get-active-header"
        tagline="pages.index.get-active-tagline"
        text="pages.index.get-active-text"
        imageURL="/images/content_pages/art/get_active"
        altText="Drawing of a fist raised."
        btnText1="Learn more"
        btnURL1="/docs/get-active"
        btnAlternateText1="pages.index.get-active-btn-alt-text"
      />
      <LandingContent
        contentPosition="right"
        header="pages.index.get-organized-header"
        tagline="pages.index.get-organized-tagline"
        text="pages.index.get-organized-text"
        imageURL="/images/content_pages/art/get_organized"
        altText="Drawing of fists in a circle pointed at the center."
        btnText1="Learn more"
        btnURL1="/docs/get-organized"
        btnAlternateText1="pages.index.get-organized-btn-alt-text"
      />
      <LandingContent
        contentPosition="left"
        header="pages.index.grow-organization-header"
        tagline="pages.index.grow-organization-tagline"
        text="pages.index.grow-organization-text"
        imageURL="/images/content_pages/art/grow_organization"
        altText="Drawing of fists raised in a group."
        btnText1="Learn more"
        btnURL1="/docs/grow-organization"
        btnAlternateText1="pages.index.grow-organization-btn-alt-text"
      />
      <LandingTechBanner />
      <LandingContent
        contentPosition="right"
        header="pages.index.activist-section-header"
        tagline="pages.index.activist-section-tagline"
        text="pages.index.activist-section-text"
        imageURL="/images/content_pages/icons/activist_icon"
        altText="The activist icon: a lower case letter a with a half circle pointing down and to the left in the center."
        btnText1="Learn more"
        btnURL1="/about"
        btnAlternateText1="pages.index.activist-section-btn-alt-text"
      />
      <LandingContent
        contentPosition="top"
        header="pages.index.our-supporters-header"
        tagline="pages.index.our-supporters-tagline"
        text="pages.index.our-supporters-text"
        btnText1="pages.index.become-a-supporter"
        btnURL1="/supporters/join"
        btnAlternateText1="pages.index.our-supporters-btn-become-alt-text"
        btnText2="pages.index.view-all-supporters"
        btnURL2="/supporters"
        btnAlternateText2="pages.index.our-supporters-btn-view-alt-text"
        subText="pages.index.our-supporters-sub-text"
      />
    </div>
  </div>
</template>

<script setup lang="ts"></script>
