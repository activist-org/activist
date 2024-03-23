<template>
  <HeaderWebsite class="md:hidden" />
  <div class="grid h-screen grid-cols-1 md:grid-cols-2">
    <Head>
      <Title>{{ $t(page.title) }}</Title>
    </Head>
    <div class="relative hidden md:block">
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
      class="text-light-text dark:text-dark-text bg-light-layer-1 dark:bg-dark-layer-1 h-full"
    >
      <div class="hidden justify-end space-x-6 px-8 py-4 md:flex">
        <DropdownLanguage />
        <BtnRouteInternal
          class="flex max-h-[38px] items-center lg:max-h-[46px]"
          :label="page.label"
          :linkTo="page.link"
          :cta="true"
          fontSize="lg"
          :ariaLabel="page.ariaLabel"
        />
      </div>
      <div class="w-full flex-1 space-y-4 pb-4 pt-16 md:pb-8 md:pt-28">
        <div class="flex items-center justify-center p-4">
          <h1 class="responsive-h1 font-display text-center font-bold">
            {{ $t(page.message) }}
          </h1>
        </div>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const page = computed(() => {
  const isSignIn = route.fullPath?.includes("sign-in");
  return {
    ariaLabel: isSignIn
      ? "pages.auth.sign-in.index.aria-label"
      : "pages.auth.sign-up.index.aria-label",
    label: isSignIn ? "_global.sign-up" : "_global.sign-in",
    link: isSignIn ? "/auth/sign-up" : "/auth/sign-in",
    message: isSignIn
      ? "pages.auth.sign-in.index.welcome-back"
      : "pages.auth.sign-up.index.first-time-welcome",
    title: isSignIn ? "_global.sign-in" : "_global.sign-up",
  };
});
</script>
