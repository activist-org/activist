// SPDX-License-Identifier: AGPL-3.0-or-later
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import type { ContentImage, FileUploadMix } from "../../shared/types/file-type";

import { useFileManager } from "../../app/composables/useFileManager";
import { MAX_IMAGE_SIZE_IN_BYTES } from "../../shared/constants/uploadLimits";
import { UploadableFile } from "../../shared/types/file";
import { createUseColorModeSpy } from "../mocks/composableMocks";

const mockFetch = vi.fn();
const { toastError, toastInfo, toastSuccess } = vi.hoisted(() => ({
  toastError: vi.fn(),
  toastInfo: vi.fn(),
  toastSuccess: vi.fn(),
}));

vi.mock("vue-sonner", () => ({
  toast: {
    error: toastError,
    info: toastInfo,
    success: toastSuccess,
  },
}));

const createUploadEntry = (
  file: UploadableFile,
  sequence: number
): FileUploadMix =>
  ({
    type: "upload",
    data: file,
    sequence,
  }) as FileUploadMix;

// Create a FileUploadMix entry representing an existing backend file.
const createExistingFileEntry = (
  image: ContentImage,
  sequence: number
): FileUploadMix =>
  ({
    type: "file",
    data: image,
    sequence,
  }) as FileUploadMix;

