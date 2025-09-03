// SPDX-License-Identifier: AGPL-3.0-or-later
export interface ContentImage {
  id: string;
  fileObject: string;
  creation_date: string;
  sequence_index?: number;
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

export interface FileUploadMix {
  type: "file" | "upload";
  data: UploadableFile | ContentImage;
  sequence: number;
}
