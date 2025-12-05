// SPDX-License-Identifier: AGPL-3.0-or-later
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import type { ContentImage, FileUploadMix } from "../../shared/types/file-type";

import { useFileManager } from "../../app/composables/useFileManager";
import { BASE_BACKEND_URL } from "../../app/constants/baseUrls";
import { UploadableFile } from "../../shared/types/file";

const mockFetch = vi.fn();

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
    // Stub global fetch.
    vi.stubGlobal("fetch", mockFetch);

    vi.stubGlobal(
      "useAuth",
      vi.fn(() => ({ token: ref("TEST_TOKEN") }))
    );

    vi.stubGlobal(
      "useColorMode",
      vi.fn(() => ref<"light" | "dark">("light"))
    );

    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });
  it("does nothing in deleteImage when imageId is empty", async () => {
    const { deleteImage } = useFileManager();

    await deleteImage("");

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("calls backend DELETE with auth header when deleteImage is called with an id", async () => {
    const { deleteImage } = useFileManager();

    mockFetch.mockResolvedValueOnce(
      new Response(null, { status: 204 }) as unknown
    );

    await deleteImage("image-123");

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_BACKEND_URL as string}/content/images/image-123`,
      expect.objectContaining({
        method: "DELETE",
        headers: {
          Authorization: "TEST_TOKEN",
        },
      })
    );
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

  it("getIconImage returns UploadableFile when a file is provided", () => {
    const { getIconImage } = useFileManager();

    const file = new File(["dummy"], "logo.png", { type: "image/png" });
    const result = getIconImage([file]);

    expect(result).toBeInstanceOf(UploadableFile);
  });

  it("getIconImage returns an Error when no file is provided", () => {
    const { getIconImage } = useFileManager();

    const result = getIconImage([]);

    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe("No file provided to upload.");
  });

  it("handleAddFiles filters by allowed mime types and appends upload entries", () => {
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
      new File(["txt"], "readme.txt", { type: "text/plain" }), // invalid type
      new File(["gif"], "animation.gif", { type: "image/gif" }), // invalid type
    ];

    const result = handleAddFiles(newFiles, existingFiles);

    expect(result).toHaveLength(3);

    const newEntries = result.slice(1); // skip the existing one
    newEntries.forEach((entry, idx) => {
      expect(entry.type).toBe("upload");
      expect(entry.sequence).toBe(idx + existingFiles.length);
      // Data is an UploadableFile instance.
      expect(entry.data).toBeInstanceOf(UploadableFile);
    });
  });

  it("removeFile removes an UploadableFile from the list without calling backend", async () => {
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

    await removeFile(files, uploadFile);

    expect(files).toHaveLength(1);
    expect(files[0].data).not.toBe(uploadFile);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("removeFile removes a ContentImage and calls deleteImage (backend)", async () => {
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

    mockFetch.mockResolvedValueOnce(
      new Response(null, { status: 204 }) as unknown
    );

    expect(files).toHaveLength(2);

    await removeFile(files, contentImage);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_BACKEND_URL as string}/content/images/backend-image-1`,
      expect.objectContaining({
        method: "DELETE",
        headers: {
          Authorization: "TEST_TOKEN",
        },
      })
    );

    expect(files).toHaveLength(1);
    expect((files[0].data as ContentImage).id).toBe("backend-image-2");
  });

  it("exposes uploadError ref and initializes it to false", () => {
    const { uploadError } = useFileManager();

    expect(uploadError.value).toBe(false);
  });
});
