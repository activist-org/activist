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
        <SelectorLanguage />
        <BtnLabeled
          class="flex items-center max-h-[38px] lg:max-h-[46px]"
          :label="page.label"
          :linkTo="page.link"
          :cta="true"
          fontSize="lg"
          :ariaLabel="page.arialLabel"
        />
      </div>
      <div class="flex-1 w-full pt-24 md:pt-36 pb-4 md:pb-12 space-y-4">
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
  
  const fullPath = route.fullPath || '';
  console.log(fullPath);

  const pageData = {
    "sign-in": {
      label: "pages.auth.sign-in.index.sign-up",
      message: "pages.auth.sign-in.index.welcome-back",
      icon:"",
      title: "pages.auth.sign-in.index.title",
      link: "/auth/sign-up",
      arialLabel: "SignUp",
    },
    "sign-up": {
      label: "pages.auth.sign-up.index.sign-in",
      message: "pages.auth.sign-up.index.first-time-welcome",
      icon: "",
      title: "pages.auth.sign-up.index.title",
      link: "/auth/sign-in",
      arialLabel: "SignIn",
    },
    default: {
      label: "",
      message: "",
      icon: "",
      title: "",
    },
  };

  return pageData[fullPath.includes("sign-in") ? "sign-in" : fullPath.includes("sign-up") ? "sign-up" : "default"];
   
});
</script>
