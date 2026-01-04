import type {
  LoginParams,
  RegisterParams,
  UpdateUserInfoParams,
  UpdateUserPasswordParams,
} from "@/types/user";
import { post } from "@/utils/request";

const loginApi = async (data: LoginParams) => {
  try {
    const res = await post("/user/login", data);
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
};

const registerApi = async (data: RegisterParams) => {
  try {
    const res = await post("/user/signup", data);
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
};

const queryUserInfoApi = async () => {
  try {
    const res = await post("/user/queryUserInfo");
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
};

async function updateUserInfoApi(data: UpdateUserInfoParams) {
  try {
    if (JSON.stringify(data) === "{}") {
      return Promise.reject(new Error("更新数据不能全为空!"));
    }
    const res = await post("/user/updateUserInfo", data);
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function updatePasswordApi(data: UpdateUserPasswordParams) {
  try {
    const res = await post("/user/updatePassword", data);
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function updateAvatarApi(avatar: string) {
  try {
    const res = await post("/user/updateAvatar", { avatar });
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
}

export {
  loginApi,
  registerApi,
  queryUserInfoApi,
  updateUserInfoApi,
  updatePasswordApi,
  updateAvatarApi,
};
