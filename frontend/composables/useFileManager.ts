// SPDX-License-Identifier: AGPL-3.0-or-later
interface ContentImage {
  id: string;
  fileObject: string;
  creation_date: string;
}

type Entity =
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
    id_field: "org_id",
  },
  "organization-icon": {
    id_field: "org_id",
  },
} as const;

export function useFileManager(organizationId?: string) {
  // TODO: Make these dark again.
  const defaultImageUrls = [
    useColorModeImages()(`${GET_ACTIVE_IMAGE_URL}`),
    useColorModeImages()(`${GET_ORGANIZED_IMAGE_URL}`),
    useColorModeImages()(`${GROW_ORGANIZATION_IMAGE_URL}`),
  ];

  const imageUrls = ref(defaultImageUrls);
  const uploadError = ref(false);
  const files = ref<UploadableFile[]>([]);

  async function fetchOrganizationImages() {
    if (!organizationId) {
      return;
    }

    try {
      const response = await fetch(
        `${BASE_BACKEND_URL as string}/communities/organizations/${organizationId}/images/`,
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
            : defaultImageUrls;
        uploadError.value = false;
      } else {
        uploadError.value = true;
      }
    } catch (error) {
      console.error("Error fetching organization images:", error);
      uploadError.value = true;
    }
  }

  async function uploadSingleFile(id: string, entity: Entity) {
    const entityIdField =
      ENTITY_ID_FIELDS[entity as keyof typeof ENTITY_ID_FIELDS]?.id_field ?? "";

    const formData = new FormData();

    // Entities are handled in backend/content/serializers.py ImageSerializer.create()
    formData.append(entityIdField, id);

    files.value.forEach((uploadableFile: UploadableFile) => {
      formData.append("file_object", uploadableFile.file);
    });

    for (const pair of formData.entries()) {
      console.log(`formData: ${pair[0]}:`, pair[1]);
    }
  }

  async function uploadFiles(organizationId?: string) {
    if (!organizationId) {
      return;
    }

    const formData = new FormData();
    files.value.forEach((uploadableFile: UploadableFile) => {
      formData.append("file_object", uploadableFile.file);
    });

    formData.append("organization_id", organizationId);

    try {
      const response = await fetch(
        `${BASE_BACKEND_URL as string}/content/images/`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Token ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        const data = (await response.json()) as ContentImage[];
        files.value = [];

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
        `${BASE_BACKEND_URL as string}/content/images/${imageId}/`,
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
    fetchOrganizationImages,
    uploadFiles,
    deleteImage,
    handleFiles,
    removeFile,
    uploadSingleFile,
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
