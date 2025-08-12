// SPDX-License-Identifier: AGPL-3.0-or-later

import type { ContentImage } from "~/types/content/image";
import type { EntityType } from "~/types/entity";

const colorMode = useColorMode();
const { token } = useAuth();
const defaultImageUrls = computed(() => {
  const imageColor = colorMode?.preference == "light" ? "light" : "dark";
  return [
    `${GET_ACTIVE_IMAGE_URL}_${imageColor}.png`,
    `${GET_ORGANIZED_IMAGE_URL}_${imageColor}.png`,
    `${GROW_ORGANIZATION_IMAGE_URL}_${imageColor}.png`,
  ];
});

const imageUrls = ref<string[]>([...defaultImageUrls.value]);

export function useFileManager(entityId?: string) {
  const uploadError = ref(false);
  const files = ref<UploadableFile[]>([]);

  // TODO: Refactor this to fetchEntityImages (group, org, etc.)
  async function fetchOrganizationImages() {
    if (!entityId) {
      return;
    }

    try {
      const response = await fetch(
        `${BASE_BACKEND_URL as string}/communities/organizations/${entityId}/images`,
        {
          headers: {
            Authorization: `${token.value}`,
          },
        }
      );

      if (response.ok) {
        const data = (await response.json()) as ContentImage[];

        imageUrls.value =
          data.length > 0
            ? data.map((img: ContentImage) => img.fileObject)
            : [...defaultImageUrls.value];
        uploadError.value = false;
      } else {
        uploadError.value = true;
      }
    } catch (error) {
      uploadError.value = true;
      void error;
    }
  }

  async function uploadIconImage(id: string, entityType:EntityType ) {
    if (!id || !entityType) {
      return;
    }

    try {
      const formData = new FormData();
    formData.append('entity_id', id);
    formData.append("entity", entityType );
    files.value.forEach((uploadableFile: UploadableFile) => {
      formData.append("file_object", uploadableFile.file);
    });
      const response = await fetch(
        `${BASE_BACKEND_URL as string}/content/image_icon`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `${token.value}`,
          },
        }
      );

      if (response.ok) {
        return (await response.json()) as ContentImage[];
      }
    } catch (error) {
      void error;
    }
  }

  async function uploadFiles(id: string, entityType: EntityType) {
    if (!id || !entityType) {
      return;
    }

    const formData = new FormData();

    // Entities are sorted out in backend/content/serializers.py ImageSerializer.create().
    formData.append('entity_id', id);
    formData.append("entity", entityType );

    files.value.forEach((uploadableFile: UploadableFile) => {
      formData.append("file_object", uploadableFile.file);
    });

    try {
      const response = await fetch(
        `${BASE_BACKEND_URL as string}/content/images`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `${token.value}`,
          },
        }
      );

      if (response.ok) {
        // imageUrls works with arrays.
        // Icon upload returns a single object.
        // Carousel upload returns an array of objects.
        // This is why we need to check if the rawData is an array.
        const rawData = (await response.json()) as ContentImage[];
        const data = Array.isArray(rawData) ? rawData : [rawData];

        files.value = [];

        imageUrls.value =
          data.length > 0
            ? data.map((img: ContentImage) => img.fileObject)
            : [...defaultImageUrls.value];

        return data;
      }
    } catch (error) {
      void error;
    }
  }

  async function deleteImage(imageId: string) {
    if (!imageId) {
      return;
    }

    try {
      return await fetch(
        `${BASE_BACKEND_URL as string}/content/images/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token.value}`,
          },
        }
      );
    } catch (error) {
      void error;
    }
  }

  function handleFiles(newFiles: File[]) {
    const allowedTypes = ["image/jpeg", "image/png"];
    const validFiles = [...newFiles].filter((file) =>
      allowedTypes.includes(file.type)
    );

    const newUploadableFiles = validFiles
      .map((file) => new UploadableFile(file))
      .filter((file) => !fileExists(file.id));

    files.value = [...files.value, ...newUploadableFiles];
  }

  function fileExists(otherId: string) {
    return files.value.some((file: UploadableFile) => file.id === otherId);
  }

  function removeFile(file: UploadableFile) {
    const index = files.value.indexOf(file);
    if (index > -1) {
      files.value.splice(index, 1);
    }
  }

  return {
    imageUrls,
    uploadError,
    files,
    uploadIconImage,
    fetchOrganizationImages,
    uploadFiles,
    deleteImage,
    handleFiles,
    removeFile,
  };
}

class UploadableFile {
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
