<template>
  <header
    ref="header"
    id="header"
    class="sticky top-0 z-10 drop-shadow-md duration-500"
    :class="{
      'bg-light-layer-2 dark:bg-dark-layer-2': headerOpacity == 1,
      'bg-light-layer-2/80 dark:bg-dark-layer-2/80': headerOpacity == 0.8,
      'invisible opacity-0': headerOpacity == 0,
    }"
  >
    <!-- Note: Mobile header including SidebarRight. -->
    <div id="mobile-header" class="flex px-4 py-3 md:hidden">
      <div class="z-0 mx-auto">
        <div
          class="absolute left-0 top-0 z-0 flex h-full w-full items-center justify-center"
        >
          <div>
            <LogoActivist
              class="z-1 flex h-full items-center justify-center overflow-clip"
              :is-mobile="true"
            />
          </div>
        </div>
      </div>
      <SidebarRight>
        <div class="flex-col space-y-2">
          <DropdownTheme
            class="w-full"
            :location="DropdownLocation.SIDE_MENU"
          />
          <DropdownLanguage
            class="w-full"
            :location="DropdownLocation.SIDE_MENU"
          />
        </div>
      </SidebarRight>
    </div>
    <!-- Note: Desktop header. -->
    <div id="desktop-header" class="mx-auto hidden py-3 md:block">
      <div class="responsive-px-5 flex items-center justify-between">
        <div class="flex items-center md:space-x-4 lg:space-x-6 xl:space-x-8">
          <div class="relative z-0 h-10 w-36">
            <LogoActivist
              class="z-1 absolute inset-0 flex items-center justify-center overflow-clip"
            />
          </div>
          <BtnRoadMap label="Roadmap" linkTo="/about/roadmap" />
        </div>
        <div>
          <div class="flex items-center space-x-3 lg:space-x-4 xl:space-x-6">
            <DropdownTheme />
            <DropdownLanguage />
            <BtnRouteInternal
              id="btn-get-in-touch-large"
              class="hidden lg:block"
              :cta="true"
              label="components.btn-route-internal.get-in-touch"
              linkTo="/help/contact"
              fontSize="sm"
              ariaLabel="components.btn-route-internal.get-in-touch-aria-label"
            />
            <BtnRouteInternal
              id="btn-get-in-touch-medium"
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
import { DropdownLocation } from "~/types/location";

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
  transform: translate3d(0, 0, 0);
  -webkit-transform: translate3d(0, 0, 0);
}
</style>
