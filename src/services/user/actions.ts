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
  resetPasswordApi,
  refreshToken,
  clearTokens
} from '../../utils/burger-api';
import { validateUserAuth } from '../../utils/burger-api';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error occurred';
};

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      return await logoutApi();
    } catch (error) {
      return rejectWithValue('Logout failed');
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData, { rejectWithValue }) => {
    try {
      return await loginUserApi(loginData);
    } catch (error) {
      clearTokens();
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (registerData: TRegisterData, { rejectWithValue }) => {
    try {
      return await registerUserApi(registerData);
    } catch (error) {
      clearTokens();
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getUser = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      return await getUserApi();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      return await updateUserApi(userData);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      return await forgotPasswordApi({ email });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (
    resetData: { password: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      return await resetPasswordApi(resetData);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { rejectWithValue }) => {
    try {
      const { isAuth, user } = await validateUserAuth();
      if (isAuth && user) {
        return { success: true, user };
      }
      return rejectWithValue('User not authenticated');
    } catch (error) {
      return rejectWithValue('Authentication failed');
    }
  }
);

export const refreshUserToken = createAsyncThunk(
  'user/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      return await refreshToken();
    } catch (error) {
      clearTokens();
      return rejectWithValue('Token refresh failed');
    }
  }
);
