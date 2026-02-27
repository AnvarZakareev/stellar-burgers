import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  logoutApi,
  loginUserApi,
  TLoginData,
  registerUserApi,
  TRegisterData,
  getUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi
} from '../../utils/burger-api';

export const logout = createAsyncThunk(
  'user/logout',
  async () => await logoutApi()
);

export const login = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData) => await loginUserApi(loginData)
);

export const register = createAsyncThunk(
  'user/register',
  async (registerData: TRegisterData) => await registerUserApi(registerData)
);

export const getUser = createAsyncThunk(
  'user/getUser',
  async () => await getUserApi()
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: Partial<TRegisterData>) => await updateUserApi(userData)
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (email: string) => await forgotPasswordApi({ email })
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (resetData: { password: string; token: string }) =>
    await resetPasswordApi(resetData)
);

// export const checkUserAuth = createAsyncThunk(
//   'user/checkUserAuth',
//   async (__,{ dispath }) => {
//     if (api)
//   }
// );
