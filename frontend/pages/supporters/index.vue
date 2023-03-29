<template>
  <div>
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <div
      class="flex flex-col responsive-py-4 responsive-px-4  text-light-text dark:text-dark-text"
    >
      <h1 class="main-header">Supporters</h1>
      <p class="pt-2 lg:pt-4 xl:pt-6">
        The following is an overview of organizations and individuals that have
        supported the development of activist. Those interested in providing
        support can read more about how they can help
        <NuxtLink
          :to="localePath('/supporters/join')"
          class="focus-brand text-light-cta-orange dark:text-dark-cta-orange hover:underline"
          >here</NuxtLink
        >.
      </p>
      <h2
        class="py-2 lg:py-4 xl:py-6 text-xl sm:text-2xl md:text-3xl xl:text-4xl "
      >
        UNLOCK Accelerator
      </h2>
      <p>
        The following organizations have supported activist via the 2022 edition
        of the
        <a
          href="https://www.wikimedia.de/unlock"
          class="items-center text-light-cta-orange dark:text-dark-cta-orange hover:underline focus-brand"
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
      <h2
        class="py-1 mt-6 text-xl sm:text-2xl md:text-3xl xl:text-4xl lg:py-2 xl:py-3 xl:mt-8"
      >
        Contributors
      </h2>
      <h3
        class="py-1 text-lg sm:text-xl md:text-2xl xl:text-3xl lg:py-2 xl:py-4"
      >
        Design
      </h3>
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
