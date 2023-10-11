<template>
  <HeaderWebsite class="md:hidden" />
  <div class="grid grid-cols-1 md:grid-cols-2 h-screen">
    <Head>
      <Title>{{ $t(page.title) }}</Title>
    </Head>
    <div class="relative hidden md:block">
      <LogoActivist
        class="absolute inset-0 flex items-center justify-center mb-10 md:px-20 lg:px-28 xl:px-40"
      />
    </div>
    <div
      class="h-full text-light-text dark:text-dark-text bg-light-distinct dark:bg-dark-distinct"
    >
      <div class="hidden space-x-6 justify-end py-4 px-8 md:flex">
        <DropdownLanguage />
        <BtnLabeled
          class="flex items-center max-h-[38px] lg:max-h-[46px]"
          :label="page.label"
          :linkTo="page.link"
          :cta="true"
          fontSize="lg"
          :ariaLabel="page.ariaLabel"
        />
      </div>
      <div class="flex-1 w-full pt-16 md:pt-24 pb-4 md:pb-8 space-y-4">
        <div class="flex items-center justify-center p-4">
          <h1 class="text-center responsive-h1 font-bold font-display">
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
    label: isSignIn
      ? "pages.auth.sign-in.index.sign-up"
      : "pages.auth.sign-up.index.sign-in",
    link: isSignIn ? "/auth/sign-up" : "/auth/sign-in",
    message: isSignIn
      ? "pages.auth.sign-in.index.welcome-back"
      : "pages.auth.sign-up.index.first-time-welcome",
    title: isSignIn
      ? "pages.auth.sign-up.index.title"
      : "pages.auth.sign-in.index.title",
  };
});
</script>
