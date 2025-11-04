<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <NuxtLayout name="app">
    <!-- SidebarLeft, ModalUploadImage, etc -->
    <SidebarLeft
      v-if="aboveMediumBP"
      @blur="sidebarHover = false"
      @focus="sidebarHover = true"
      @mouseleave="sidebarHover = false"
      @mouseover="sidebarHover = true"
      class="block"
    />
    <div class="grid h-full w-full grid-rows-[1fr_30vh]">
      <div
        class="overflow-y-scroll bg-layer-0 pt-8 transition-[padding] duration-500 md:pt-0"
        :class="sidebarContentDynamicClass"
      >
        <NuxtPage />
      </div>
      <FooterWebsite
        class="transition-[padding] duration-500 md:pb-12"
        :class="sidebarFooterDynamicClass"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import {
  getSidebarContentDynamicClass,
  getSidebarFooterDynamicClass,
} from "~/utils/sidebarUtils";

const aboveMediumBP = useBreakpoint("md");

const sidebarHover = ref(false);
const sidebarContentScrollable = useState<boolean>("sidebarContentScrollable");

const sidebarContentDynamicClass = getSidebarContentDynamicClass(
  sidebarContentScrollable.value,
  sidebarHover
);

const sidebarFooterDynamicClass = getSidebarFooterDynamicClass(sidebarHover);
</script>
