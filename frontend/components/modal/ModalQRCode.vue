<template>
  
  <div
    class="absolute right-0 flex items-center justify-center w-10 h-10 border-2 rounded-md bg-light-header dark:bg-dark-header border-light-section-div dark:border-dark-section-div sm:w-16 sm:h-16 text-light-text dark:text-dark-text shadow-sm shadow-zinc-700" @click="setIsOpen(true)"
  >
    <Icon name="bi:qr-code-scan" size="3em" alt="QR code scanning icon" />
  </div>

  <Dialog @close="setIsOpen(false)" class="relative z-50" :open="isOpen">
    <div
      class="fixed inset-0 bg-light-popup dark:bg-dark-popup"
      aria-hidden="true"
    />

    <div class="fixed inset-0 flex w-screen items-center justify-center p-4">
      <DialogPanel class="w-full max-w-4xl rounded bg-white">

        <button
          @click="setIsOpen(false)"
          class="absolute right-0 p-1 mt-8 mr-24 rounded-full text-light-special-text dark:text-dark-special-text hover:text-light-text hover:dark:text-dark-text focus-brand"
          :aria-label="$t('components.modal-image.close-modal-aria-label')"
        >
          <Icon class="w-10 h-10" name="bi:x-circle-fill" />
        </button>

        <DialogTitle class="text-left responsive-h2 font-display">
          {{ $t("components.card-qrcode.header") }}
        </DialogTitle>
        <div class="grid grid-cols-2 grid-rows-1 pb-6 space-y-6 lg:grid-cols-3 lg:grid-rows-1 lg:pb-0 lg:space-y-0 lg:space-x-6 lg:mr-6">

          <div class="items-center space-y-4 text-left md:items-start col-span-2">
            
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
            
          </div>

          <div class="">
            <div class="grid grid-cols-1 grid-rows-3 pb-6 space-y-6">
              <div class="h-full w-full">
                <vue-qrcode value="activist.org" :options="{width: 200}"></vue-qrcode>
              </div>
            </div>
          </div>
      </div>
      </DialogPanel>
    </div>
      
    

    
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from "@headlessui/vue";
import { ref } from "vue";


const isOpen = ref(false);

function getPath() {
  const route = useRoute()
  // console.log('current name', route.path)
}

function setIsOpen(value: boolean) {
  isOpen.value = value
}


</script>