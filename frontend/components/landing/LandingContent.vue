<template>
  <div
    v-if="contentPosition === 'left'"
    class="flex items-center justify-center py-8 sm:py-12 md:py-16 lg:py-24 xl:py-28 lg:space-x-20 xl:space-x-32 2xl:space-x-40 text-light-text dark:text-dark-text"
  >
    <div
      class="flex flex-col items-center w-full space-y-3 lg:items-start sm:w-10/12 lg:max-w-sm xl:max-w-md xl:space-y-4"
    >
      <!-- Note: image on top of content. -->
      <img
        v-if="$colorMode.value == 'light'"
        :src="imageURL + '_light.png'"
        :alt="altText"
        class="mb-4 lg:hidden h-36 sm:h-44"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        :src="imageURL + '_dark.png'"
        :alt="altText"
        class="mb-4 lg:hidden h-36 sm:h-44"
      />
      <h2
        class="w-10/12 text-2xl font-semibold text-center sm:text-3xl sm:w-full xl:text-4xl sm:text-left"
      >
        {{ $t(header) }}
      </h2>
      <p
        class="w-10/12 text-base tracking-wider text-center uppercase sm:text-lg sm:w-full sm:text-left xl:text-xl text-transform: text-light-special-text dark:text-dark-special-text"
      >
        {{ $t(tagline) }}
      </p>
      <p
        class="w-10/12 pb-2 text-sm text-center sm:text-base sm:w-full sm:text-left"
      >
        {{ $t(text) }}
      </p>
      <BtnLabeled
        :cta="true"
        :label="`${btnText1}`"
        :linkTo="`${btnURL1}`"
        fontSize="xl"
        :alternateText="btnAlternateText1 ? $t(`${btnAlternateText1}`) : null"
      />
    </div>
    <!-- Note: image right of content. -->
    <div class="hidden lg:block w-60 h-60 xl:w-72 xl:h-72">
      <img
        v-if="$colorMode.value == 'light'"
        :src="imageURL + '_light.png'"
        :alt="altText"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        :src="imageURL + '_dark.png'"
        :alt="altText"
      />
    </div>
  </div>
  <div
    v-else-if="contentPosition === 'right'"
    class="flex items-center justify-center py-8 sm:py-12 md:py-16 lg:py-24 xl:py-28 lg:space-x-20 xl:space-x-32 2xl:space-x-40 text-light-text dark:text-dark-text bg-light-header dark:bg-dark-header"
  >
    <!-- Note: image left of content. -->
    <div class="hidden lg:block w-60 h-60 xl:w-72 xl:h-72">
      <img
        v-if="$colorMode.value == 'light'"
        :src="imageURL + '_light.png'"
        :alt="altText"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        :src="imageURL + '_dark.png'"
        :alt="altText"
      />
    </div>
    <div
      class="flex flex-col items-center w-full space-y-3 lg:items-start sm:w-10/12 lg:max-w-sm xl:max-w-md xl:space-y-4"
    >
      <!-- Note: image on top of content. -->
      <img
        v-if="$colorMode.value == 'light'"
        :src="imageURL + '_light.png'"
        :alt="altText"
        class="mb-4 lg:hidden h-36 sm:h-44"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        :src="imageURL + '_dark.png'"
        :alt="altText"
        class="mb-4 lg:hidden h-36 sm:h-44"
      />
      <h2
        class="w-10/12 text-2xl font-semibold text-center sm:text-3xl sm:w-full sm:text-left xl:text-4xl"
      >
        {{ $t(header) }}
      </h2>
      <p
        class="w-10/12 text-base tracking-wider text-center uppercase sm:text-lg sm:w-full sm:text-left xl:text-xl text-transform: text-light-special-text dark:text-dark-special-text"
      >
        {{ $t(tagline) }}
      </p>
      <p
        class="w-10/12 pb-2 text-sm text-center sm:text-base sm:w-full sm:text-left"
      >
        {{ $t(text) }}
      </p>
      <BtnLabeled
        :cta="true"
        :label="`${btnText1}`"
        :linkTo="`${btnURL1}`"
        fontSize="xl"
        :alternateText="btnAlternateText1 ? $t(`${btnAlternateText1}`) : null"
      />
    </div>
  </div>
  <div
    v-else-if="contentPosition === 'top'"
    class="flex items-center justify-center pt-16 pb-10 sm:pb-16 md:pb-20 xl:py-24 text-light-text dark:text-dark-text"
  >
    <div class="flex flex-col items-center space-y-3 xl:space-y-4">
      <h2
        class="w-10/12 text-2xl font-semibold text-center sm:text-3xl sm:w-full xl:text-4xl"
      >
        {{ $t(header) }}
      </h2>
      <p
        class="w-10/12 text-base tracking-wider text-center uppercase sm:text-lg sm:w-full xl:text-xl text-transform: text-light-special-text dark:text-dark-special-text"
      >
        {{ $t(tagline) }}
      </p>
      <p
        class="w-10/12 pb-2 mx-12 text-sm text-center sm:text-base md:w-full md:max-w-lg lg:max-w-xl xl:max-w-2xl"
      >
        {{ $t(text) }}
      </p>
      <div
        class="grid grid-cols-1 grid-rows-2 gap-y-4 sm:gap-y-0 sm:gap-x-4 md:gap-x-6 xl:gap-x-8 sm:grid-cols-2 sm:grid-rows-1"
      >
        <BtnLabeled
          class="w-full"
          :cta="true"
          :label="`${btnText1}`"
          :linkTo="`${btnURL1}`"
          fontSize="xl"
          :alternateText="btnAlternateText1 ? $t(`${btnAlternateText1}`) : null"
        />
        <BtnLabeled
          class="w-full"
          :cta="false"
          :label="`${btnText2}`"
          :linkTo="`${btnURL2}`"
          fontSize="xl"
          :alternateText="btnAlternateText2 ? $t(`${btnAlternateText2}`) : null"
        />
      </div>
      <div>
        <GridSupporters class="mt-6 xl:mt-8" />
      </div>
      <p
        v-if="subText"
        class="pt-8 mx-12 text-center md:max-w-md lg:max-w-lg xl:pt-12 text-light-special-text dark:text-dark-special-text"
      >
        {{ $t(subText) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  contentPosition: "left" | "right" | "top";
  header: string;
  tagline: string;
  text: string;
  imageURL?: string;
  altText?: string;
  btnText1: string;
  btnURL1: string;
  btnAlternateText1?: string;
  btnText2?: string;
  btnURL2?: string;
  btnAlternateText2?: string;
  subText?: string;
}>();

const localePath = useLocalePath();
</script>
