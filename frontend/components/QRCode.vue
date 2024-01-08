<template>
  <div id="qrcode" class="flex flex-col w-max">
    <div
      class="relative flex justify-center bg-white border-2 border-black w-max rounded-t-3xl"
    >
      <qrcode-vue class="p-4" :value="getPath()" :size="codeSize" />
      <div
        class="absolute w-16 h-16 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fill-black"
      >
        <IconActivist
          class="cursor-none pointer-events-none flex items-center w-10 h-14 absolute -top-[0.1rem] m-auto left-[0.6rem] overflow-clip"
          color="fill-black dark:fill-black hover:fill-black"
        />
      </div>
    </div>
    <div
      class="flex justify-center w-full py-2 text-white bg-black rounded-b-3xl"
    >
      <p class="pb-1 text-2xl">
        {{ $t("components.qr-code.url-text") }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import QrcodeVue from "qrcode.vue";

const codeSize = ref(250);

function getPath() {
  const host = window.location.toString();
  return host;
}
</script>
