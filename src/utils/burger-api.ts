import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TOrdersData, TUser } from './types';

const URL = process.env.BURGER_API_URL;

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

type TServerResponse<T> = {
  success: boolean;
} & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken);
      return refreshData;
    });

export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
) => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if ((err as { message: string }).message === 'jwt expired') {
      const refreshData = await refreshToken();
      const newOptions = {
        ...options,
        headers: {
          ...options.headers,
          authorization: refreshData.accessToken
        }
      };
      const res = await fetch(url, newOptions);
      return await checkResponse<T>(res);
    }
    throw err;
  }
};

const getAccessTokenSafe = (): string => {
  const token = getCookie('accessToken');
  if (!token) {
    const error = new Error('Access token not found') as Error & {
      message: string;
    };
    error.message = 'jwt expired';
    throw error;
  }
  return token;
};

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

export const getIngredientsApi = () =>
  fetch(`${URL}/ingredients`)
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => {
      if (data?.success) return data.data;
      return Promise.reject(data);
    });

export const getFeedsApi = () =>
  fetch(`${URL}/orders/all`)
    .then((res) => checkResponse<TFeedsResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const getOrdersApi = () => {
  try {
    const accessToken = getAccessTokenSafe();
    return fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        authorization: accessToken
      } as HeadersInit
    }).then((data) => {
      if (data?.success) return data.orders;
      return Promise.reject(data);
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

type TOwner = {
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

type TNewOrder = {
  _id: string;
  status: string;
  name: string;
  owner: TOwner;
  createdAt: string;
  updatedAt: string;
  number: number;
  price: number;
};

type TNewOrderResponse = TServerResponse<{
  order: TNewOrder;
  name: string;
}>;

export const orderBurgerApi = (data: string[]) => {
  try {
    const accessToken = getAccessTokenSafe();
    return fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        authorization: accessToken
      } as HeadersInit,
      body: JSON.stringify({
        ingredients: data
      })
    }).then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

export const getOrderByNumberApi = (number: number) =>
  fetch(`${URL}/orders/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => checkResponse<TOrderResponse>(res));

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export const registerUserApi = (data: TRegisterData) =>
  fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) {
        localStorage.setItem('refreshToken', data.refreshToken);
        setCookie('accessToken', data.accessToken);
        return data;
      }
      return Promise.reject(data);
    });

export type TLoginData = {
  email: string;
  password: string;
};

export const loginUserApi = (data: TLoginData) =>
  fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) {
        localStorage.setItem('refreshToken', data.refreshToken);
        setCookie('accessToken', data.accessToken);
        return data;
      }
      return Promise.reject(data);
    });

export const forgotPasswordApi = (data: { email: string }) =>
  fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const resetPasswordApi = (data: { password: string; token: string }) =>
  fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

type TUserResponse = TServerResponse<{ user: TUser }>;

export const getUserApi = () => {
  try {
    const accessToken = getAccessTokenSafe();
    return fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
      headers: {
        authorization: accessToken
      } as HeadersInit
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateUserApi = (user: Partial<TRegisterData>) => {
  try {
    const accessToken = getAccessTokenSafe();
    return fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        authorization: accessToken
      } as HeadersInit,
      body: JSON.stringify(user)
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

export const logoutApi = async (): Promise<TServerResponse<{}>> => {
  try {
    const accessToken = getCookie('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!accessToken || !refreshToken) {
      clearTokens();
      return { success: true };
    }
    const response = await fetch(`${URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        authorization: accessToken
      },
      body: JSON.stringify({
        token: refreshToken
      })
    });
    const result = await checkResponse<TServerResponse<{}>>(response);
    clearTokens();
    return result;
  } catch (error) {
    clearTokens();
    return { success: true };
  }
};
export const validateUserAuth = async (): Promise<{
  isAuth: boolean;
  user?: TUser;
}> => {
  if (!hasAuthTokens()) {
    clearTokens();
    return { isAuth: false };
  }
  try {
    const response = await getUserApi();
    if (response.success && response.user) {
      return { isAuth: true, user: response.user };
    }
    clearTokens();
    return { isAuth: false };
  } catch (error) {
    clearTokens();
    return { isAuth: false };
  }
};

export const hasAuthTokens = (): boolean => {
  const accessToken = getCookie('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  return !!(accessToken && refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem('refreshToken');
  setCookie('accessToken', '', { expires: -1 });
};
