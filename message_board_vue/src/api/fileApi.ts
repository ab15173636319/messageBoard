import type { UploadFileInfo } from "@/types/file";
import { post } from "@/utils/request";

export async function uploadFileApi(FileInfo: UploadFileInfo) {
  try {
    // 只能上传jpg,png,gif,mp4格式
    if (
      FileInfo.file.type !== "image/jpeg" &&
      FileInfo.file.type !== "image/png" &&
      FileInfo.file.type !== "image/gif" &&
      FileInfo.file.type !== "video/mp4"
    ) {
      return Promise.reject("只能上传jpg,png,gif格式");
    }

    const res = await post("/file/upload", FileInfo, {
      "Content-Type": "multipart/form-data;",
    });
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
}
