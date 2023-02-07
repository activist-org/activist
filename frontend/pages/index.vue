<template>
  <div>
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <LandingPageSplash />
    <LandingPageCommunityBanner />
    <div
      class="flex flex-col mt-4 mb-2 sm:mb-4 sm:mt-10 xl:mt-16 xl:mb-8 2xl:mt-24 2xl:mb-12"
    >
      <LandingPageContent
        contentPosition="left"
        header="get-active-header"
        tagline="get-active-tagline"
        text="get-active-text"
        imageURL="images/landing_page/1_get_active"
        btnText1="learn-more"
        btnURL1="/docs/get-active"
      />
      <LandingPageContent
        contentPosition="right"
        header="get-organized-header"
        tagline="get-organized-tagline"
        text="get-organized-text"
        imageURL="images/landing_page/2_get_organized"
        btnText1="learn-more"
        btnURL1="/docs/get-organized"
      />
      <LandingPageContent
        contentPosition="left"
        header="grow-organization-header"
        tagline="grow-organization-tagline"
        text="grow-organization-text"
        imageURL="images/landing_page/3_grow_your_organization"
        btnText1="learn-more"
        btnURL1="/docs/grow-organization"
      />
      <LandingPageContent
        contentPosition="right"
        header="activist-section-header"
        tagline="activist-section-tagline"
        text="activist-section-text"
        imageURL="images/landing_page/4_activist_icon"
        btnText1="get-in-touch"
        btnURL1="/help/contact"
      />
      <LandingPageContent
        contentPosition="top"
        header="our-supporters-header"
        tagline="our-supporters-tagline"
        text="our-supporters-text"
        btnText1="become-a-supporter"
        btnURL1="/supporters/join"
        btnText2="view-all-supporters"
        btnURL2="/supporters"
        subText="our-supporters-sub-text"
      />
    </div>
  </div>
</template>

<script setup>
const title = ref("Welcome");
</script>
