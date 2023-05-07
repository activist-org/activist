<template>
  <header
    ref="header"
    class="sticky top-0 z-10 duration-500 header drop-shadow-md"
    :class="{
      'bg-light-header dark:bg-dark-header': headerOpacity == 1,
      'bg-light-header/80 dark:bg-dark-header/80': headerOpacity == 0.8,
      'invisible opacity-0': headerOpacity == 0,
    }"
  >
    <!-- Note: mobile header -->
    <div class="flex py-2 md:hidden">
      <div class="z-0 flex justify-center mx-auto">
        <div class="relative z-0 w-24 h-6">
          <LogosActivist
            class="absolute inset-0 flex items-center justify-center z-1 overflow-clip"
          />
        </div>
      </div>
      <div class="absolute right-0 mr-5">
        <MeatballMenu />
      </div>
    </div>
    <!-- Note: desktop header -->
    <div class="hidden py-3 mx-auto md:block">
      <div class="flex items-center justify-between responsive-px-5">
        <div class="flex items-center md:space-x-4 lg:space-x-6 xl:space-x-8">
          <div class="relative z-0 h-10 w-36">
            <LogosActivist
              class="absolute inset-0 flex items-center justify-center z-1 overflow-clip"
            />
          </div>
          <RoadMapBtn label="Roadmap" linkTo="/docs/roadmap" />
        </div>
        <div>
          <div class="flex items-center space-x-3 lg:space-x-4 xl:space-x-6">
            <ThemeSelector />
            <LanguageSelector />
            <LabeledBtn
              :cta="true"
              label="get-in-touch"
              linkTo="/help/contact"
              fontSize="sm"
              class="hidden lg:block"
            />
            <LabeledBtn
              :cta="true"
              label="get-in-touch"
              linkTo="/help/contact"
              fontSize="xs"
              class="hidden md:block lg:hidden"
            />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { Ref } from "vue";

export default {
  setup() {
    const headerOpacity: Ref<number> = ref(1);
    const prevScrollY: Ref<number> = ref(0);

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    function handleScroll(): void {
      const scrollY: number = window.scrollY;

      if (scrollY > document.getElementsByTagName("header")[0].clientHeight) {
        if (scrollY > prevScrollY.value) {
          headerOpacity.value = 0;
        } else headerOpacity.value = 0.8;
      } else {
        headerOpacity.value = 1;
      }
      prevScrollY.value = scrollY;
    }

    return { headerOpacity };
  },
};
</script>

<style>
.header {
  -webkit-transform: translate3d(0, 0, 0);
}
</style>
