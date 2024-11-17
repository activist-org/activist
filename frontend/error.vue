<template>
  <HeaderWebsite />
  <div class="bg-layer-0 flex h-full">
    <Head>
      <Title>{{ $t("error.title") }}</Title>
    </Head>
    <div
      class="container relative mx-auto my-[10%] flex flex-col items-center justify-center space-x-0 space-y-10 text-center md:flex-row md:space-x-8 md:space-y-0 md:text-left xl:space-x-12"
    >
      <div
        class="text-primary-text flex flex-wrap font-['Copperplate_Gothic_Light'] text-[125px] font-black md:text-[175px] lg:text-[200px]"
      >
        {{ error.statusCode }}
      </div>
      <div
        class="bg-distinct-text h-[2px] w-[120px] md:h-[200px] md:w-[2px]"
      ></div>
      <div
        class="flex max-w-[350px] flex-col items-center text-left md:items-start"
      >
        <div
          class="text-primary-text mt-4 flex flex-wrap font-['Copperplate_Gothic_Light'] text-lg md:mt-0 md:text-xl"
        >
          {{ $t("error.message") }}
        </div>
        <div
          class="text-distinct-text my-8 flex flex-wrap justify-center break-all md:my-6 md:text-lg"
        >
          {{ error.message }}
        </div>
        <BtnRouteInternal
          :cta="true"
          label="_global.return_home"
          linkTo="/"
          fontSize="lg"
          ariaLabel="_global.return_home_aria_label"
        />
      </div>
    </div>
  </div>
  <FooterWebsite />
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
