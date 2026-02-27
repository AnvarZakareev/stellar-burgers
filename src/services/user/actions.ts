import { createAsyncThunk } from '@reduxjs/toolkit';
import { logoutApi, loginUserApi, TLoginData } from '../../utils/burger-api';

export const logout = createAsyncThunk('user/logout', async () => logoutApi());

export const login = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData) => await loginUserApi(loginData)
);
