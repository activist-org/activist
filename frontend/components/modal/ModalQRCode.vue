<template>
  <ModalBase>
    <template #normalDisplay>
      <div
        class="absolute right-0 flex items-center justify-center w-10 h-10 cursor-pointer rounded-md sm:w-16 sm:h-16 elem-on-card-style"
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
    </template>
    <template #modalDisplay>
      <DialogTitle class="flex justify-between font-display">
        <p class="text-3xl font-bold md:responsive-h2">
          {{ $t("components.modal-qr-code.header") }}
        </p>
      </DialogTitle>
      <div
        class="flex flex-col items-center pb-6 md:grid md:grid-cols-2 md:grid-rows-1 space-y-6 lg:grid-cols-3 lg:grid-rows-1 lg:pb-0 lg:space-y-0 lg:space-x-6 lg:mr-14 lg:pr-8"
      >
        <div
          class="items-center pt-2 font-medium text-left space-y-4 col-span-2"
        >
          <p>
            {{ $t("components.modal-qr-code.section-1-paragraph-1-event") }}
          </p>
          <p v-if="false">
            {{
              $t("components.modal-qr-code.section-1-paragraph-1-organization")
            }}
          </p>
          <p>
            {{ $t("components.modal-qr-code.subheader-2") }}
          </p>
          <ul class="pl-6 list-disc md:pl-8">
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
          <!-- <p>
            {{ $t("components.modal-qr-code.section-3-paragraph-1") }}
          </p> -->
          <BtnLabeled
            @click="downloadQRCode()"
            class="hidden md:flex"
            :cta="true"
            :label="$t('components.modal-qr-code.download-qr-code')"
            fontSize="lg"
            :ariaLabel="
              $t('components.modal-qr-code.download-qr-code-aria-label')
            "
          />
        </div>
        <div class="px-4 md:pl-8 md:pb-2">
          <QRCode class="rounded-3xl elem-shadow-md" />
        </div>
        <BtnLabeled
          @click="downloadQRCode()"
          class="flex md:hidden"
          :cta="true"
          :label="$t('components.modal-qr-code.download-qr-code')"
          fontSize="lg"
          :ariaLabel="
            $t('components.modal-qr-code.download-qr-code-aria-label')
          "
        />
      </div>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import html2canvas from "html2canvas";

const props = defineProps<{
  entityName: string;
}>();

const qrCodeFileName: string = props.entityName
  .toLowerCase()
  .replaceAll(" ", "_");

function downloadQRCode() {
  const style = document.createElement("style");
  document.head.appendChild(style);
  style.sheet?.insertRule(
    "body > div:last-child img { display: inline-block; }"
  );

  html2canvas(document.querySelector("#qrcode")!, {
    backgroundColor: null,
  }).then((canvas) => {
    const link = document.createElement("a");
    link.download = "activist_" + qrCodeFileName + "_qr_code.png";
    link.href = canvas.toDataURL();
    link.click();
    style.remove();
  });
}
</script>
