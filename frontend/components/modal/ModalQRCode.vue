<template>
  <div
    @click="setIsOpen(true)"
    class="absolute right-0 flex items-center justify-center w-10 h-10 border-2 rounded-md bg-light-header dark:bg-dark-header border-light-section-div dark:border-dark-section-div sm:w-16 sm:h-16 text-light-text dark:text-dark-text shadow-sm shadow-zinc-700 cursor-pointer"
  >
    <div class="sm:hidden">
      <Icon
        name="bi:qr-code-scan"
        size="2em"
        :alt="$t('components.modal-qr-code.img-alt-text')"
      />
    </div>
    <div class="hidden sm:block">
      <Icon
        name="bi:qr-code-scan"
        size="3em"
        :alt="$t('components.modal-qr-code.img-alt-text')"
      />
    </div>
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
              @click="downloadQRCode()"
              class="hidden md:flex"
              :cta="true"
              :label="$t('components.modal-qr-code.download-qr-code')"
              fontSize="lg"
              :ariaLabel="$t('download-qr-code-aria-label')"
            />
          </div>
          <div class="px-4 md:pl-8 md:pb-10">
            <QRCode />
          </div>
          <BtnLabeled
            @click="downloadQRCode()"
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
// import html2canvas from "html2canvas";
import { ref } from "vue";

function downloadQRCode() {
  const style = document.createElement("style");
  document.head.appendChild(style);
  style.sheet?.insertRule(
    "body > div:last-child img { display: inline-block; }"
  );

  // html2canvas(document.querySelector("#qrcode")!).then((canvas) => {
  //   const link = document.createElement("a");
  //   link.download = "qr-code.png";
  //   link.href = canvas.toDataURL();
  //   link.click();
  //   style.remove();
  // });
}

const isOpen = ref(false);
function setIsOpen(value: boolean) {
  isOpen.value = value;
}
</script>
