<script setup lang="ts">
const route = useRoute();

const page = computed(() => {
  const isSignIn = route.fullPath?.includes("sign-in");
  // TODO: Please change the empty string when developing the sign up page
  return {
    label: isSignIn ? "pages.auth.sign-in.index.sign-up" : "",
    message: isSignIn ? "pages.auth.sign-in.index.welcome-back" : "",
    icon: isSignIn ? "noto-v1:waving-hand" : "",
  };
});
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 h-screen">
    <!--  TODO: Think or ask about theme selection -->
    <div class="relative hidden md:block">
      <LogoActivist
        class="absolute inset-0 flex items-center justify-center md:px-16 lg:px-32 xl:px-56"
      />
    </div>
    <div class="bg-white h-full">
      <div class="flex space-x-6 justify-end py-4 px-8">
        <SelectorLanguage />
        <BtnLabeled
          class="flex items-center max-h-[40px]"
          :label="page.label"
          linkTo="/auth/sign-up"
          :cta="true"
          fontSize="lg"
          ariaLabel="SignIn"
        />
      </div>
      <div class="flex-1 w-full pt-6 md:pt-36 pb-4 md:pb-12 space-y-4">
        <div class="flex items-center justify-center p-4">
          <h1
            class="text-center xl:text-[64px] responsive-h1 font-bold font-display"
          >
            {{ $t(page.message) }}
          </h1>
          <Icon
            class="text-light-link-text dark:text-dark-link-text ml-6"
            :name="page.icon"
            size="3em"
          />
        </div>
      </div>
      <slot />
    </div>
  </div>
</template>
