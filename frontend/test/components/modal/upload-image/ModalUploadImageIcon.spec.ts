// SPDX-License-Identifier: AGPL-3.0-or-later
import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import ModalUploadImageIcon from "../../../../app/components/modal/upload-image/ModalUploadImageIcon.vue";
import { useFileManager } from "../../../../app/composables/useFileManager";
import { EntityType } from "../../../../shared/types/entity";
import { MAX_IMAGE_SIZE_IN_BYTES } from "../../../../shared/utils/uploadLimits";

const showToastError = vi.fn();
const uploadOrganizationIconImage = vi.fn();
const uploadEventIconImage = vi.fn();
const handleCloseModal = vi.fn();

const ModalBaseStub = {
  name: "ModalBase",
  props: ["modalName"],
  template: "<div><slot /></div>",
};

const DialogTitleStub = {
  name: "DialogTitle",
  template: "<div><slot /></div>",
};

const ImageFileDropZoneStub = {
  name: "ImageFileDropZone",
  emits: ["files-dropped"],
  template:
    '<div data-testid="image-drop-zone"><slot :isDropZoneActive="false" /></div>',
};

const BtnActionStub = {
  name: "BtnAction",
  props: ["ariaLabel", "label", "disabled"],
  emits: ["click"],
  template:
    '<button :aria-label="ariaLabel" :disabled="disabled" @click="$emit(\'click\')">{{ label }}</button>',
};

function createFile(sizeInBytes: number, name: string) {
  return new File([new Uint8Array(sizeInBytes)], name, {
    type: "image/png",
  });
}

describe("ModalUploadImageIcon", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "useToaster",
      vi.fn(() => ({
        showToastError,
        showToastInfo: vi.fn(),
        showToastSuccess: vi.fn(),
      }))
    );
    vi.stubGlobal("useFileManager", useFileManager);
    vi.stubGlobal(
      "useModalHandlers",
      vi.fn(() => ({
        handleCloseModal,
      }))
    );
    vi.stubGlobal(
      "useOrganizationImageMutations",
      vi.fn(() => ({
        uploadIconImage: uploadOrganizationIconImage,
        loading: ref(false),
      }))
    );
    vi.stubGlobal(
      "useEventImageIconMutations",
      vi.fn(() => ({
        uploadIconImage: uploadEventIconImage,
        loading: ref(false),
      }))
    );

    showToastError.mockReset();
    uploadOrganizationIconImage.mockReset();
    uploadEventIconImage.mockReset();
    handleCloseModal.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does not call the upload mutation for an oversized image", async () => {
    const wrapper = mount(ModalUploadImageIcon, {
      props: {
        entityId: "org-1",
        entityType: EntityType.ORGANIZATION,
      },
      global: {
        stubs: {
          ModalBase: ModalBaseStub,
          DialogTitle: DialogTitleStub,
          ImageFileDropZone: ImageFileDropZoneStub,
          BtnAction: BtnActionStub,
          Icon: true,
        },
        mocks: {
          $t: (key: string, params?: Record<string, string>) => {
            if (!params) {
              return key;
            }

            return Object.entries(params).reduce(
              (message, [token, value]) =>
                message.replaceAll(`{${token}}`, value),
              key
            );
          },
        },
      },
    });

    const oversizedFile = createFile(MAX_IMAGE_SIZE_IN_BYTES + 1, "big.png");

    await wrapper
      .findComponent({ name: "ImageFileDropZone" })
      .vm.$emit("files-dropped", [oversizedFile]);

    await wrapper.vm.$nextTick();

    expect(uploadOrganizationIconImage).not.toHaveBeenCalled();
    expect(wrapper.findComponent({ name: "BtnAction" }).exists()).toBe(false);
  });
});
