<template>
  <div>
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <LandingPageSplash />
    <LandingPageCommunityBanner />
    <div class="flex flex-col mt-10 mb-4 xl:mt-16 xl:mb-8 2xl:mt-24 2xl:mb-12">
      <LandingPageContent
        contentPosition="left"
        header="get-active-header"
        tagline="get-active-tagline"
        text="get-active-text"
        imageURL=""
        btnText1="learn-more"
        btnURL1="/docs/get-active"
      />
      <LandingPageContent
        contentPosition="right"
        header="grow-organization-header"
        tagline="grow-organization-tagline"
        text="grow-organization-text"
        imageURL=""
        btnText1="learn-more"
        btnURL1="/docs/grow-organizations"
      />
      <LandingPageContent
        contentPosition="left"
        header="coordinate-collaborate-header"
        tagline="coordinate-collaborate-tagline"
        text="coordinate-collaborate-text"
        imageURL=""
        btnText1="learn-more"
        btnURL1="/docs/coordinate"
      />
      <LandingPageContent
        contentPosition="right"
        header="activist-section-header"
        tagline="activist-section-tagline"
        text="activist-section-text"
        imageURL="IconsActivist"
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
const title = ref("Welcome!");
</script>
