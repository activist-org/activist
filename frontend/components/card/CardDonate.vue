<template>
    <div class="px-5 py-5 card-style">
      <div class="flex items-center gap-5">
        <h3 class="text-left responsive-h3 font-display">
          {{ $t("components.card-donate.header") }}
        </h3>
        <div
          class="p-1 break-all rounded-lg cursor-pointer transition-all hover:text-light-highlight dark:transition-all dark:hover:text-dark-highlight"
        >
          <Icon
            v-if="userIsAdmin && !editModeEnabled"
            @click="toggleEditMode"
            name="bi:pencil-square"
            size="1.2em"
          />
          <Icon
            v-else-if="userIsAdmin && editModeEnabled"
            @click="toggleEditMode"
            name="bi:x-lg"
            size="1.2em"
          />
        </div>
      </div>
      <ul
        class="flex flex-col items-start mt-3 mb-2 gap-2 md:flex-row md:items-left md:gap-6"
      >
      <Icon 
              v-if="editModeEnabled"
              @click="doSomething()" 
              name="bi:x-lg"
              size="1em"
            /> 
        <div class="flex items-center break-all cursor-pointer gap-3 transition-all"><p>Thanks for your interest in supporting Bridges Over Borders! We have transparent funding, so you'll be able to see exactly where every cent goes. The button below will take you to our funding page where you can make a one time or recurring donation. Thanks again!</p></div>
        
        <div
          :class="{
            block: editModeEnabled,
            hidden: !editModeEnabled,
          }"
        >
          <Popover v-slot="{ close }" class="relative">
            <transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
            </transition>
          </Popover>
        </div>  
       
      </ul>
      <BtnLabeled 
          class="w-small flex mt-3"
          :cta="true"
          linkTo="/"
          label="components.btn-labeled.Go-to-donation-page"
          fontSize="sm"
          rightIcon="bi:box-arrow-up-right" 
          iconSize="1.25em"
          ariaLabel="components.btn-labeled.support-organization-aria-label"
        /> 
       
    </div>
  </template>
  
  <script setup lang="ts">
  import { Popover } from "@headlessui/vue";
  
  const props = defineProps<{
    userIsAdmin?: boolean;
  }>();
  
  const editModeEnabled = ref(false);
  
  
  const toggleEditMode = () => {
    editModeEnabled.value = !editModeEnabled.value;
  };
  
  
  const doSomething = ()=>{
    //edit button functionality
    // console.log("working")
  }
  </script>
   