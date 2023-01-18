<template>
  <div
    class="py-28 w-full flex flex-col space-y-8 bg-light-distinct-bg dark:bg-dark-distinct-bg text-light-text dark:text-dark-text"
  >
    <p class="text-center text-5xl">The platform for activism</p>
    <div class="flex justify-center">
      <p class="max-w-xl text-center text-2xl">
        We’re building a place for people the world over to collaborate on the
        issues that mater most. We’re open-source, community driven and would
        love your feedback! Join our newsletter and we’ll be in touch ✊
      </p>
    </div>
    <div class="flex justify-center rounded-md">
      <NuxtLink to="/about"><CTABtn label="Learn more" fontSize="xl"/></NuxtLink>
    </div>
  </div>
  <div class="h-px mx-auto bg-light-section-div dark:bg-dark-section-div"></div>
</template>
