<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <HeaderWebsite />
  <div class="flex h-full bg-layer-0">
    <Head>
      <Title>{{ $t("i18n.error.title") }}</Title>
    </Head>
    <div
      class="container relative mx-auto my-[10%] flex flex-col items-center justify-center space-x-0 space-y-10 text-center md:flex-row md:space-x-8 md:space-y-0 md:text-left xl:space-x-12"
    >
      <p
        class="flex flex-wrap font-['Copperplate_Gothic_Light'] text-[125px] font-black md:text-[175px] lg:text-[200px]"
      >
        {{ error.statusCode }}
      </p>
      <div
        class="h-[2px] w-[120px] bg-distinct-text md:h-[200px] md:w-[2px]"
      ></div>
      <div
        class="flex max-w-[350px] flex-col items-center text-left md:items-start"
      >
        <p
          class="mt-4 flex flex-wrap font-['Copperplate_Gothic_Light'] text-lg md:mt-0 md:text-xl"
        >
          {{ $t("i18n.error.message") }}
        </p>
        <div
          class="my-8 flex flex-wrap justify-center break-all text-distinct-text md:my-6 md:text-lg"
        >
          {{ error.message }}
        </div>
        <BtnRouteInternal
          ariaLabel="i18n._global.return_home_aria_label"
          :cta="true"
          fontSize="lg"
          label="i18n._global.return_home"
          linkTo="/"
        />
      </div>
    </div>
  </div>
  <FooterWebsite />
</template>

<script setup lang="ts">

defineProps<{
  error: HTTPError;
}>();
</script>
