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
        header="_global.get-active"
        tagline="pages.index.get-active-tagline"
        text="pages.index.get-active-text"
        imageURL="/images/content_pages/art/get_active"
        imageAltText="pages._global.get-active-img-alt-text"
        btnText1="components.btn-labeled.learn-more"
        btnURL1="/docs/get-active"
        btnAriaLabel1="pages.index.get-active-btn-alt-text"
      />
      <LandingContent
        contentPosition="right"
        header="_global.get-organized"
        tagline="pages.index.get-organized-tagline"
        text="pages.index.get-organized-text"
        imageURL="/images/content_pages/art/get_organized"
        imageAltText="pages._global.get-organized-img-alt-text"
        btnText1="components.btn-labeled.learn-more"
        btnURL1="/docs/get-organized"
        btnAriaLabel1="pages.index.get-organized-btn-alt-text"
      />
      <LandingContent
        contentPosition="left"
        header="pages.index.grow-organization-header"
        tagline="pages.index.grow-organization-tagline"
        text="pages.index.grow-organization-text"
        imageURL="/images/content_pages/art/grow_organization"
        imageAltText="pages._global.grow-org-img-alt-text"
        btnText1="components.btn-labeled.learn-more"
        btnURL1="/docs/grow-organization"
        btnAriaLabel1="pages.index.grow-organization-btn-alt-text"
      />
      <LandingTechBanner />
      <LandingContent
        contentPosition="right"
        header="pages._global.about-us"
        tagline="pages.index.activist-section-tagline"
        text="pages.index.activist-section-text"
        imageURL="/images/content_pages/icons/activist_icon"
        imageAltText="_global.activist-icon-img-alt-text"
        btnText1="components.btn-labeled.learn-more"
        btnURL1="/about/activist"
        btnAriaLabel1="pages.index.activist-section-btn-alt-text"
      />
      <LandingContent
        contentPosition="top"
        header="pages._global.our-supporters"
        tagline="pages.index.our-supporters-tagline"
        text="pages.index.our-supporters-text"
        imageAltText=""
        btnText1="pages._global.become-supporter"
        btnURL1="/supporters/join"
        btnAriaLabel1="pages.index.our-supporters-btn-become-alt-text"
        btnText2="pages.index.view-all-supporters"
        btnURL2="/supporters/showcase"
        btnAriaLabel2="pages.index.our-supporters-btn-view-alt-text"
        subText="pages.index.our-supporters-sub-text"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
console.log(
  '                     #K   @P        -@C        @r\r\n     g@NNg#@ ,g@NNg N@@@K @P\'@w  ,@C @F,g@NNwJ@@@@r     Why are looking at the console?\r\n    @Mg, !$@ @C   -  #K   @P ]@, @P  @P]@wg;  -@F       When you can checkout our repo on:\r\n    %g%@N;@@ @g   ,  $K   @P  ]@@@   @P ,-"]@ -@F       https://github.com/activist-org/activist\r\n     "*MM**M "*MNM"  \'*MF M~   *M    MC\'*MMM*  "*M`'
);
//                  #K   @P        -@C        @r
// g@NNg#@ ,g@NNg N@@@K @P'@w  ,@C @F,g@NNwJ@@@@r      Why are looking at the console?
// @Mg, !$@ @C   -  #K   @P ]@, @P  @P]@wg;  -@F       When you can checkout our repo on:
// %g%@N;@@ @g   ,  $K   @P  ]@@@   @P ,-"]@ -@F       https://github.com/activist-org/activist
// "*MM**M "*MNM"  '*MF M~   *M    MC'*MMM*  "*M`
</script>
