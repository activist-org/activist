<template>
  <header
    ref="header"
    class="relative sticky top-0 z-10 duration-500 drop-shadow-md"
    :class="{
      'bg-light-header dark:bg-dark-header': headerOpacity == 1,
      'bg-light-header/80 dark:bg-dark-header/80': headerOpacity == 0.8,
      'invisible opacity-0': headerOpacity == 0,
    }"
  >
    <!-- Note: mobile header -->
    <div class="flex px-4 py-3 md:hidden">
      <div class="z-0 mx-auto">
        <div
          class="absolute top-0 left-0 z-0 flex items-center justify-center w-full h-full"
        >
          <div>
            <LogoActivist
              class="flex items-center justify-center h-full z-1 overflow-clip"
              :is-mobile="true"
            />
          </div>
        </div>
      </div>
      <SidebarRight>
        <div class="flex-col space-y-2">
          <DropdownTheme class="w-full" location="sideMenu" />
          <DropdownLanguage class="w-full" location="sideMenu" />
        </div>
      </SidebarRight>
    </div>
    <!-- Note: desktop header -->
    <div class="hidden py-3 mx-auto md:block">
      <div class="flex items-center justify-between responsive-px-5">
        <div class="flex items-center md:space-x-4 lg:space-x-6 xl:space-x-8">
          <div class="relative z-0 h-10 w-36">
            <LogoActivist
              class="absolute inset-0 flex items-center justify-center z-1 overflow-clip"
            />
          </div>
          <BtnRoadMap label="Roadmap" linkTo="/about/roadmap" />
        </div>
        <div>
          <div class="flex items-center space-x-3 lg:space-x-4 xl:space-x-6">
            <DropdownTheme />
            <DropdownLanguage />
            <BtnRouteInternal
              class="hidden lg:block"
              :cta="true"
              label="components.btn-route-internal.get-in-touch"
              linkTo="/help/contact"
              fontSize="sm"
              ariaLabel="components.btn-route-internal.get-in-touch-aria-label"
            />
            <BtnRouteInternal
              class="hidden md:block lg:hidden"
              :cta="true"
              label="components.btn-route-internal.get-in-touch"
              linkTo="/help/contact"
              fontSize="xs"
              ariaLabel="components.btn-route-internal.get-in-touch-aria-label"
            />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const headerOpacity: Ref<number> = ref(1);
const prevScrollY: Ref<number> = ref(0);

function handleScroll() {
  const scrollY = window.scrollY;

  if (scrollY > document.getElementsByTagName("header")[0].clientHeight) {
    if (scrollY > prevScrollY.value) {
      headerOpacity.value = 0;
    } else headerOpacity.value = 0.8;
  } else {
    headerOpacity.value = 1;
  }
  prevScrollY.value = scrollY;
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style>
.header {
  -webkit-transform: translate3d(0, 0, 0);
}
</style>
