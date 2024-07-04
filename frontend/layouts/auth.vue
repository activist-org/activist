<template>
  <HeaderWebsite v-if="!aboveMediumBP" />
  <div class="grid h-screen grid-cols-1 md:grid-cols-2">
    <Head>
      <Title>{{ $t(page.title) }}</Title>
    </Head>
    <div v-if="aboveMediumBP" class="relative">
      <div class="flex h-full w-full items-center justify-center">
        <div
          class="relative z-0 mb-6 h-16 w-64 overflow-y-hidden xl:h-24 xl:w-96"
        >
          <LogoActivist
            class="z-1 absolute inset-0 flex items-center justify-center overflow-clip"
          />
        </div>
      </div>
    </div>
    <div
      class="h-full bg-light-layer-1 text-light-text dark:bg-dark-layer-1 dark:text-dark-text"
    >
      <div v-if="aboveMediumBP" class="flex justify-end space-x-6 px-8 py-4">
        <DropdownLanguage />
        <BtnRouteInternal
          v-if="page.route != 'index'"
          class="flex max-h-[30px] items-center lg:max-h-[38px]"
          :label="page.btnLabel"
          :linkTo="page.btnLink"
          :cta="true"
          fontSize="lg"
          :ariaLabel="page.btnAriaLabel"
        />
      </div>
      <div class="w-full flex-1 space-y-4 pb-4 pt-16 md:pb-8 md:pt-28">
        <div class="flex items-center justify-center p-4">
          <h1 class="responsive-h1 text-center font-display font-bold">
            {{ $t(page.message) }}
          </h1>
        </div>
      </div>
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
import useBreakpoint from "~/composables/useBreakpoint";

const aboveMediumBP = useBreakpoint("md");

const page = computed(() => {
  const isSignIn = route.fullPath?.includes("sign-in");
  const isSignUp = route.fullPath?.includes("sign-up");
  return {
    route: isSignIn ? "sign-in" : isSignUp ? "sign-up" : "index",
    btnAriaLabel: isSignIn
      ? "_global.auth.sign-up-aria-label"
      : isSignUp
        ? "_global.auth.sign-in-aria-label"
        : "",
    btnLabel: isSignIn ? "_global.sign-up" : isSignUp ? "_global.sign-in" : "",
    btnLink: isSignIn ? "/auth/sign-up" : isSignUp ? "/auth/sign-in" : "",
    message: isSignIn
      ? "layouts.auth.sign-in-welcome-back"
      : isSignUp
        ? "layouts.auth.sign-up-first-time-welcome"
        : "layouts.auth.welcome",
    title: isSignIn
      ? "_global.sign-in"
      : isSignUp
        ? "_global.sign-up"
        : "pages.auth.index.auth",
  };
});
</script>
