<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <div class="flex flex-col space-y-4 responsive-py-4 responsive-px-5">
      <h1 class="font-bold responsive-text-4">Become a supporter</h1>
      <p>
        activist needs support from our community in countless ways. The
        following details how organizations and individuals can help the team
        develop the platform to empower activists to have as much impact as
        possible. A full list of activist's current supporters can be found
        <NuxtLink :to="localePath('/supporters')" class="focus-brand link-text"
          >here</NuxtLink
        >.
      </p>
      <h2 class="font-bold responsive-text-1">Contribute on GitHub</h2>
      <p>
        Visit the
        <a
          href="https://www.wikimedia.de/unlock"
          class="focus-brand link-text"
          target="_blank"
          >source code on GitHub
          <Icon
            name="bi:box-arrow-up-right"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        to get involved!
      </p>
      <h2 class="font-bold responsive-text-1">
        Sponsor activist's development
      </h2>
      <p>
        Visit our
        <a href="" class="focus-brand link-text" target="_blank"
          >page on elinor
          <Icon
            name="bi:box-arrow-up-right"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        to donate today. Thank you for your support!
      </p>
      <h2 class="font-bold responsive-text-1">
        Share activist in your network
      </h2>
      <p>
        Please contact the team afterwards via our
        <NuxtLink
          :to="localePath('/help/contact')"
          class="focus-brand link-text"
          >contact page</NuxtLink
        >
        so that we're aware and can help spread the word!
      </p>
      <h2 class="font-bold responsive-text-1">
        Help activist with your skills
      </h2>
      <p>
        Be it artistic contributions or legal consulting, we'd love to discuss
        how we could work together. We'd be happy to give credit in the
        Contributors section of our
        <NuxtLink :to="localePath('/supporters')" class="focus-brand link-text"
          >supporters page</NuxtLink
        >.
      </p>
      <h2 class="font-bold responsive-text-1">Localization</h2>
      <p>
        Visit our
        <a
          href="https://explore.transifex.com/activist-org/activist"
          class="focus-brand link-text"
          target="_blank"
          >Transifex
          <Icon
            name="bi:box-arrow-up-right"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        page to help today.
      </p>
    </div>
  </div>
</template>

<script setup>
const title = ref("Become a Supporter");
</script>
