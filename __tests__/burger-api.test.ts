import * as api from '../src/utils/burger-api';

const URL = 'http://example.com';
const originalEnv = process.env;

beforeAll(() => {
  process.env.BURGER_API_URL = URL;
});

afterAll(() => {
  process.env = originalEnv;
});

jest.mock('../src/utils/cookie', () => ({
  setCookie: jest.fn(),
  getCookie: jest.fn().mockReturnValue('token')
}));
jest
  .spyOn(window.localStorage.__proto__, 'getItem')
  .mockImplementation((key) =>
    key === 'refreshToken' ? 'refresh-token' : null
  );
jest
  .spyOn(window.localStorage.__proto__, 'setItem')
  .mockImplementation(() => {});
jest
  .spyOn(window.localStorage.__proto__, 'removeItem')
  .mockImplementation(() => {});

describe('burger-api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (require('../src/utils/cookie').getCookie as jest.Mock).mockReturnValue(
      'token'
    );
  });

  it('refreshToken: успех', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          refreshToken: 'refresh',
          accessToken: 'access'
        })
    });
    const res = await api.refreshToken();
    expect(res.success).toBe(true);
    expect(res.refreshToken).toBe('refresh');
  });

  it('refreshToken: fail', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: 'fail' })
    });
    await expect(api.refreshToken()).rejects.toEqual({ message: 'fail' });
  });

  it('getIngredientsApi: успех', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: [
            {
              _id: '1',
              name: '',
              type: '',
              proteins: 0,
              fat: 0,
              carbohydrates: 0,
              calories: 0,
              price: 0,
              image: '',
              image_large: '',
              image_mobile: ''
            }
          ]
        })
    });
    const res = await api.getIngredientsApi();
    expect(Array.isArray(res)).toBe(true);
  });

  it('getFeedsApi: успех', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          orders: [],
          total: 1,
          totalToday: 1
        })
    });
    const res = await api.getFeedsApi();
    expect(res.success).toBe(true);
    expect(res.orders).toBeDefined();
  });

  it('getOrdersApi: успех', async () => {
    (require('../src/utils/cookie').getCookie as jest.Mock).mockReturnValue(
      'token'
    );
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          orders: []
        })
    });
    const res = await api.getOrdersApi();
    expect(Array.isArray(res)).toBe(true);
  });

  it('orderBurgerApi: успех', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          order: {},
          name: ''
        })
    });
    const res = await api.orderBurgerApi(['1', '2']);
    expect(res.success).toBe(true);
  });

  it('getOrderByNumberApi: успех', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          orders: []
        })
    });
    const res = await api.getOrderByNumberApi(1);
    expect(res.success).toBe(true);
  });

  it('registerUserApi: успех', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          refreshToken: 'refresh',
          accessToken: 'access',
          user: { email: '', name: '' }
        })
    });
    const res = await api.registerUserApi({
      email: '',
      name: '',
      password: ''
    });
    expect(res.success).toBe(true);
  });

  it('loginUserApi: успех', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          refreshToken: 'refresh',
          accessToken: 'access',
          user: { email: '', name: '' }
        })
    });
    const res = await api.loginUserApi({ email: '', password: '' });
    expect(res.success).toBe(true);
  });

  it('forgotPasswordApi: успех', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });
    const res = await api.forgotPasswordApi({ email: '' });
    expect(res.success).toBe(true);
  });

  it('resetPasswordApi: успех', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });
    const res = await api.resetPasswordApi({ password: '', token: '' });
    expect(res.success).toBe(true);
  });

  it('getUserApi: успех', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          user: { email: '', name: '' }
        })
    });
    const res = await api.getUserApi();
    expect(res.success).toBe(true);
  });

  it('updateUserApi: успех', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          user: { email: '', name: '' }
        })
    });
    const res = await api.updateUserApi({ email: '', name: '', password: '' });
    expect(res.success).toBe(true);
  });

  it('logoutApi: успех', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });
    const res = await api.logoutApi();
    expect(res.success).toBe(true);
  });

  it('validateUserAuth: без токенов возвращает isAuth: false', async () => {
    (require('../src/utils/cookie').getCookie as jest.Mock)
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(null);
    const res = await api.validateUserAuth();
    expect(res.isAuth).toBe(false);
  });

  it('clearTokens: вызывает removeItem и setCookie', () => {
    api.clearTokens();
    expect(window.localStorage.removeItem).toBeCalledWith('refreshToken');
    expect(require('../src/utils/cookie').setCookie).toBeCalledWith(
      'accessToken',
      '',
      { expires: -1 }
    );
  });
});
