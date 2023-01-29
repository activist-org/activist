<template>
  <Head>
    <Title>{{ title }}</Title>
  </Head>
  <h1 class="p-8 text-3xl md:p-6 lg:p-10 xl:p-14 sm:text-3xl lg:text-4xl text-light-text dark:text-dark-text">
    Frequently Asked Questions
  </h1>
  <div class="flex-col pb-8 mx-8 md:mx-6 lg:mx-10 xl:mx-14 md:pb-6 lg:pb-10 xl:pb-14 space-y-3 md:space-y-4 text-light-text dark:text-dark-text">
    <p class="text-lg font-semibold sm:text-xl text-light-special-text dark:text-dark-special-text">
      Q: What does the activist "a" mean?
    </p>
    <p class="sm:text-lg">
      The center of the letter represents an arrow that points left-center from the top. This symbolizes our community and direction: that we want to work with the left and center of the political spectrum and value a democratic movement of power down to the people. Other meanings are welcome :D
    </p>
    <p class="pt-2 text-lg font-semibold md:pt-4 sm:text-xl text-light-special-text dark:text-dark-special-text">
      Q: How does activist plan to prevent abuse?
    </p>
    <p class="sm:text-lg">
      The big focus of activist is organizations. We will start with a select few organizations based in Berlin where the core team is located,
      with further organizations being added through applications that need approval from the community. Users themselves will have a limited scope of interaction if they're not in an organization. When we get to a point where public discussions are happening, a user will only be able to participate if they're a member of an organization.
    </p>
    <p class="pt-2 text-lg font-semibold md:pt-4 sm:text-xl text-light-special-text dark:text-dark-special-text">
      Q: What about privacy?
    </p>
    <p class="sm:text-lg">
      Thank you for asking! Privacy is a major concern for the team as we understand that activism can be very dangerous.
      Working in the open allows our code to be checked for vulnerabilities, and we welcome feedback in this regard. Between
      functionality and privacy we will always choose the latter. This means that some features of activist will take longer
      to make sure that they're created in a way that keeps people safe.
    </p>
  </div>
</template>

<script setup>
const title = ref("FAQ");
</script>
