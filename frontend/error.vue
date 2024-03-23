<template>
  <HeaderWebsite />
  <div class="flex h-full bg-light-layer-0 dark:bg-dark-layer-0">
    <Head>
      <Title>{{ $t("pages.error.title") }}</Title>
    </Head>
    <div
      class="container relative mx-auto my-[10%] flex flex-col items-center justify-center space-x-0 space-y-10 text-center md:flex-row md:space-x-8 md:space-y-0 md:text-left xl:space-x-12"
    >
      <div
        class="flex flex-wrap font-['Copperplate_Gothic_Light'] text-[125px] font-black text-light-text dark:text-dark-text md:text-[175px] lg:text-[200px]"
      >
        {{ error.statusCode }}
      </div>
      <div
        class="h-[2px] w-[120px] bg-light-distinct-text dark:bg-dark-distinct-text md:h-[200px] md:w-[2px]"
      ></div>
      <div
        class="flex max-w-[350px] flex-col items-center text-left md:items-start"
      >
        <div
          class="mt-4 flex flex-wrap font-['Copperplate_Gothic_Light'] text-lg text-light-text dark:text-dark-text md:mt-0 md:text-xl"
        >
          {{ $t("pages.error.message") }}
        </div>
        <div
          class="my-8 flex flex-wrap justify-center break-all text-light-distinct-text dark:text-dark-distinct-text md:my-6 md:text-lg"
        >
          {{ error.message }}
        </div>
        <BtnRouteInternal
          :cta="true"
          label="components.btn-route-internal.return-home"
          linkTo="/"
          fontSize="lg"
          ariaLabel="components.btn-route-internal.return-home-aria-label"
        />
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
class HTTPError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

defineProps<{
  error: HTTPError;
}>();
</script>
