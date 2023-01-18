<template>
  <div>
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <LandingPageSplash />
    <div class="flex flex-col px-20 my-36 space-y-36 items-center">
      <LandingPageContent
        contentPosition="left"
        header="Get Active"
        tagline="Join organizations near you"
        text="Based on your skills, location and the issues you care about most, find the organizations that are working to create lasting change. Support your cause in any way you can, learn from experienced organizers, and stay informed on relevant developments. You are not alone in trying to make a difference."
        btnText1="Learn more"
        btnURL1="/docs/get-active"
      />
      <LandingPageContent
        contentPosition="right"
        header="Grow Your Organization"
        tagline="Tools to Broaden Your Reach"
        text="From the grassroots, to experienced NGOs to research institutions. Connect with potential supporters that are focussed on what you're trying to change. Share valuable resources, easily onboard new members, set transparent goals, then define and assign roles to achieve them."
        btnText1="Learn more"
        btnURL1="/docs/grow-organizations"
      />
      <LandingPageContent
        contentPosition="left"
        header="Coordinate and Collaborate"
        tagline="Efficient and Effective Actions"
        text="No matter if you're collecting signatures, planning a workshop, hosting a discussion, or organizing a protest - you can create an event for it. Connect with allies to have the greatest possible effect, with pre and post events establishing and maintaining momentum."
        btnText1="Learn more"
        btnURL1="/docs/coordinate"
      />
      <LandingPageActivistSection
        contentPosition="right"
        btnText1="Get in touch"
        btnURL1="/help/contact"
      />
      <LandingPageContent
        contentPosition="top"
        header="Our Supporters"
        tagline="Sponsors and backers of our work"
        text="activist is free and open-source software developed by a non-profit community. Public support directly sustains development of the platform."
        btnText1="Become a supporter"
        btnURL1="/help/support-activist"
        btnText2="View all supporters"
        btnURL2="/supporters"
      />
    </div>
  </div>
</template>

<script setup>
const title = ref("Welcome!");
</script>
