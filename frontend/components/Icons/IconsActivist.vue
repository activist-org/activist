<template>
  <NuxtLink :to="localePath('/')" class="focus-brand">
    <svg
      class="transition duration-100 fill-light-text dark:fill-dark-text hover:fill-light-special-text hover:dark:fill-dark-special-text"
      width="814"
      height="814"
      viewBox="0 0 814 814"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_2826_22644)">
        <path
          d="M187.872 407C187.872 524.163 282.837 619.128 400 619.128C458.558 619.128 511.613 595.398 549.982 556.982L250.018 257.018C211.649 295.387 187.872 348.442 187.872 407ZM695.563 21.5916H813.587V792.456H695.563C678.053 792.456 663.509 779.348 663.509 761.838V707.825C593.135 769.54 500.993 807 400.048 807C179.07 807 0 627.931 0 407C0 186.069 179.069 7 400 7C500.945 7 593.087 44.4596 663.461 106.175V52.1621C663.461 34.6522 678.053 21.5437 695.515 21.5437L695.563 21.5916ZM665.949 407.048C665.949 260.175 546.872 141.099 400 141.099C253.128 141.099 134.051 260.128 134.051 407C134.051 553.872 253.128 672.949 400 672.949C546.872 672.949 665.949 553.872 665.949 407V407.048Z"
        />
      </g>
      <defs>
        <clipPath id="clip0_2826_22644">
          <rect
            width="813.587"
            height="800"
            fill="white"
            transform="translate(0 7)"
          />
        </clipPath>
      </defs>
    </svg>
  </NuxtLink>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
</script>
