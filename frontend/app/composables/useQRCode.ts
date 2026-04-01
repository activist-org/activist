// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Composable for generating and downloading QR codes in various formats (SVG, PNG, JPEG) in the frontend application. This composable provides functions to create QR codes, add necessary font styling, draw SVG elements onto a canvas, and download the QR code in the specified format. The composable returns these functions for use in components that require QR code generation and download functionality.
 * @param qrCodeFileName The default file name to use when downloading the QR code, without the file extension.
 * @returns An object containing reactive properties and functions for managing QR code generation and download,
 * including showTooltip for controlling tooltip visibility, availableFormats for listing supported download formats with dimensions,
 * downloadQRCode for handling the download process, onImageClick for opening the QR code in a new window, and qrcode for referencing the QR code element.
 */
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
    const qrCodeIsReady = !!size;
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

  /**
   * Draws an inline SVG element onto a canvas context by converting the SVG element to a data URL and loading it as an image, then drawing the image onto the canvas with the specified width and height. The function takes a callback that is executed after the image has been drawn onto the canvas, allowing for further processing or actions to be taken once the drawing is complete.
   * @param svgElement The SVG element to be drawn onto the canvas.
   * @param ctx The canvas rendering context where the SVG will be drawn.
   * @param width The width to draw the SVG on the canvas.
   * @param height The height to draw the SVG on the canvas.
   * @param callback A function to be called after the SVG has been drawn onto the canvas, allowing for further processing or actions to be taken once the drawing is complete.
   */
  function drawInlineSVG(
    svgElement: Element,
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    callback: () => void
  ) {
    const svgUrl = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 0, 0, width, height);
      callback();
    };
    img.src = "data:image/svg+xml; charset=utf8, " + encodeURIComponent(svgUrl);
  }

  /**
   * Adds font styling to the SVG element by appending a <style> element with the QR code font CSS.
   * @param svgElement The SVG element to which the font styling will be added, allowing the QR code to be rendered with the appropriate font when drawn onto a canvas or exported as an image.
   * The function creates a <def> element, sets its innerHTML to include a <style> tag with the QR code font CSS, and appends this <def> element to the provided SVG element, ensuring that the necessary font styling is included for proper rendering of the QR code.
   */
  function addFontStyling(svgElement: Element) {
    const def = document.createElement("def");
    def.innerHTML = `<style>${QR_CODE_FONT_CSS}</style>`;
    svgElement.appendChild(def);
  }

  /**
   * Generates a PNG data URL from an SVG element by first adding font styling to the SVG, then creating a canvas element with the appropriate dimensions based on the QR code size, and finally drawing the SVG onto the canvas and converting it to a PNG data URL. The function returns a Promise that resolves to the generated PNG data URL, which can be used for downloading or displaying the QR code as an image.
   * @param svgElement The SVG element representing the QR code, which will be processed to generate a PNG data URL. The function adds necessary font styling to the SVG, creates a canvas with dimensions based on the QR code size, draws the SVG onto the canvas, and converts the canvas content to a PNG data URL that can be used for various purposes such as downloading or displaying the QR code as an image.
   * @returns A Promise that resolves to a PNG data URL generated from the provided SVG element, allowing for the QR code to be downloaded or displayed as an image in the frontend application.
   */
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

  /**
   * Downloads the QR code in the specified format (SVG, PNG, or JPEG) by creating a temporary download link and triggering a click event on it. The function handles adding necessary font styling for SVG, creating a canvas for PNG and JPEG, and setting the appropriate file extension and MIME type for the download.
   * @param format The format in which to download the QR code, either "SVG", "PNG", or "JPEG".
   */
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

  /**
   *
   */
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
