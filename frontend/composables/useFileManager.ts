// SPDX-License-Identifier: AGPL-3.0-or-later
export default function useFileManager(initialFiles: File[] = []) {
  const files = ref<UploadableFile[]>([]);
  handleFiles(initialFiles);

  async function uploadFiles(organizationId?: string) {
    const formData = new FormData();
    files.value.forEach((uploadableFile: UploadableFile) => {
      formData.append("file_object", uploadableFile.file);
    });

    if (organizationId) {
      formData.append("organization_id", organizationId);
    }

    try {
      const { getToken } = useToken();
      const token = await  getToken();

      const response = await fetch(
        `${BASE_BACKEND_URL as string}/content/images/`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = (await response.json()) as ImageResponse;
        files.value = [];
        return data;
      }
    } catch (error) {
      console.error("Upload failed:", error);
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
    files,
    handleFiles,
    removeFile,
    uploadFiles,
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

interface ImageResponse {
  id: string;
  fileLocation: string;
  creationDate: string;
}
