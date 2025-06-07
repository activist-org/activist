// SPDX-License-Identifier: AGPL-3.0-or-later

import type { ContentImage } from "~/types/content/image";

type ImageUploadEntity =
  | "event-icon"
  | "group-carousel"
  | "group-icon"
  | "organization-carousel"
  | "organization-icon";

const ENTITY_ID_FIELDS = {
  "event-icon": {
    id_field: "event_id",
  },
  "group-carousel": {
    id_field: "group_id",
  },
  "group-icon": {
    id_field: "group_id",
  },
  "organization-carousel": {
    id_field: "organization_id",
  },
  "organization-icon": {
    id_field: "organization_id",
  },
} as const;

const colorMode = useColorMode();

const defaultImageUrls = computed(() => {
  const imageColor = colorMode?.preference == "light" ? "light" : "dark";
  return [
    `${GET_ACTIVE_IMAGE_URL}_${imageColor}.png`,
    `${GET_ORGANIZED_IMAGE_URL}_${imageColor}.png`,
    `${GROW_ORGANIZATION_IMAGE_URL}_${imageColor}.png`,
  ];
});

// const imageUrls = ref(defaultImageUrls.value);
const imageUrls = ref<string[]>([...defaultImageUrls.value]);

export function useFileManager(entityId?: string) {
  const uploadError = ref(false);
  const files = ref<UploadableFile[]>([]);

  // TODO: Refactor this to fetchEntityImages (group, org, etc.)
  async function fetchOrganizationImages() {
    if (!entityId) {
      console.error("useFileManager fetchOrganizationImages: Missing entityId");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_BACKEND_URL as string}/communities/organizations/${entityId}/images`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("accessToken")}`,
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
      console.error("Error fetching organization images:", error);
      uploadError.value = true;
    }
  }

  async function fetchIconImage(id: string, entity: ImageUploadEntity) {
    if (!id || !entity) {
      console.error("Missing id or entity");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_BACKEND_URL as string}/content/images/${id}`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        const data = (await response.json()) as ContentImage[];
        return data;
      }
    } catch (error) {
      console.error("Error fetching icon image:", error);
    }
  }

  async function uploadFiles(id: string, entity: ImageUploadEntity) {
    if (!id || !entity) {
      console.error("Missing id or entity");
      return;
    }

    const formData = new FormData();

    const entityIdField =
      ENTITY_ID_FIELDS[entity as keyof typeof ENTITY_ID_FIELDS]?.id_field ?? "";

    // Entities are sorted out in backend/content/serializers.py ImageSerializer.create()
    formData.append(entityIdField, id);
    formData.append("entity", entity);

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
            Authorization: `Token ${localStorage.getItem("accessToken")}`,
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
      console.error("Upload failed:", error);
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
            Authorization: `Token ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (error) {
      console.error("Delete image failed:", error);
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
    fetchIconImage,
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
