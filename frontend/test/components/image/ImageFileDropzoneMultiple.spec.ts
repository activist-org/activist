// SPDX-License-Identifier: AGPL-3.0-or-later
import FileDropZone from "@/components/image/ImageFileDropZone.vue";
import MultipleImageDropzone from "@/components/image/ImageMultipleFileDropZone.vue";
import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { FileUploadMix, UploadableFile } from "~/types/content/file";

// Helpers to generate mock files and FileUploadMix objects.
function createFiles() {
  const png = new File(["png-bytes"], "a.png", { type: "image/png" });
  const jpg = new File(["jpg-bytes"], "b.jpg", { type: "image/jpeg" });
  return [png, jpg];
}

function createFileUploadMix(
  name: string,
  url: string,
  type: "upload" | "file" = "upload",
  sequence: number = 0,
  sequence_index: number = 0
): FileUploadMix {
  return {
    type,
    data: {
      name,
      url,
      fileObject: url,
      id: Math.random().toString(36).slice(2),
      sequence_index,
      creation_date: new Date().toISOString(),
    },
    sequence,
  };
}

// Mock the composable at the top level.
const mockHandleAddFiles = vi.fn();
const mockRemoveFile = vi.fn();

vi.mock("@/composables/useFileManager", () => ({
  useFileManager: () => ({
    handleAddFiles: mockHandleAddFiles,
    removeFile: mockRemoveFile,
  }),
}));

describe("MultipleImageDropzone", () => {
  beforeEach(() => {
    // Reset and configure mocks for each test.
    mockHandleAddFiles.mockReset();
    mockRemoveFile.mockReset();

    mockHandleAddFiles.mockImplementation((files: File[], localFiles) => {
      const newFiles = files.map((f) =>
        createFileUploadMix(f.name, URL.createObjectURL(f))
      );
      return localFiles.concat(newFiles);
    });

    mockRemoveFile.mockImplementation((localFiles, data) => {
      const idx = localFiles.findIndex(
        (f: FileUploadMix) => (f.data as UploadableFile)?.name === data.name
      );
      if (idx !== -1) {
        localFiles.splice(idx, 1);
      }
      return localFiles;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders dropzone when under uploadLimit and updates the number of files", async () => {
    const wrapper = mount(MultipleImageDropzone, {
      props: {
        modelValue: [],
        uploadLimit: 2,
      },
      global: {
        stubs: {
          draggable: true,
          Icon: true,
        },
      },
    });

    // Dropzone should be visible.
    expect(wrapper.findComponent(FileDropZone).exists()).toBe(true);

    // Number of files shown as 0 initially.
    expect(wrapper.text()).toContain("0");
  });

  it("emits update:modelValue and files-dropped when files are added", async () => {
    const wrapper = mount(MultipleImageDropzone, {
      props: {
        modelValue: [],
        uploadLimit: 2,
      },
      global: {
        stubs: {
          draggable: true,
          Icon: true,
        },
      },
    });

    // Simulate handleAdd (call from FileDropZone).
    const files = createFiles();
    const fileDropZone = wrapper.findComponent(FileDropZone);

    // Emit the files-dropped event as the component would in production.
    await fileDropZone.vm.$emit("files-dropped", files);

    // Wait for reactivity to flush.
    await wrapper.vm.$nextTick();

    // The handleAddFiles is called.
    expect(mockHandleAddFiles).toHaveBeenCalledWith(files, []);

    // Should emit update:modelValue and files-dropped.
    const updateEmits = wrapper.emitted("update:modelValue");
    const filesDroppedEmits = wrapper.emitted("files-dropped");
    expect(updateEmits).toBeTruthy();
    expect(filesDroppedEmits).toBeTruthy();
    expect((updateEmits![0][0] as FileUploadMix[]).length).toBe(2);
    expect((filesDroppedEmits![0][0] as FileUploadMix[]).length).toBe(2);
  });

  it("shows multiple limit warning when limit is reached", async () => {
    const fileMixes = [
      createFileUploadMix("a.png", "blob:a"),
      createFileUploadMix("b.jpg", "blob:b"),
    ];
    const wrapper = mount(MultipleImageDropzone, {
      props: {
        modelValue: fileMixes,
        uploadLimit: 2,
      },
      global: {
        stubs: {
          draggable: true,
          Icon: true,
        },
      },
    });
    // Should show multiple limit warning.
    expect(wrapper.text()).toMatch(/2/i);
  });

  it("emits file-deleted when a file is removed", async () => {
    const fileMixes = [
      createFileUploadMix("a.png", "blob:a"),
      createFileUploadMix("b.jpg", "blob:b"),
    ];
    const files = [...fileMixes];
    const wrapper = mount(MultipleImageDropzone, {
      props: {
        modelValue: fileMixes,
        uploadLimit: 3,
      },
      global: {
        stubs: {
          draggable: {
            template: `
              <div>
                <slot
                  name="item"
                  v-for="(element, index) in modelValue"
                  :key="index"
                  :element="element"
                  :index="index"
                />
              </div>
            `,
            props: ["modelValue"],
          },
          Icon: true,
        },
      },
    });

    // Wait for component to render.
    await wrapper.vm.$nextTick();

    // Look for delete buttons.
    const deleteButtons = wrapper.findAll("button.text-action-red");

    expect(deleteButtons.length).toBeGreaterThan(0);
    await deleteButtons[0].trigger("click");

    // Now check emitted events.
    const deletedEmits = wrapper.emitted("file-deleted");
    expect(deletedEmits).toBeTruthy();
    expect(deletedEmits![0][0] as FileUploadMix).toEqual(files[0]);
  });
});
