<template>
  <ModalBase>
    <template #normalDisplay>
      <button
        class="elem-on-card-style focus-brand absolute right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md sm:h-16 sm:w-16"
        :aria-label="$t('components.modal-qr-code.open-modal-aria-label')"
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
      </button>
    </template>
    <template #modalDisplay>
      <DialogTitle class="flex justify-between font-display">
        <p class="md:responsive-h2 text-3xl font-bold">
          {{ $t("components.modal-qr-code.header") }}
        </p>
      </DialogTitle>
      <div
        class="flex flex-col items-center space-y-6 pb-6 md:grid md:grid-cols-2 md:grid-rows-1 lg:mr-14 lg:grid-cols-3 lg:grid-rows-1 lg:space-x-6 lg:space-y-0 lg:pr-8"
      >
        <div
          class="col-span-2 items-center space-y-4 pt-2 text-left font-medium"
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
          <ul class="list-disc pl-6 md:pl-8">
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
          <BtnActionDropdown
            @main-btn-clicked="handleMainBtnClicked"
            class="hidden w-fit md:block"
            :cta="true"
            :label="$t('components.btn-action-dropdown.download-qr-code')"
            fontSize="lg"
            iconSize="1.25em"
            dropdownIcon="bi:chevron-down"
            :dropdownOptions="availableFormats"
            :dropdownOptionsCallback="downloadQRCode"
            ariaLabel="
              $t('components.btn-action-dropdown.download-qr-code-aria-label')
            "
            :ariaLabelDropdown="
              $t('components.btn-action-dropdown.qr-code-options-aria-label')
            "
          />
        </div>
        <div class="px-4 md:pb-2 md:pl-8">
          <QRCode ref="qrcode" class="elem-shadow-md select-none rounded-3xl" />
        </div>
        <BtnActionDropdown
          @main-btn-clicked="handleMainBtnClicked"
          class="w-fit md:hidden"
          :cta="true"
          :label="$t('components.btn-action-dropdown.download-qr-code')"
          fontSize="lg"
          iconSize="1.25em"
          dropdownIcon="bi:chevron-down"
          :dropdownOptions="availableFormats"
          :dropdownOptionsCallback="downloadQRCode"
          :ariaLabel="
            $t('components.btn-action-dropdown.download-qr-code-aria-label')
          "
          :ariaLabelDropdown="
            $t('components.btn-action-dropdown.qr-code-options-aria-label')
          "
        />
      </div>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import { DialogTitle } from "@headlessui/vue";

const qrcode = ref();

const qrPixelGraphicsSize = computed(() => {
  if (qrcode?.value) {
    const size = qrcode!.value!.getSize();
    const width = 1500;
    const height: number = Math.round(width * (size.height / size.width));
    return { width: width, height: height };
  } else {
    return undefined;
  }
});

const availableFormats: Ref<string[]> = computed(() => {
  const size = qrPixelGraphicsSize.value;
  const qrCodeIsReady = size != undefined;
  return [
    "PNG" +
      (qrCodeIsReady
        ? ` (${size.width
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} x ${size.height
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} px)`
        : ""),
    "JPEG" +
      (qrCodeIsReady
        ? ` (${size.width
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} x ${size.height
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} px)`
        : ""),
    "SVG",
  ];
});

const props = defineProps<{
  entityName: string;
}>();

function drawInlineSVG(
  svgElement: any,
  ctx: any,
  width: number,
  height: number,
  callback: any,
) {
  const svgURL = new XMLSerializer().serializeToString(svgElement);
  const img = new Image();
  img.onload = function () {
    ctx.drawImage(this, 0, 0, width, height);
    callback();
  };
  img.src = "data:image/svg+xml; charset=utf8, " + encodeURIComponent(svgURL);
}

const handleMainBtnClicked = () => {
  downloadQRCode("PNG");
};

const qrCodeFileName: string =
  "qr_code_" + props.entityName.toLowerCase().replaceAll(" ", "_");

function downloadQRCode(format: string) {
  const svgData = document.querySelector("#result-qr")!;
  const def = document.createElement("def");
  def.innerHTML = `<style>
  /* latin-ext */
@font-face {
  font-family: 'Red Hat Display';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(data:font/woff2;base64,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) format('woff2');
  unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Red Hat Display';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(data:font/woff2;base64,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) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
        </style>`;
  svgData.appendChild(def);
  if (format == "SVG") {
    const svgBlob = new Blob([svgData.outerHTML], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = `${qrCodeFileName}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } else if (format.startsWith("PNG") || format.startsWith("JPEG")) {
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    const size = qrPixelGraphicsSize.value;
    canvas.width = size!.width;
    canvas.height = size!.height;
    const ctx = canvas.getContext("2d")!;
    const isJPEG = format.startsWith("JPEG");
    if (isJPEG) {
      // Avoid black background in jpeg files.
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    const fileExtension = isJPEG ? "jpeg" : "png";
    drawInlineSVG(svgData, ctx, canvas.width, canvas.height, function () {
      const downloadLink = document.createElement("a");
      downloadLink.href = canvas.toDataURL(`image/${fileExtension}`, 1.0);
      downloadLink.download = `${qrCodeFileName}.${fileExtension}`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
  }
}
</script>
