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
  const authRoutes = [
    {
      route: "sign-in",
      btnAriaLabel: "_global.auth.sign-up-aria-label",
      btnLabel: "_global.sign-up",
      btnLink: "/auth/sign-up",
      message: "layouts.auth.sign-in-welcome-back",
      title: "_global.sign-in",
    },
    {
      route: "sign-up",
      btnAriaLabel: "_global.auth.sign-in-aria-label",
      btnLabel: "_global.sign-in",
      btnLink: "/auth/sign-in",
      message: "layouts.auth.sign-up-first-time-welcome",
      title: "_global.sign-up",
    },
    {
      route: "reset-password",
      btnAriaLabel: "_global.auth.sign-in-aria-label",
      btnLabel: "_global.sign-in",
      btnLink: "/auth/sign-in",
      message: "layouts.auth.reset-password-forgot-password",
      title: "_global.reset-password",
    },
    {
      route: "set-password",
      btnAriaLabel: "_global.auth.sign-in-aria-label",
      btnLabel: "_global.sign-in",
      btnLink: "/auth/sign-in",
      message: "layouts.auth.set-password-set-new-password",
      title: "_global.set-new-password",
    },
  ];

  const defaultRoute = {
    route: "index",
    btnAriaLabel: "",
    btnLabel: "",
    btnLink: "",
    message: "layouts.auth.welcome",
    title: "pages.auth.index.auth",
  };

  return (
    authRoutes.find((authRoute) => route.fullPath?.includes(authRoute.route)) ||
    defaultRoute
  );
});
</script>
