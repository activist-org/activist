<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <Head>
      <Title>{{ title }}</Title>
    </Head>
    <div class="flex flex-col space-y-4 responsive-py-4 responsive-px-5">
      <h1 class="font-bold responsive-h1">Supporters</h1>
      <p class="pt-2 lg:pt-4 xl:pt-6">
        The following is an overview of organizations and individuals that have
        supported the development of activist. Those interested in providing
        support can read more about how they can help on the
        <NuxtLink
          :to="localePath('/supporters/join')"
          class="focus-brand link-text"
          >become a supporter page</NuxtLink
        >.
      </p>
      <h2 class="font-bold responsive-py-1 responsive-h3">
        UNLOCK Accelerator
      </h2>
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
        <GridSupporters class="mt-6 xl:mt-8" />
      </div>
      <h2 class="font-bold responsive-py-1 responsive-h3">Contributors</h2>
      <h3 class="font-bold responsive-h4">Development</h3>
      <p class="space-x-1">
        activist has proudly developed in the open from its inception. This
        project would not be what it is without the support of our open-source
        community. Thank you to all our
        <a
          href="https://github.com/activist-org/activist/graphs/contributors"
          class="focus-brand link-text"
          target="_blank"
          >contributors on GitHub
          <Icon
            name="bi:box-arrow-up-right"
            size="1em"
            style="vertical-align: baseline"
          />
        </a>
        <Icon
          name="bi:heart-fill"
          size="1em"
          style="vertical-align: baseline"
        />
      </p>
      <a href="https://github.com/activist-org/activist/graphs/contributors">
        <img src="https://contrib.rocks/image?repo=activist-org/activist" />
      </a>
      <h3 class="pt-4 font-bold responsive-h4">Design</h3>
      <p>activist has received design support from many individuals.</p>
      <!-- <ul class="py-4 pl-4 space-y-2"></ul> -->
      <p class="text-light-special-text dark:text-dark-special-text">
        Thanks to our anonymous contributors!
      </p>
    </div>
  </div>
</template>

<script setup>
const title = ref("Supporters");
</script>
