export interface IUser {
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
}

export interface IUserLogin {
  email: string,
  password: string,
};

export interface IUserRespons {
  id: string,
  name: string,
  email: string,
  avatar: string,
  accessToken: string,
};

export type UserWithoutToken = Omit<IUserRespons, 'accessToken'>

export interface IUserToChange {
  name: string,
  avatar?: string,
  hashPassword?: string,
  password?: string,
}

export enum EVariantLogout {
  Menu="menu",
  Button="button"
}

export interface IPasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AxiosError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export enum ESnackbarStatus {
  Success="success",
  Error="error"
}