import type { UploadFileInfo } from "@/types/file";
import { post } from "@/utils/request";

export async function uploadFileApi(FileInfo: UploadFileInfo) {
  try {
    const res = await post("/file/upload", FileInfo, {
      "Content-Type": "multipart/form-data;",
    });
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
}
