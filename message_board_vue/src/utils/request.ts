import axios from "axios";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/modules/user";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
});

instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    config.headers.token = userStore.token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (err) => {
    const status = err.response?.status;
    switch (status) {
      case 401:
        ElMessage.error("登录过期，请重新登录");
        break;
      case 403:
        ElMessage.error("您没有权限访问该资源");
        break;
      case 404:
        ElMessage.error("资源不存在");
        break;
      default:
        ElMessage.error("请求失败，请稍后重试");
        break;
    }
    return Promise.reject(err);
  }
);

const get = (
  url: string,
  params?: Record<string, any>,
  onProgress?: (progress: number) => void
) => {
  return instance.get(url, {
    params,
    onDownloadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        onProgress(progress);
      }
    },
  });
};

const post = (
  url: string,
  data?: Record<string, any>,
  onProgress?: (progress: number) => void
) => {
  return instance.post(url, data, {
    headers: {
      "Content-Type": "application/json",
    },
    onDownloadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        onProgress(progress);
      }
    },
  });
};

export default instance;
export { get, post };
