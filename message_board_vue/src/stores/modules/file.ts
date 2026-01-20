import { uploadFileApi } from "@/api/fileApi";
import type { UploadFileInfo } from "@/types/file";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useFileStore = defineStore("file", () => {
  const fileList = ref([]);

  const uploadFile = async (fileInfo: UploadFileInfo) => {
    return await uploadFileApi(fileInfo);
  };

  return { fileList, uploadFile };
});
