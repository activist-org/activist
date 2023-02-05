<template>
  <header
    ref="header"
    class="header-container sticky top-0 z-10 drop-shadow-md"
    :style="{
      'background-color': `rgba(22, 27, 34,${headerOpacity})`,
    }"
  >
    <div class="flex py-2 md:hidden">
      <div class="z-0 flex justify-center mx-auto">
        <div class="relative z-0 w-20 h-6">
          <LogosActivist
            class="absolute inset-0 flex items-center justify-center z-1 overflow-clip"
          />
        </div>
      </div>
      <div class="absolute right-0 mr-5">
        <MeatballMenu />
      </div>
    </div>
    <div class="hidden py-3 mx-auto md:block">
      <div
        class="flex items-center justify-between px-8 md:px-6 lg:px-10 xl:px-14"
      >
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
    const prevYOffset: Ref<number> = ref(0);

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    function handleScroll(): void {
      if (window.pageYOffset > 0) {
        if (window.pageYOffset > prevYOffset.value) {
          headerOpacity.value = 0;
        } else if (window.pageYOffset < prevYOffset.value) {
          headerOpacity.value = 0.5;
        } else headerOpacity.value = 0;
      } else {
        headerOpacity.value = 1;
      }
      prevYOffset.value = window.pageYOffset;
    }
    return { headerOpacity };
  },
};
</script>

<style scoped>
.header-container {
  transition: 1s;
}
</style>
