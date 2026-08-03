// SPDX-License-Identifier: AGPL-3.0-or-later

export function downloadBlob(blob: Blob, filename: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  try {
    link.href = objectUrl;
    link.download = filename;
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();
    URL.revokeObjectURL(objectUrl);
  }
}
