<template>
  <div class="py-5 card-style px-7">
    <div class="flex items-center gap-5">
      <div class="text-[38px] font-bold text-left font-display">Connect</div>
      <div
        class="p-1 break-all transition-all rounded-lg cursor-pointer hover:text-light-highlight dark:transition-all dark:hover:text-dark-highlight"
      >
        <Icon name="bi:pencil-square" size="1.2em" />
      </div>
    </div>
    <div
      class="flex flex-col items-start gap-2 my-3 md:flex-row md:items-center md:gap-6"
    >
      <div
        v-if="twitter"
        class="flex items-center gap-3 break-all transition-all cursor-pointer hover:text-blue-400"
      >
        <Icon name="bi:twitter" size="1.2em" />
        <div class="font-semibold">
          {{ twitter }}
        </div>
      </div>
      <div
        v-if="facebook"
        class="flex items-center gap-3 break-all transition-all cursor-pointer hover:text-blue-600"
      >
        <Icon name="bi:facebook" size="1.2em" />
        <div class="font-semibold">
          {{ facebook }}
        </div>
      </div>
      <div
        v-if="email"
        class="flex items-center gap-3 break-all transition-all cursor-pointer hover:text-red-500"
      >
        <Icon name="bi:envelope" size="1.2em" />
        <div class="font-semibold">
          {{ email }}
        </div>
      </div>
      <div
        v-if="instagram"
        class="flex items-center gap-3 break-all transition-all cursor-pointer hover:text-purple-500"
      >
        <Icon name="bi:instagram" size="1.2em" />
        <div class="font-semibold">
          {{ instagram }}
        </div>
      </div>
      <div v-if="showAddMoreBtn">
        <!--TODO: Update this to use the LabeledBtn component once it supports prepended icons.-->
        <div
          @click="emit('on-new-account')"
          class="flex items-center gap-1 px-4 py-1 font-semibold text-white break-all rounded-md cursor-pointer text-md bg-light-cta-orange hover:bg-light-cta-orange-light active:bg-light-cta-orange dark:hover:bg-dark-cta-orange-light dark:active:bg-dark-cta-orange"
        >
          <Icon name="bi:plus" size="1.5em" />
          New account
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  twitter?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
  showAddMoreBtn?: boolean;
}>();

const emit = defineEmits(["on-new-account"]);
</script>
