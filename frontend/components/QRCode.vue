<template>
  <div id="qr-code" class="flex w-max flex-col">
    <div class="relative flex w-max justify-center">
      <svg
        id="result-qr"
        :width="`${computedWidth}`"
        :height="`${computedHeight}`"
        :viewBox="viewBox"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          id="general-edges"
          :rx="borderRadius"
          :width="`${codeSize + quietZone * 2}`"
          :height="`${codeSize + quietZone * 2 + fontSize + textPaddingY * 2}`"
          fill="#FFFFFF"
          :x="`${-quietZone}`"
          :y="`${-quietZone}`"
          style="stroke-width: 2; stroke: #000000"
        />
        <qrcode-vue
          ref="qrref"
          class="qrimage"
          :value="getPath()"
          :size="codeSize"
          render-as="svg"
        />
        <rect
          id="remove-top-edge-of-bottom"
          :width="`${codeSize + quietZone * 2}`"
          :height="`${borderRadius}`"
          fill="#000000"
          :x="`${-quietZone}`"
          :y="`${codeSize + quietZone * 2 - quietZone}`"
          style="stroke-width: 1; stroke: #000000"
        />
        <rect
          id="fill-bottom"
          :rx="borderRadius"
          :width="`${codeSize + quietZone * 2}`"
          :height="`${fontSize + textPaddingY * 2}`"
          fill="#000000"
          :x="`${-quietZone}`"
          :y="`${codeSize + quietZone * 2 - quietZone}`"
          style="stroke-width: 1; stroke: #000000"
        />
        <text
          font-family="Red Hat Display"
          :style="`font-size: ${fontSize}px;`"
          :x="`${(codeSize + quietZone * 2) / 2 - quietZone}`"
          :y="`${
            codeSize + quietZone * 2.15 + fontSize + textPaddingY - quietZone
          }`"
          dominant-baseline="ideographic"
          text-anchor="middle"
          fill="#FFFFFF"
        >
          activist.org
        </text>
        <circle
          :r="`${logoBGRadius * 0.5}px`"
          :cx="`${(codeSize + quietZone * 2) / 2 - quietZone}`"
          :cy="`${(codeSize + quietZone * 2) / 2 - quietZone}`"
          fill="#FFFFFF"
        />
        <svg
          :width="`${logoSize}`"
          :height="`${logoSize}`"
          :x="`${
            (codeSize + quietZone * 2) / 2 - quietZone - logoSize / 2 - 2
          }`"
          :y="`${(codeSize + quietZone * 2) / 2 - quietZone - logoSize / 2}`"
          viewBox="0 0 503 494.8"
        >
          <path
            d="M 116.208 247.423 C 116.208 319.895 174.947 378.636 247.418 378.636 C 283.639 378.636 316.456 363.958 340.189 340.195 L 154.647 154.65 C 130.915 178.383 116.208 211.201 116.208 247.423 Z M 430.237 8.996 H 503.24 V 485.82 H 430.237 C 419.406 485.82 410.41 477.711 410.41 466.881 V 433.471 C 366.881 471.645 309.887 494.816 247.448 494.816 C 110.763 494.846 0 384.051 0 247.423 C 0 110.794 110.763 0 247.418 0 C 309.857 0 366.851 23.171 410.381 61.345 V 27.935 C 410.381 17.104 419.406 8.996 430.207 8.996 H 430.237 Z M 411.92 247.423 C 411.92 156.574 338.265 82.918 247.418 82.918 C 156.571 82.918 82.9166 156.574 82.9166 247.423 C 82.9166 338.272 156.571 411.927 247.418 411.927 C 338.265 411.927 411.92 338.272 411.92 247.423 Z"
            fill="#000000"
          />
        </svg>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import QrcodeVue from "qrcode.vue";

const fontSize = ref(24);
const quietZone = ref(18);
const textPaddingY = ref(14);
const codeSize = ref(218);
const logoBGRadius = ref(64);
const logoSize = ref(40);
const borderRadius = ref(24);

const getPath = () => window.location.toString();

const getSize = () => ({
  width: codeSize.value + quietZone.value * 2 + 2,
  height:
    codeSize.value +
    quietZone.value * 2 +
    fontSize.value +
    textPaddingY.value * 2,
});

const computedWidth = computed(
  () => `${codeSize.value + quietZone.value * 2 + 2}`,
);
const computedHeight = computed(
  () =>
    `${
      codeSize.value +
      quietZone.value * 2 +
      fontSize.value +
      textPaddingY.value * 2
    }`,
);
const viewBox = computed(
  () =>
    `${-quietZone.value} ${-quietZone.value - 1} ${
      codeSize.value + quietZone.value * 2
    } ${
      codeSize.value +
      quietZone.value * 2 +
      fontSize.value +
      textPaddingY.value * 2
    }`,
);

defineExpose({ getSize });
</script>
