// SPDX-License-Identifier: AGPL-3.0-or-later
export function useQRCode(qrCodeFileName: string) {
  const showTooltip = ref(false);

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

  function drawInlineSVG(
    svgElement: Element,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ctx: any,
    width: number,
    height: number,
    callback: () => void
  ) {
    const svgUrl = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    img.onload = function () {
      ctx.drawImage(this, 0, 0, width, height);
      callback();
    };
    img.src = "data:image/svg+xml; charset=utf8, " + encodeURIComponent(svgUrl);
  }

  function addFontStyling(svgElement: Element) {
    const def = document.createElement("def");
    def.innerHTML = `<style>${QR_CODE_FONT_CSS}</style>`;
    svgElement.appendChild(def);
  }

  function getPNGDataUrl(svgElement: Element): Promise<string> {
    addFontStyling(svgElement);
    const canvas = document.createElement("canvas");
    const size = qrPixelGraphicsSize.value;
    canvas.width = size!.width;
    canvas.height = size!.height;
    const ctx = canvas.getContext("2d")!;
    return new Promise((resolve) => {
      drawInlineSVG(svgElement, ctx, canvas.width, canvas.height, function () {
        resolve(canvas.toDataURL("image/png"));
      });
    });
  }

  function downloadQRCode(format: string) {
    const svgData = document.querySelector("#result-qr")!;
    const def = document.createElement("def");
    def.innerHTML = `<style>${QR_CODE_FONT_CSS}</style>`;
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

  function onImageClick() {
    const svgData = document.querySelector("#result-qr");
    if (svgData !== null) {
      getPNGDataUrl(svgData).then((url) => {
        const win = window.open()!;
        // win.document.write(`<iframe width="100%" height="100%" src="${url}"></iframe>`);
        win.document.write(`<style>
* {
  margin: 0;
  padding: 0;
}
div {
  display: grid;
  height: 100%;
}
img {
  max-width: 100%;
  max-height: 100vh;
  margin: auto;
}
      </style>`);
        win.document.write(`<div><img src="${url}"></img></div>`);
        win.document.write(`<script>
        window.addEventListener("keydown", function (event) {
          if (event.key === "s" && (event.ctrlKey || event.metaKey)) {
            const downloadLink = document.createElement("a");
            downloadLink.href = document.querySelector("img").src;
            downloadLink.download = "${qrCodeFileName}.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          }
        }, false);
      <${"/"}script>`);
      });
    }
  }

  return {
    showTooltip,
    availableFormats,
    downloadQRCode,
    onImageClick,
    qrcode,
  };
}
