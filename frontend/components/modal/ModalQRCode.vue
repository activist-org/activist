<template>
  
  <div
    class="absolute right-0 flex items-center justify-center w-10 h-10 border-2 rounded-md bg-light-header dark:bg-dark-header border-light-section-div dark:border-dark-section-div sm:w-16 sm:h-16 text-light-text dark:text-dark-text shadow-sm shadow-zinc-700" @click="setIsOpen(true)"
  >
    <Icon
      name="bi:qr-code-scan"
      size="3em"
      :alt="$t('components.modal-qr-code.img-alt-text')"
    />
  </div>

  <Dialog @close="setIsOpen(false)" class="relative z-50" :open="isOpen">
    <div
      class="fixed inset-0 bg-dark-popup dark:bg-dark-popup"
      aria-hidden="true"
    />

    <div class="fixed inset-0 flex w-screen items-center justify-center md:p-4">
      <DialogPanel class="h-full md:h-auto overflow-y-auto w-full max-w-4xl rounded bg-light-header dark:bg-dark-header text-light-text dark:text-dark-text container p-5">

        
        <DialogTitle class="text-left text-3xl md:responsive-h2 font-display flex justify-between font-bold">
          {{ $t("components.card-qrcode.header") }}
          <button
            @click="setIsOpen(false)"
            class="rounded-full text-light-special-text dark:text-dark-special-text hover:text-light-text hover:dark:text-dark-text focus-brand"
            :aria-label="$t('components.modal-image.close-modal-aria-label')"
          >
            <Icon class="w-10 h-10" name="bi:x-circle-fill" />
          </button>
        </DialogTitle>
        <div class="flex flex-col items-center md:grid md:grid-cols-2 md:grid-rows-1 pb-6 space-y-6 lg:grid-cols-3 lg:grid-rows-1 lg:pb-0 lg:space-y-0 lg:space-x-6 lg:mr-6">

          <div class="items-center space-y-4 text-left col-span-2 p-3 font-medium">
            
            <p>
              {{ $t("components.card-qrcode.content.paragraph-1") }}
            </p>
            <p>
              {{ $t("components.card-qrcode.content.paragraph-2") }}
            </p>
            <p>
              {{ $t("components.card-qrcode.content.paragraph-3") }}
            </p>
            <p>
              {{ $t("components.card-qrcode.content.paragraph-4") }}
            </p>
            <p>
              {{ $t("components.card-qrcode.content.paragraph-5") }}
            </p>
            
            <button class="hidden md:block px-4 py-2 font-semibold text-center border select-none rounded-md xl:rounded-lg focus-brand w-fit shadow-sm shadow-zinc-700 text-light-text border-light-text dark:text-dark-cta-orange dark:border-dark-cta-orange  fill-light-text dark:fill-dark-cta-orange bg-light-cta-orange dark:bg-dark-cta-orange/10 hover:bg-light-cta-orange-hover active:bg-light-cta-orange dark:hover:bg-dark-cta-orange-hover/25 dark:active:bg-dark-cta-orange/10 text-sm w-max">
                {{ $t("components.card-qrcode.button-download") }}
            </button>

            

          </div>

          <div class="px-4 flex justify-center">
            <div class="flex justify-center flex-col">
              <qrcode-vue class="border-2 border-black p-4 bg-white rounded-t-3xl" :value="getPath()" :size="size" :render-as="'svg'" />
              <div class="text-center pt-2 pb-2 bg-black rounded-b-3xl text-white" style="max-width: 200px;">
                <p>
                  {{ $t("components.card-qrcode.text-right") }}
                </p>
                <p class="text-2xl">activist.org</p>
                
              </div>
            </div>

          </div>
          <button class="block md:hidden px-4 py-2 font-semibold text-center border select-none rounded-md xl:rounded-lg focus-brand w-fit shadow-sm shadow-zinc-700 text-light-text border-light-text dark:text-dark-cta-orange dark:border-dark-cta-orange  fill-light-text dark:fill-dark-cta-orange bg-light-cta-orange dark:bg-dark-cta-orange/10 hover:bg-light-cta-orange-hover active:bg-light-cta-orange dark:hover:bg-dark-cta-orange-hover/25 dark:active:bg-dark-cta-orange/10 text-sm w-max">
                {{ $t("components.card-qrcode.button-download") }}
            </button>
      </div>
      </DialogPanel>
    </div>
      
    

    
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from "@headlessui/vue";
import { ref } from "vue";
import QrcodeVue from "qrcode.vue";

const duck = "https://duckduckgo.com/assets/logo_homepage.normal.v108.svg";

const isOpen = ref(false);

const size = ref(200);

function getPath() {
  const host = window.location.toString();
  return host
}

function setIsOpen(value: boolean) {
  isOpen.value = value
}

</script>