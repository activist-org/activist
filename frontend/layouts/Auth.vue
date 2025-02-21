<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
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
    <div class="h-full bg-layer-1 text-primary-text">
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

const aboveMediumBP = useBreakpoint("md");

const page = computed(() => {
  const authRoutes = [
    {
      route: "sign-in",
      btnAriaLabel: "i18n._global.auth.sign_up_aria_label",
      btnLabel: "i18n._global.sign_up",
      btnLink: "/auth/sign-up",
      message: "i18n.layouts.auth.sign_in_welcome_back",
      title: "i18n._global.sign_in",
    },
    {
      route: "sign-up",
      btnAriaLabel: "i18n._global.auth.sign_in_aria_label",
      btnLabel: "i18n._global.sign_in",
      btnLink: "/auth/sign-in",
      message: "i18n.layouts.auth.sign_up_welcome",
      title: "i18n._global.sign_up",
    },
    {
      route: "reset-password",
      btnAriaLabel: "i18n._global.auth.sign_in_aria_label",
      btnLabel: "i18n._global.sign_in",
      btnLink: "/auth/sign-in",
      message: "i18n._global.auth.reset_password_forgot_password",
      title: "i18n._global.auth.reset_password",
    },
    {
      route: "set-password",
      btnAriaLabel: "i18n._global.auth.sign_in_aria_label",
      btnLabel: "i18n._global.sign_in",
      btnLink: "/auth/sign-in",
      message: "i18n.layouts.auth.set_new_password",
      title: "i18n.layouts.auth.set_new_password",
    },
  ];

  const defaultRoute = {
    route: "index",
    btnAriaLabel: "",
    btnLabel: "",
    btnLink: "",
    message: "i18n.layouts.auth.welcome",
    title: "i18n.layouts.auth.auth",
  };

  return (
    authRoutes.find((authRoute) => route.fullPath?.includes(authRoute.route)) ||
    defaultRoute
  );
});
</script>
