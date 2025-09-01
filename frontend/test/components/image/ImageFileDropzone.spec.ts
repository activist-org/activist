// SPDX-License-Identifier: AGPL-3.0-or-later
import FileDropZone from "@/components/image/ImageFileDropZone.vue";
import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { h } from "vue";

function createFiles() {
  const png = new File(["png-bytes"], "a.png", { type: "image/png" });
  const jpg = new File(["jpg-bytes"], "b.jpg", { type: "image/jpeg" });
  return [png, jpg];
}

describe("FileDropZone", () => {
  let clickSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    clickSpy = vi
      .spyOn(HTMLInputElement.prototype, "click")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    clickSpy.mockRestore();
  });

  it("toggles isDropZoneActive on drag events and resets on drop", async () => {
    const wrapper = mount(FileDropZone, {
      slots: {
        default: (slotProps: { isDropZoneActive: boolean }) =>
          h(
            "span",
            { "data-test": "active" },
            String(slotProps.isDropZoneActive)
          ),
      },
    });

    const root = wrapper.get("div");
    const active = () => wrapper.get('[data-test="active"]').text();

    expect(active()).toBe("false"); // initial state

    await root.trigger("dragenter");
    expect(active()).toBe("true");

    await root.trigger("dragover");
    expect(active()).toBe("true");

    await root.trigger("dragleave");
    expect(active()).toBe("false");

    await root.trigger("dragenter");
    expect(active()).toBe("true");

    // Drop should emit and reset active = false.
    const files = createFiles();
    await root.trigger("drop", { dataTransfer: { files } });
    expect(active()).toBe("false");

    const emitted = wrapper.emitted("files-dropped");
    expect(emitted).toBeTruthy();
    expect(emitted?.[0]?.[0]).toBe(files);
  });

  it("emits files-dropped with files from drop event", async () => {
    const wrapper = mount(FileDropZone);
    const files = createFiles();

    await wrapper.get("div").trigger("drop", { dataTransfer: { files } });

    const emitted = wrapper.emitted("files-dropped");
    expect(emitted).toBeTruthy();
    expect(emitted?.length).toBe(1);
    expect(emitted?.[0]).toEqual([files]);
  });

  it("emits files-dropped with files from file input change", async () => {
    const wrapper = mount(FileDropZone);
    const input = wrapper.get('input[type="file"]').element as HTMLInputElement;
    const files = createFiles();
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(files[0]);

    input.files = dataTransfer.files;
    await wrapper.find('input[type="file"]').trigger("change");

    const emitted = wrapper.emitted("files-dropped");
    expect(emitted).toBeTruthy();
    expect(emitted?.length).toBe(1);
    expect(emitted?.[0]).toEqual([[files[0]]]);
  });

  it("clicking the drop zone triggers hidden file input click", async () => {
    const wrapper = mount(FileDropZone);

    await wrapper.get("div").trigger("click");

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });
});
