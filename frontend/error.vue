<template>
  <HeaderWebsite />
  <div class="flex h-full bg-light-content dark:bg-dark-content">
    <Head>
      <Title>{{ $t("pages.error.title") }}</Title>
    </Head>
    <div
      class="relative my-[10%] mx-auto items-center justify-center md:text-left text-center container flex flex-col md:flex-row md:space-x-8 xl:space-x-12 space-x-0 space-y-10 md:space-y-0"
    >
      <div
        class="md:text-[175px] lg:text-[200px] text-light-text dark:text-dark-text text-[125px] flex flex-wrap font-black font-['Copperplate_Gothic_Light']"
      >
        {{ error.statusCode }}
      </div>
      <div
        class="bg-light-special-text dark:bg-dark-special-text md:w-[2px] md:h-[200px] w-[120px] h-[2px]"
      ></div>
      <div
        class="text-left flex flex-col items-center md:items-start max-w-[350px]"
      >
        <div
          class="text-lg md:text-xl text-light-text dark:text-dark-text font-['Copperplate_Gothic_Light'] mt-4 md:mt-0 flex flex-wrap"
        >
          {{ $t("pages.error.message") }}
        </div>
        <div
          class="flex flex-wrap justify-center my-8 break-all md:my-6 md:text-lg text-light-special-text dark:text-dark-special-text"
        >
          {{ error.message }}
        </div>
        <BtnLabeled
          :cta="true"
          label="components.btn-labeled.return-home"
          linkTo="/"
          fontSize="lg"
          ariaLabel="components.btn-labeled.return-home-aria-label"
        />
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
defineProps(["error"]);
</script>
