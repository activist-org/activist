<template>
  <div
    v-if="contentPosition === 'left'"
    class="flex items-center justify-center py-12 md:py-16 xl:py-20 lg:space-x-16 xl:space-x-32 2xl:space-x-40 text-light-text dark:text-dark-text"
  >
    <div
      class="flex flex-col items-center w-full lg:items-start sm:w-10/12 lg:max-w-sm xl:max-w-md space-y-3 xl:space-y-4"
    >
      <div
        class="relative z-0 lg:hidden mb-4 w-full h-[180px] sm:h-[300px] sm:rounded-xl"
        :class="{
          'bg-light-placeholder dark:bg-dark-placeholder': imageURL == '',
          'mt-6 sm:mt-0': imageURL != '',
        }"
      >
        <div
          class="absolute inset-0 flex items-center justify-center z-1 overflow-clip"
        >
          <component
            :is="imageURL"
            class="fill-light-text dark:fill-dark-text"
            :class="{
              'scale-[0.25] sm:scale-[0.35]': imageURL == 'IconsActivist',
            }"
          />
        </div>
      </div>
      <p
        class="w-10/12 text-2xl font-semibold text-center sm:text-3xl sm:w-full xl:text-4xl sm:text-left"
      >
        {{ $t(header) }}
      </p>
      <p
        class="w-10/12 text-base tracking-wider text-center uppercase sm:text-lg sm:w-full sm:text-left xl:text-xl text-transform: text-light-special-text dark:text-dark-special-text"
      >
        {{ $t(tagline) }}
      </p>
      <p
        class="w-10/12 text-sm text-center sm:text-base sm:w-full sm:text-left"
      >
        {{ $t(text) }}
      </p>
      <LabeledBtn
        :cta="true"
        :label="`${btnText1}`"
        :linkTo="`${btnURL1}`"
        fontSize="xl"
      />
    </div>
    <div
      class="relative z-0 hidden lg:block w-[360px] h-[464px] xl:w-[450px] xl:h-[580px] rounded-xl"
      :class="{
        'bg-light-placeholder dark:bg-dark-placeholder': imageURL == '',
      }"
    >
      <div
        class="absolute inset-0 flex items-center justify-center z-1 overflow-clip"
      >
        <component
          :is="imageURL"
          class="fill-light-text dark:fill-dark-text"
          :class="{
            'scale-[0.9]': imageURL == 'IconsActivist',
          }"
        />
      </div>
    </div>
  </div>
  <div
    v-else-if="contentPosition === 'right'"
    class="flex items-center justify-center py-12 md:py-16 xl:py-20 lg:space-x-16 xl:space-x-32 2xl:space-x-40 text-light-text dark:text-dark-text bg-light-header dark:bg-dark-header"
  >
    <div
      class="relative z-0 hidden lg:block w-[360px] h-[464px] xl:w-[450px] xl:h-[580px] rounded-xl"
      :class="{
        'bg-light-placeholder dark:bg-dark-placeholder': imageURL == '',
      }"
    >
      <div
        class="absolute inset-0 flex items-center justify-center z-1 overflow-clip"
      >
        <component
          :is="imageURL"
          class="fill-light-text dark:fill-dark-text"
          :class="{
            'scale-[0.9]': imageURL == 'IconsActivist',
          }"
        />
      </div>
    </div>
    <div
      class="flex flex-col items-center w-full lg:items-start sm:w-10/12 lg:max-w-sm xl:max-w-md space-y-3 xl:space-y-4"
    >
      <div
        class="relative z-0 lg:hidden mb-4 w-full h-[180px] sm:h-[300px] sm:rounded-xl"
        :class="{
          'bg-light-placeholder dark:bg-dark-placeholder': imageURL == '',
          'mt-6 sm:mt-0': imageURL != '',
        }"
      >
        <div
          class="absolute inset-0 flex items-center justify-center z-1 overflow-clip"
        >
          <component
            :is="imageURL"
            class="fill-light-text dark:fill-dark-text"
            :class="{
              'scale-[0.25] sm:scale-[0.35]': imageURL == 'IconsActivist',
            }"
          />
        </div>
      </div>
      <p
        class="w-10/12 text-2xl font-semibold text-center sm:text-3xl sm:w-full sm:text-left xl:text-4xl"
      >
        {{ $t(header) }}
      </p>
      <p
        class="w-10/12 text-base tracking-wider text-center uppercase sm:text-lg sm:w-full sm:text-left xl:text-xl text-transform: text-light-special-text dark:text-dark-special-text"
      >
        {{ $t(tagline) }}
      </p>
      <p
        class="w-10/12 text-sm text-center sm:text-base sm:w-full sm:text-left"
      >
        {{ $t(text) }}
      </p>
      <LabeledBtn
        :cta="true"
        :label="`${btnText1}`"
        :linkTo="`${btnURL1}`"
        fontSize="xl"
      />
    </div>
  </div>
  <div
    v-else-if="contentPosition === 'top'"
    class="flex items-center justify-center pt-16 pb-10 sm:pb-16 md:pb-20 xl:py-24 text-light-text dark:text-dark-text"
  >
    <div class="flex flex-col items-center space-y-3 xl:space-y-4">
      <p
        class="w-10/12 text-2xl font-semibold text-center sm:text-3xl sm:w-full xl:text-4xl"
      >
        {{ $t(header) }}
      </p>
      <p
        class="w-10/12 text-base tracking-wider text-center uppercase sm:text-lg sm:w-full xl:text-xl text-transform: text-light-special-text dark:text-dark-special-text"
      >
        {{ $t(tagline) }}
      </p>
      <p
        class="w-10/12 mx-12 text-sm text-center sm:text-base md:w-full md:max-w-lg lg:max-w-xl xl:max-w-2xl"
      >
        {{ $t(text) }}
      </p>
      <div
        class="flex flex-col space-y-4 sm:flex-row sm:space-x-8 xl:space-x-12 sm:space-y-0"
      >
        <LabeledBtn
          :cta="true"
          :label="`${btnText1}`"
          :linkTo="`${btnURL1}`"
          fontSize="xl"
        />
        <LabeledBtn
          :cta="false"
          :label="`${btnText2}`"
          :linkTo="`${btnURL2}`"
          fontSize="xl"
        />
      </div>
      <div>
        <SupportersGrid class="mt-6 xl:mt-8" />
      </div>
      <p
        class="pt-8 mx-12 md:max-w-lg lg:max-w-2xl xl:pt-12 text-light-special-text dark:text-dark-special-text"
      >
        {{ $t(subText) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  contentPosition: string;
  header: string;
  tagline: string;
  text: string;
  imageURL?: string;
  btnText1: string;
  btnURL1: string;
  btnText2?: string;
  btnURL2?: string;
  subText?: string;
}>();
const localePath = useLocalePath();
</script>