describe("useFileManager", () => {
  beforeEach(() => {
    // Stub global $fetch (used by http.ts del() helper).
    vi.stubGlobal("$fetch", mockFetch);

    // Use factories to create mocks.
    globalThis.useColorMode = createUseColorModeSpy("light", "light");

    mockFetch.mockReset();
    toastError.mockReset();
    toastInfo.mockReset();
    toastSuccess.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });
  it("computes defaultImageUrls for light color mode", () => {
    // Make sure useColorMode returns "light" for this call.
    vi.stubGlobal(
      "useColorMode",
      vi.fn(() => ref<"light" | "dark">("light"))
    );

    const { defaultImageUrls } = useFileManager();

    expect(defaultImageUrls.value).toHaveLength(3);
    defaultImageUrls.value.forEach((url: string) => {
      expect(url).toMatch(/_light\.png$/);
    });
  });

  it("computes defaultImageUrls for dark color mode", () => {
    vi.stubGlobal(
      "useColorMode",
      vi.fn(() => ref<"light" | "dark">("dark"))
    );

    const { defaultImageUrls } = useFileManager();

    expect(defaultImageUrls.value).toHaveLength(3);
    defaultImageUrls.value.forEach((url: string) => {
      expect(url).toMatch(/_dark\.png$/);
    });
  });

  it("accepts a file smaller than the limit", () => {
    const { getIconImage } = useFileManager();

    const file = new File([new Uint8Array(1)], "logo.png", {
      type: "image/png",
    });
    const result = getIconImage([file]);

    expect(result).toBeInstanceOf(UploadableFile);
    expect(toastError).not.toHaveBeenCalled();
  });

  it("accepts a file exactly at the limit", () => {
    const { getIconImage } = useFileManager();

    const file = new File(
      [new Uint8Array(MAX_IMAGE_SIZE_IN_BYTES)],
      "exact-limit.png",
      { type: "image/png" }
    );
    const result = getIconImage([file]);

    expect(result).toBeInstanceOf(UploadableFile);
    expect(toastError).not.toHaveBeenCalled();
  });

  it("rejects a file larger than the limit", () => {
    const { getIconImage } = useFileManager();

    const file = new File(
      [new Uint8Array(MAX_IMAGE_SIZE_IN_BYTES + 1)],
      "too-large.png",
      { type: "image/png" }
    );
    const result = getIconImage([file]);

    expect(result).toBeNull();
    expect(toastError).toHaveBeenCalledTimes(1);
    expect(toastError).toHaveBeenCalledWith(
      "The file 'too-large.png' is too large. The maximum allowed size is 5 MB."
    );
  });

  it("accepts multiple valid images", () => {
    const { handleAddFiles } = useFileManager();

    const newFiles: File[] = [
      new File([new Uint8Array(1)], "photo-1.png", { type: "image/png" }),
      new File([new Uint8Array(2)], "photo-2.jpg", { type: "image/jpeg" }),
    ];

    const result = handleAddFiles(newFiles, []);

    expect(result).toHaveLength(2);
    expect(result.map((entry) => entry.data.name)).toEqual([
      "photo-1.png",
      "photo-2.jpg",
    ]);
    expect(toastError).not.toHaveBeenCalled();
  });

  it("accepts valid images and rejects oversized ones in a mixed selection", () => {
    const { handleAddFiles } = useFileManager();

    const validFile = new File([new Uint8Array(1)], "image1.jpg", {
      type: "image/jpeg",
    });
    const oversizedFile = new File(
      [new Uint8Array(MAX_IMAGE_SIZE_IN_BYTES + 1)],
      "image2.jpg",
      { type: "image/jpeg" }
    );
    const secondValidFile = new File([new Uint8Array(3)], "image3.jpg", {
      type: "image/jpeg",
    });
    const secondOversizedFile = new File(
      [new Uint8Array(MAX_IMAGE_SIZE_IN_BYTES + 2)],
      "image4.jpg",
      { type: "image/jpeg" }
    );

    const result = handleAddFiles(
      [validFile, oversizedFile, secondValidFile, secondOversizedFile],
      []
    );

    expect(result).toHaveLength(2);
    expect(result.map((entry) => entry.data.name)).toEqual([
      "image1.jpg",
      "image3.jpg",
    ]);
    expect(toastError).toHaveBeenCalledTimes(1);
    expect(toastError).toHaveBeenCalledWith(
      "The files image2.jpg and image4.jpg are too large. The maximum allowed size is 5 MB."
    );
  });

  it("rejects multiple oversized images and reports all of them", () => {
    const { handleAddFiles } = useFileManager();

    const oversizedOne = new File(
      [new Uint8Array(MAX_IMAGE_SIZE_IN_BYTES + 1)],
      "image2.jpg",
      { type: "image/jpeg" }
    );
    const oversizedTwo = new File(
      [new Uint8Array(MAX_IMAGE_SIZE_IN_BYTES + 2)],
      "image4.jpg",
      { type: "image/jpeg" }
    );

    const result = handleAddFiles([oversizedOne, oversizedTwo], []);

    expect(result).toHaveLength(0);
    expect(toastError).toHaveBeenCalledTimes(1);
    expect(toastError).toHaveBeenCalledWith(
      "The files image2.jpg and image4.jpg are too large. The maximum allowed size is 5 MB."
    );
  });

  it("preserves existing files while adding valid uploads", () => {
    const { handleAddFiles } = useFileManager();

    const existingUploadFile = new UploadableFile(
      new File(["existing"], "existing.png", { type: "image/png" })
    );
    const existingFiles: FileUploadMix[] = [
      createUploadEntry(existingUploadFile, 0),
    ];

    const newFiles: File[] = [
      new File(["jpeg"], "photo.jpeg", { type: "image/jpeg" }),
      new File(["png"], "photo.png", { type: "image/png" }),
      new File(["txt"], "readme.txt", { type: "text/plain" }),
      new File([new Uint8Array(MAX_IMAGE_SIZE_IN_BYTES + 1)], "too-big.png", {
        type: "image/png",
      }),
    ];

    const result = handleAddFiles(newFiles, existingFiles);

    expect(result).toHaveLength(3);
    expect(result[0]).toBe(existingFiles[0]);
    expect(result.slice(1).map((entry) => entry.data.name)).toEqual([
      "photo.jpeg",
      "photo.png",
    ]);
    expect(toastError).toHaveBeenCalledTimes(1);
  });

  it("removeFile removes an UploadableFile from the list without calling backend", () => {
    const { removeFile } = useFileManager();

    const uploadFile = new UploadableFile(
      new File(["img"], "icon.png", { type: "image/png" })
    );
    const files: FileUploadMix[] = [
      createUploadEntry(uploadFile, 0),
      // A dummy extra entry to prove only the target will be  removed.
      createUploadEntry(
        new UploadableFile(
          new File(["img2"], "other.png", { type: "image/png" })
        ),
        1
      ),
    ];

    expect(files).toHaveLength(2);

    removeFile(files, uploadFile);

    expect(files).toHaveLength(1);
    expect(files[0].data).not.toBe(uploadFile);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("removeFile removes a ContentImage without deleting it on the backend", () => {
    const { removeFile } = useFileManager();

    const contentImage = {
      id: "backend-image-1",
      fileObject: "https://example.com/image.png",
      creation_date: "2024-01-01T00:00:00Z",
    } as ContentImage;

    const files: FileUploadMix[] = [
      createExistingFileEntry(contentImage, 0),
      createExistingFileEntry(
        {
          id: "backend-image-2",
          fileObject: "https://example.com/other.png",
          creation_date: "2024-01-01T00:00:00Z",
        } as ContentImage,
        1
      ),
    ];

    expect(files).toHaveLength(2);

    removeFile(files, contentImage);

    expect(mockFetch).not.toHaveBeenCalled();
    expect(files).toHaveLength(1);
    expect((files[0].data as ContentImage).id).toBe("backend-image-2");
  });
});
