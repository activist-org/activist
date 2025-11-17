// SPDX-License-Identifier: AGPL-3.0-or-later
export interface ContentImage {
  id: string;
  fileObject: string;
  creation_date: string;
  sequence_index?: number;
}

export interface FileUploadMix {
  type: "file" | "upload";
  data: UploadableFile | ContentImage;
  sequence: number;
}
