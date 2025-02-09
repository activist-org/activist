// SPDX-License-Identifier: AGPL-3.0-or-later
export default function useFileManager(initialFiles: File[] = []) {
  const files = ref<UploadableFile[]>([]);
  handleFiles(initialFiles);

  async function uploadFiles() {
    const formData = new FormData();
    files.value.forEach((uploadableFile) => {
      formData.append("file_location", uploadableFile.file);
    });

    console.log(...formData.entries());

    try {
      const response = await fetch(`${BASE_BACKEND_URL}/content/images/`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Token ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
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
    return files.value.some(({ id }) => id === otherId);
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
