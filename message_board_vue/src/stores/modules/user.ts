import { ref } from "vue";
import { defineStore } from "pinia";
import type {
  LoginParams,
  RegisterParams,
  UpdateUserInfoParams,
  UpdateUserPasswordParams,
  UserInfo,
} from "@/types/user";
import {
  loginApi,
  queryUserInfoApi,
  registerApi,
  updateAvatarApi,
  updatePasswordApi,
  updateUserInfoApi,
} from "@/api/user";
import { getData, saveData } from "@/utils/saveToken";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

export const useUserStore = defineStore("user", () => {
  const token = ref("");
  const userInfo = ref<UserInfo | null>(null);
  const loading = ref(false);
  const router = useRouter();
  // 初始化用户数据（从本地存储恢复 token 并查询用户信息）
  const initUserStore = async () => {
    const data = getData("token");
    if (data) {
      token.value = data as string;
      await queryUserInfo();
    } else {
      token.value = "";
    }
  };

  const login = async (data: LoginParams, remember: boolean = false) => {
    loading.value = true;
    try {
      const res = await loginApi(data);
      // @ts-ignore
      if (res.code === 200) {
        ElMessage.success("欢迎回来！");
        token.value = res.data.token;
        saveData(token.value, "token", remember);
        await queryUserInfo();
        router.push("/");
      } else {
        // @ts-ignore
        ElMessage.error(res.message);
      }
    } catch (error) {
      console.error("登录失败:", error);
    } finally {
      loading.value = false;
    }
  };

  const register = async (data: RegisterParams) => {
    loading.value = true;
    try {
      const res = await registerApi(data);
      // @ts-ignore
      if (res.code === 200) {
        ElMessage.success("注册成功！");
      } else {
        // @ts-ignore
        ElMessage.error(res.message);
      }
    } catch (error) {
      console.error("注册失败:", error);
    } finally {
      loading.value = false;
    }
  };

  const queryUserInfo = async () => {
    if (!token.value) return;
    loading.value = true;
    try {
      const res = await queryUserInfoApi();
      // @ts-ignore
      if (res.code === 200) {
        userInfo.value = res.data;
      } else {
        // @ts-ignore
        ElMessage.error(res.message);
        token.value = "";
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
      }
    } catch (error) {
      console.error("查询用户信息失败:", error);
      token.value = "";
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    } finally {
      loading.value = false;
    }
  };

  const updateUserInfo = async (data: UpdateUserInfoParams) => {
    try {
      const res = await updateUserInfoApi(data);
      // @ts-ignore
      if (res.code === 200) {
        ElMessage.success("更新成功！");
        queryUserInfo();
      } else {
        // @ts-ignore
        ElMessage.error(res.message);
      }
    } catch (error) {
      console.error("更新用户信息失败:", error);
    }
  };

  const updatePassword = async (data: UpdateUserPasswordParams) => {
    loading.value = true;
    try {
      const res = await updatePasswordApi(data);
      // @ts-ignore
      if (res.code === 200) {
        ElMessage.success("更新成功！");
      } else {
        // @ts-ignore
        ElMessage.error(res.message);
      }
    } catch (error) {
      console.error("更新密码失败:", error);
    } finally {
      loading.value = false;
    }
  };

  const updateAvatar = async (avatar: string) => {
    loading.value = true;
    try {
      const res = await updateAvatarApi(avatar);
      // @ts-ignore
      if (res.code === 200) {
        ElMessage.success("更新成功！");
      } else {
        // @ts-ignore
        ElMessage.error(res.message);
      }
    } catch (error) {
      console.error("更新头像失败:", error);
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    token.value = "";
    userInfo.value = null;
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  };

  return {
    login,
    register,
    userInfo,
    token,
    logout,
    loading,
    initUserStore,
    queryUserInfo,
    updateUserInfo,
    updatePassword,
    updateAvatar,
  };
});
