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

    <div class="fixed inset-0 flex w-screen items-center justify-center p-4">
      <DialogPanel class="w-full max-w-4xl rounded bg-light-header dark:bg-dark-header text-light-text dark:text-dark-text container p-5">

        
        <DialogTitle class="text-left responsive-h2 font-display flex justify-between font-bold">
          {{ $t("components.card-qrcode.header") }}
          <button
            @click="setIsOpen(false)"
            class="rounded-full text-light-special-text dark:text-dark-special-text hover:text-light-text hover:dark:text-dark-text focus-brand"
            :aria-label="$t('components.modal-image.close-modal-aria-label')"
          >
            <Icon class="w-10 h-10" name="bi:x-circle-fill" />
          </button>
        </DialogTitle>
        <div class="grid grid-cols-2 grid-rows-1 pb-6 space-y-6 lg:grid-cols-3 lg:grid-rows-1 lg:pb-0 lg:space-y-0 lg:space-x-6 lg:mr-6">

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
            
            <button class="px-4 py-2 font-semibold text-center border select-none rounded-md xl:rounded-lg focus-brand w-fit shadow-sm shadow-zinc-700 text-light-text border-light-text dark:text-dark-cta-orange dark:border-dark-cta-orange  fill-light-text dark:fill-dark-cta-orange bg-light-cta-orange dark:bg-dark-cta-orange/10 hover:bg-light-cta-orange-hover active:bg-light-cta-orange dark:hover:bg-dark-cta-orange-hover/25 dark:active:bg-dark-cta-orange/10 text-sm w-max">
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
                <p class="text-2xl">Activist App</p>
                <div class="grid grid-cols-2 p-2">

                  <svg height="50px" width="50px" class="fill-white w-full" viewBox="0 0 22.773 22.773" xml:space="preserve">
                    <path d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573
                    c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z"/>
                  <path d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334 
                    c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0
                    c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019
                    c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464
                    c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648
                    c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z"/>
                  </svg>

                  <svg width="50px" height="50px" class="fill-white w-full" viewBox="0 0 22.773 22.773" xml:space="preserve">
                    <path d="m6.1 1.4 11.6 6.7-3.3 3.3L4 1.1c.2 0 .5-.1.7-.1.5 0 1 .1 1.4.4zm-4 19V3.6c0-.8.4-1.5 1-2l10.5 10.5L3.2 
                    22.5c-.7-.5-1.1-1.3-1.1-2.1zm4 2.3c-.6.3-1.3.4-1.9.3l10.2-10.1 3.2 3.2-11.5 
                    6.6zm14.5-8.4-2.1 1.2-3.5-3.4 3.5-3.5 2 1.2c.8.5 1.3 1.3 1.3 2.3.1.8-.4 1.7-1.2 2.2z" />
                  </svg>
                </div>
                
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