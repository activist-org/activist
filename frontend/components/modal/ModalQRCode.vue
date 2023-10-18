<template>
  <div
    class="absolute right-0 flex items-center justify-center w-10 h-10 border-2 rounded-md bg-light-header dark:bg-dark-header border-light-section-div dark:border-dark-section-div sm:w-16 sm:h-16 text-light-text dark:text-dark-text shadow-sm shadow-zinc-700 cursor-pointer"
    @click="setIsOpen(true)"
  >
    <Icon
      name="bi:qr-code-scan"
      size="3em"
      :alt="$t('components.modal-qr-code.img-alt-text')"
    />
  </div>

  <Dialog @close="setIsOpen(false)" class="relative z-50" :open="isOpen">
    <div
      class="fixed inset-0 bg-light-popup dark:bg-dark-popup"
      aria-hidden="true"
    />

    <div class="fixed inset-0 flex w-screen items-center justify-center">
      <DialogPanel
        class="pl-6 h-full md:h-auto overflow-y-auto w-full max-w-4xl card-style text-light-text dark:text-dark-text container p-5"
      >
        <DialogTitle class="font-display flex justify-between">
          <p class="text-3xl md:responsive-h2 font-bold">
            {{ $t("components.modal-qr-code.header") }}
          </p>
          <button
            @click="setIsOpen(false)"
            class="p-1 rounded-full text-light-special-text dark:text-dark-special-text hover:text-light-text hover:dark:text-dark-text focus-brand"
            :aria-label="$t('components.modal-qr-code.close-modal-aria-label')"
          >
            <Icon class="w-10 h-10" name="bi:x-circle-fill" />
          </button>
        </DialogTitle>
        <div
          class="flex flex-col items-center md:grid md:grid-cols-2 md:grid-rows-1 pb-6 space-y-6 lg:grid-cols-3 lg:grid-rows-1 lg:pb-0 lg:space-y-0 lg:space-x-6 lg:mr-6"
        >
          <div
            class="items-center space-y-4 text-left col-span-2 pt-2 font-medium"
          >
            <p>
              {{ $t("components.modal-qr-code.section-1-paragraph-1-event") }}
            </p>
            <p v-if="false">
              {{
                $t(
                  "components.modal-qr-code.section-1-paragraph-1-organization"
                )
              }}
            </p>
            <p>
              {{ $t("components.modal-qr-code.subheader-2") }}
            </p>
            <ul class="pl-6 md:pl-8 list-disc">
              <li>
                {{ $t("components.modal-qr-code.section-2-list-1-item-1") }}
              </li>
              <li>
                {{ $t("components.modal-qr-code.section-2-list-1-item-2") }}
              </li>
              <li>
                {{ $t("components.modal-qr-code.section-2-list-1-item-3") }}
              </li>
            </ul>
            <p>
              {{ $t("components.modal-qr-code.section-3-paragraph-1") }}
            </p>
            <BtnLabeled
              class="hidden md:flex"
              :cta="true"
              :label="$t('components.modal-qr-code.download-qr-code')"
              fontSize="lg"
              :ariaLabel="$t('download-qr-code-aria-label')"
            />
          </div>
          <div class="px-4 flex justify-center">
            <div class="flex justify-center flex-col md:pb-10">
              <div
                class="relative border-2 border-black bg-white rounded-t-3xl"
              >
                <qrcode-vue
                  class="p-4"
                  :value="getPath()"
                  :size="codeSize"
                  :render-as="'svg'"
                />
                <div
                  class="h-16 w-16 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white absolute fill-black"
                >
                  <IconActivist
                    class="cursor-none pointer-events-none flex items-center w-10 h-14 absolute -top-[0.1rem] m-auto left-[0.6rem] overflow-clip"
                    color="fill-black dark:fill-black hover:fill-black"
                  />
                </div>
              </div>
              <div
                class="flex justify-center py-2 bg-black rounded-b-3xl text-white w-full"
              >
                <p class="pb-1 text-2xl">
                  {{ $t("components.modal-qr-code.url-text") }}
                </p>
              </div>
            </div>
          </div>
          <BtnLabeled
            class="flex md:hidden"
            :cta="true"
            :label="$t('components.modal-qr-code.download-qr-code')"
            fontSize="lg"
            :ariaLabel="$t('download-qr-code-aria-label')"
          />
        </div>
      </DialogPanel>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import QrcodeVue from "qrcode.vue";
import { ref } from "vue";

const codeSize = ref(275);

function getPath() {
  const host = window.location.toString();
  return host;
}

const isOpen = ref(false);
function setIsOpen(value: boolean) {
  isOpen.value = value;
}
</script>
