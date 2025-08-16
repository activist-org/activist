// SPDX-License-Identifier: AGPL-3.0-or-later
export interface ContentImage {
  id: string;
  fileObject: string;
  creation_date: string;
}
export class UploadableFile {
  file: File;
  url: string;
  name: string;
  status: null;
  id: string;
  constructor(file: File) {
    this.file = file;
    this.name = file.name;
    this.id = `${file.name}-${file.size}-${file.lastModified}-${file.type}`;
    this.url = URL.createObjectURL(file);
    this.status = null;
  }
}

export interface FileImageMix {
  type: "image" | "upload";
  data:UploadableFile| ContentImage;
}
