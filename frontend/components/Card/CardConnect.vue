<template>
    <div class="card-style px-7 py-5">
      <div class="flex items-center gap-5">
        <div class="text-[38px] font-bold text-left font-display">
          {{ title }}
        </div>
        <div class="transition-all break-all hover:text-light-highlight dark:transition-all break-all hover:text-dark-highlight p-1 rounded-lg transition-all cursor-pointer">
          <Icon name="bi:pencil-square" size="1.2em" />
        </div>
      </div>
      <div class="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-6 my-3">
        <div v-if="twitter" class="flex gap-3 items-center cursor-pointer transition-all break-all hover:text-blue-400">
          <Icon name="bi:twitter" size="1.2em" />
          <div class="font-semibold">
            {{ twitter }}
          </div>
        </div>
        <div v-if="facebook" class="flex gap-3 items-center cursor-pointer transition-all break-all hover:text-blue-600">
          <Icon name="bi:facebook" size="1.2em" />
          <div class="font-semibold">
            {{ facebook }}
          </div>
        </div>
        <div v-if="email" class="flex gap-3 items-center cursor-pointer transition-all break-all hover:text-red-500">
          <Icon name="bi:envelope" size="1.2em" />
          <div class="font-semibold">
            {{ email }}
          </div>
        </div>
        <div v-if="instagram" class="flex gap-3 items-center cursor-pointer transition-all break-all hover:text-purple-500">
          <Icon name="bi:instagram" size="1.2em" />
          <div class="font-semibold">
            {{ instagram }}
          </div>
        </div>
        <div v-if="showAddMoreBtn">
            <!--TODO: Update this to use the LabeledBtn component once it supports prepended icons.-->
           
            <div @click="emit('on-new-account')" class="text-md text-white break-all bg-light-cta-orange cursor-pointer flex items-center gap-1 font-semibold hover:bg-light-cta-orange-light active:bg-light-cta-orange dark:hover:bg-dark-cta-orange-light dark:active:bg-dark-cta-orange px-4 py-1 rounded-md" >
                <Icon name="bi:plus" size="1.5em" />
                New account
            </div>
        </div>
      </div>
    </div>
  </template>
  <script setup lang="ts">
  defineProps<{
    title: string;
    twitter?: string;
    email?: string;
    facebook?: string;
    instagram?: string;
    showAddMoreBtn?: boolean;
  }>();

const emit = defineEmits(['on-new-account'])
  </script>
  

  