interface LoginParams {
  username: string;
  password: string;
}

interface RegisterParams {
  username: string;
  email: string;
  password: string;
  nickname: string;
  confirmPassword: string;
}

interface UserInfo {
  uid: string;
  avatar?: string;
  username: string;
  password: string;
  nickname: string;
  email: string;
  phone: string;
  status: number;
  role: string;
  status: boolean;
  create_time: string;
}

interface UpdateUserInfoParams {
  nickname: string;
  email: string;
  phone: string;
}

interface UpdateUserPasswordParams {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type {
  LoginParams,
  RegisterParams,
  UserInfo,
  UpdateUserInfoParams,
  UpdateUserPasswordParams,
};
