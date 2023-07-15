<template>
    <div ref="ignore">
     <button class="relative group z-50" @click="$emit('toggle')">
       <div class="relative flex overflow-hidden items-center justify-center rounded-full w-[40px] h-[40px] transform transition-all bg-slate-700 ring-0 ring-gray-300 hover:ring-4  ring-opacity-30 duration-200 shadow-md" :class="{'group-focus:ring-4': isMenuOpen}">
         <div class="flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 origin-center overflow-hidden">
           <div class="bg-white h-[2px] w-7 transform transition-all duration-300 origin-left" :class="{'translate-x-10': isMenuOpen}"></div>
           <div class="bg-white h-[2px] w-7 rounded transform transition-all duration-300 delay-75" :class="{'translate-x-10': isMenuOpen}"></div>
           <div class="bg-white h-[2px] w-7 transform transition-all duration-300 origin-left  delay-150" :class="{'translate-x-10': isMenuOpen}"></div>
           <div class="absolute items-center justify-between transform transition-all duration-500 top-2.5 -translate-x-10 flex w-0" :class="{'translate-x-0 w-12': isMenuOpen}">
             <div class="absolute bg-white h-[2px] w-5 transform transition-all duration-500 rotate-0 delay-300" :class="{'rotate-45': isMenuOpen}"></div>
             <div class="absolute bg-white h-[2px] w-5 transform transition-all duration-500 -rotate-0 delay-300" :class="{'-rotate-45': isMenuOpen}"></div>
           </div>
         </div>
       </div>
     </button>
   </div>
</template>

<script setup>
const props = defineProps({
   isMenuOpen: {
       type: Boolean,
       default: false
   }
});

const emits = defineEmits(['toggle']);
</script>