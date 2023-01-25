<template>
  <div>
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <LandingPageSplash />
    <LandingPageCommunityBanner />
    <div class="flex flex-col my-24">
      <LandingPageContent
        contentPosition="left"
        header="get-active-header"
        tagline="get-active-tagline"
        text="get-active-text"
        btnText1="learn-more"
        btnURL1="/docs/get-active"
      />
      <LandingPageContent
        contentPosition="right"
        header="grow-organization-header"
        tagline="grow-organization-tagline"
        text="grow-organization-text"
        btnText1="learn-more"
        btnURL1="/docs/grow-organizations"
      />
      <LandingPageContent
        contentPosition="left"
        header="coordinate-collaborate-header"
        tagline="coordinate-collaborate-tagline"
        text="coordinate-collaborate-text"
        btnText1="learn-more"
        btnURL1="/docs/coordinate"
      />
      <LandingPageActivistSection
        contentPosition="right"
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
