<template>
  <div>
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <div
      class="flex flex-col responsive-py-4 responsive-px-4 text-light-text dark:text-dark-text"
    >
      <h1 class="main-header">Supporters</h1>
      <p class="pt-2 lg:pt-4 xl:pt-6">
        The following is an overview of organizations and individuals that have
        supported the development of activist. Those interested in providing
        support can read more about how they can help
        <NuxtLink
          :to="localePath('/supporters/join')"
          class="focus-brand link-text"
          >here</NuxtLink
        >.
      </p>
      <h2 class="responsive-h2">UNLOCK Accelerator</h2>
      <p>
        The following organizations have supported activist via the 2022 edition
        of the
        <a
          href="https://www.wikimedia.de/unlock"
          class="items-center focus-brand link-text"
          target="_blank"
        >
          Wikimedia UNLOCK accelerator
          <Icon
            name="bi:box-arrow-up-right"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        . UNLOCK supports open-source software projects and non- technical
        projects under free licenses. The UNLOCK Accelerator is committed to
        promoting solutions that make the world's knowledge more diverse, more
        accessible and inclusive for everyone.
      </p>
      <div class="flex items-center justify-center">
        <SupportersGrid class="mt-6 xl:mt-8" />
      </div>
      <h2 class="responsive-h2">Contributors</h2>
      <h3 class="responsive-h3">Design</h3>
      <p>activist has received design support from many individuals.</p>
      <ul class="py-4 pl-4 space-y-2"></ul>
      <p class="text-light-special-text dark:text-dark-special-text">
        Thanks to our anonymous contributors!
      </p>
    </div>
  </div>
</template>

<script setup>
const title = ref("Supporters");
</script>
