// SPDX-License-Identifier: AGPL-3.0-or-later
interface ContentImage {
  id: string;
  fileObject: string;
  creation_date: string;
}

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

  async function uploadSingleFile(id: string, entity: string) {
    // TODO make sure endponts are correct.
    const ENDPOINT_PATHS = {
      "event-icon": `${BASE_BACKEND_URL as string}/events/events/${id}/`,
      // "group-carousel": `${BASE_BACKEND_URL as string}/communities/groups/${id}/images/`,
      // "group-icon": `${BASE_BACKEND_URL as string}/communities/groups/${id}/images/`,
      // "organization-carousel": `${BASE_BACKEND_URL as string}/content/images/`,
      // "organization-icon": `${BASE_BACKEND_URL as string}/content/images/`,
    } as const;

    const endpointPath = computed(
      () => ENDPOINT_PATHS[entity as keyof typeof ENDPOINT_PATHS] ?? ""
    );
    console.log("uploadSingleFile: ", id, entity, endpointPath.value);

    const formData = new FormData();

    files.value.forEach((uploadableFile: UploadableFile) => {
      formData.append("file_object", uploadableFile.file);
    });

    for (const pair of formData.entries()) {
      console.log(`formData:${pair[0]}:`, pair[1]);
    }

    let data: ContentImage[] | null = null;

    // Upload image file. Get the uuid filename to update the event icon_url field with.
    // Upload always happens, in all use cases.
    // Sometimes it's a single file (icon upload). In this case, you need to update the icon_url field in the associated entity.
    // Sometimes it's multiple files (carousel upload).
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
        data = (await response.json()) as ContentImage[];

        files.value = [];

        // return data;
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }

    console.log("after image upload data.id: ", data?.[0]?.id);

    // Update event icon_url field with the uploaded image URL.
    try {
      const response = await fetch(endpointPath.value, {
        method: "PATCH",
        body: JSON.stringify({ iconUrl: data?.[0]?.id }),
        headers: {
          Authorization: `Token ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      console.log("RESPONSE: ", response);

      if (response.ok) {
        data = (await response.json()) as ContentImage[];
        files.value = [];

        console.log("after event update: ", data);

        return data;
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
    // In parent/caller, call <<getEvent/Group/Organization/???/ById()>> to get the updated entity and therefore the updated icon_url field.
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
