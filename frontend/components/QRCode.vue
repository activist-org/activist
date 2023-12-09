<template>
  <div id="qrcode" class="flex flex-col w-max">
    <div
      class="flex w-max justify-center relative border-2 border-black bg-white rounded-t-3xl"
    >
      <qrcode-vue class="p-4" :value="getPath()" :size="codeSize" />
      <div
        class="h-16 w-16 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white absolute fill-black"
      >
        <IconActivist
          class="cursor-none pointer-events-none flex items-center w-10 h-14 absolute -top-[0.1rem] m-auto left-[0.6rem] overflow-clip"
          color="fill-black dark:fill-black hover:fill-black"
        />
      </div>
    </div>
    <div
      class="flex justify-center py-2 bg-black rounded-b-3xl text-white w-full"
    >
      <p class="pb-1 text-2xl">
        {{ $t("components.qr-code.url-text") }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import QrcodeVue from "qrcode.vue";
import { ref } from "vue";

const codeSize = ref(250);

function getPath() {
  const host = window.location.toString();
  return host;
}
</script>
