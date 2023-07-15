<template>
    <SidebarRightHamburger :isMenuOpen ="isMenuOpen" @toggle="toggleMenuState" ref="ignoreElRef" class="absolute h-[40px] flex top-1 sm:top-2 right-0 mr-5" />
    <div ref="target" id="drawer-navigation"
       class="fixed top-0 right-0 z-40 w-64 h-screen p-4 pt-12 overflow-y-auto transition-transform bg-light-distinct border-l border-light-section-div dark:bg-dark-distinct dark:border-dark-section-div"
       :class="{ 'translate-x-full': !isMenuOpen }" tabindex="-1">
       <div class="py-4 overflow-y-auto h-full">
          <slot></slot>
       </div>
    </div>
 </template>
 <script setup>
 import { ref } from 'vue';
 import { onClickOutside } from '@vueuse/core';
import SidebarRightHamburger from './SidebarRightHamburger.vue';
 
 const target= ref();
 const isMenuOpen = ref(false);
 const ignoreElRef = ref();
 
 const toggleMenuState = () => {
    isMenuOpen.value = !isMenuOpen.value;        
 }
 
 onClickOutside(target, () => {
    if (!isMenuOpen.value) return;
    toggleMenuState();
 },
    { ignore: [ignoreElRef] }
 )
 
 </script>