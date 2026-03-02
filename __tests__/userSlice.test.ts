import reducer, {
  initialState,
  clearError,
  setAuthChecked,
  resetPasswordState,
  forceLogout
} from '../src/services/user/slice';

import {
  login,
  register,
  logout,
  getUser,
  updateUser,
  forgotPassword,
  resetPassword,
  checkUserAuth,
  refreshUserToken
} from '../src/services/user/actions';

const fakeUser = { email: 'test@mail.com', name: 'Tester' };
const fakeAuthPayload = {
  success: true,
  user: fakeUser,
  accessToken: 'fake-access-token',
  refreshToken: 'fake-refresh-token'
};

describe('userSlice', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('sync reducers', () => {
    it('clearError should set error to null', () => {
      const state = { ...initialState, error: 'errorText' };
      expect(reducer(state, clearError())).toEqual({ ...state, error: null });
    });

    it('setAuthChecked should update isAuthChecked', () => {
      const state = { ...initialState, isAuthChecked: false };
      expect(reducer(state, setAuthChecked(true))).toEqual({
        ...state,
        isAuthChecked: true
      });
    });

    it('resetPasswordState should set passwordResetRequested to false and error to null', () => {
      const state = {
        ...initialState,
        passwordResetRequested: true,
        error: 'err'
      };
      expect(reducer(state, resetPasswordState())).toEqual({
        ...state,
        passwordResetRequested: false,
        error: null
      });
    });

    it('forceLogout should reset auth state', () => {
      const state = {
        ...initialState,
        user: fakeUser,
        isAuthenticated: true,
        isAuthChecked: false,
        isLoading: true,
        error: 'err'
      };
      expect(reducer(state, forceLogout())).toEqual({
        ...initialState,
        isAuthChecked: true
      });
    });
  });

  describe('login async actions', () => {
    it('login.pending sets isLoading true', () => {
      const state = reducer(
        initialState,
        login.pending('', { email: '', password: '' })
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
    it('login.fulfilled sets user and flags', () => {
      const state = reducer(
        initialState,
        login.fulfilled(fakeAuthPayload, '', { email: '', password: '' })
      );
      expect(state.user).toEqual(fakeUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
    it('login.rejected sets error, resets user and auth', () => {
      const action: any = {
        type: login.rejected.type,
        payload: 'ошибка',
        error: { message: 'unauth' }
      };
      const state = reducer(
        { ...initialState, isAuthenticated: true, user: fakeUser },
        action
      );
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBe('ошибка');
    });
  });

  describe('register async actions', () => {
    it('register.pending sets isLoading', () => {
      const state = reducer(
        initialState,
        register.pending('', { email: '', password: '', name: '' })
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
    it('register.fulfilled sets user', () => {
      const state = reducer(
        initialState,
        register.fulfilled(fakeAuthPayload, '', {
          email: '',
          password: '',
          name: ''
        })
      );
      expect(state.user).toEqual(fakeUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
    it('register.rejected', () => {
      const action: any = {
        type: register.rejected.type,
        error: { message: 'registration err' }
      };
      const state = reducer(
        { ...initialState, isAuthenticated: true, user: fakeUser },
        action
      );
      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBe('registration err');
    });
  });

  describe('logout async actions', () => {
    it('logout.pending', () => {
      const state = reducer(initialState, logout.pending('', undefined));
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
    it('logout.fulfilled', () => {
      const state = reducer(
        { ...initialState, user: fakeUser, isAuthenticated: true },
        logout.fulfilled({ success: true }, '', undefined)
      );
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
    it('logout.rejected', () => {
      const state = reducer(
        { ...initialState, user: fakeUser, isAuthenticated: true },
        logout.rejected({} as any, '', undefined)
      );
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('getUser async actions', () => {
    it('getUser.pending', () => {
      const state = reducer(initialState, getUser.pending('', undefined));
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
    it('getUser.fulfilled', () => {
      const state = reducer(
        initialState,
        getUser.fulfilled(fakeAuthPayload, '', undefined)
      );
      expect(state.user).toEqual(fakeUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
    it('getUser.rejected', () => {
      const action: any = {
        type: getUser.rejected.type,
        error: { message: 'err' }
      };
      const state = reducer(
        { ...initialState, user: fakeUser, isAuthenticated: true },
        action
      );
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('err');
    });
  });

  describe('updateUser async actions', () => {
    it('updateUser.pending', () => {
      const state = reducer(initialState, updateUser.pending('', {}));
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
    it('updateUser.fulfilled', () => {
      const payload = {
        ...fakeAuthPayload
      };
      const state = reducer(
        initialState,
        updateUser.fulfilled(payload, '', {})
      );
      expect(state.user).toEqual(fakeUser);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
    it('updateUser.rejected', () => {
      const action: any = {
        type: updateUser.rejected.type,
        error: { message: 'profile err' }
      };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('profile err');
    });
  });

  describe('forgotPassword async actions', () => {
    it('forgotPassword.pending', () => {
      const state = reducer(
        { ...initialState, passwordResetRequested: true },
        forgotPassword.pending('', '')
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.passwordResetRequested).toBe(false);
    });
    it('forgotPassword.fulfilled', () => {
      const state = reducer(
        initialState,
        forgotPassword.fulfilled({ success: true }, '', '')
      );
      expect(state.isLoading).toBe(false);
      expect(state.passwordResetRequested).toBe(true);
      expect(state.error).toBeNull();
    });
    it('forgotPassword.rejected', () => {
      const action: any = {
        type: forgotPassword.rejected.type,
        error: { message: 'forgot err' }
      };
      const state = reducer(
        { ...initialState, passwordResetRequested: false },
        action
      );
      expect(state.isLoading).toBe(false);
      expect(state.passwordResetRequested).toBe(false);
      expect(state.error).toBe('forgot err');
    });
  });

  describe('resetPassword async actions', () => {
    it('resetPassword.pending', () => {
      const state = reducer(
        initialState,
        resetPassword.pending('', { password: '', token: '' })
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
    it('resetPassword.fulfilled', () => {
      const state = reducer(
        { ...initialState, passwordResetRequested: true },
        resetPassword.fulfilled({ success: true }, '', {
          password: '',
          token: ''
        })
      );
      expect(state.isLoading).toBe(false);
      expect(state.passwordResetRequested).toBe(false);
      expect(state.error).toBeNull();
    });
    it('resetPassword.rejected', () => {
      const action: any = {
        type: resetPassword.rejected.type,
        error: { message: 'reset err' }
      };
      const state = reducer({ ...initialState }, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('reset err');
    });
  });

  describe('checkUserAuth async actions', () => {
    it('checkUserAuth.pending', () => {
      const state = reducer(initialState, checkUserAuth.pending('', undefined));
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
    it('checkUserAuth.fulfilled', () => {
      const state = reducer(
        initialState,
        checkUserAuth.fulfilled(fakeAuthPayload, '', undefined)
      );
      expect(state.user).toEqual(fakeUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
    it('checkUserAuth.rejected', () => {
      const state = reducer(
        { ...initialState, user: fakeUser, isAuthenticated: true },
        checkUserAuth.rejected({} as any, '', undefined)
      );
      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('refreshUserToken async actions', () => {
    it('refreshUserToken.pending', () => {
      const state = reducer(
        initialState,
        refreshUserToken.pending('', undefined)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
    it('refreshUserToken.fulfilled', () => {
      const state = reducer(
        { ...initialState, error: 'err' },
        refreshUserToken.fulfilled(
          {
            success: true,
            refreshToken: 'someRefreshToken',
            accessToken: 'someAccessToken'
          },
          '',
          undefined
        )
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
    it('refreshUserToken.rejected', () => {
      const action: any = { type: refreshUserToken.rejected.type };
      const state = reducer(
        { ...initialState, user: fakeUser, isAuthenticated: true },
        action
      );
      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBe('Сессия истекла');
    });
  });

  it('should return state for unknown action', () => {
    const state = reducer(initialState, { type: 'unknown_action' });
    expect(state).toEqual(initialState);
  });
});
