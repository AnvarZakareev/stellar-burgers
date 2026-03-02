import reducer, {
  clearError,
  setAuthChecked,
  resetPasswordState,
  forceLogout,
  initialState
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

import { UserState } from '../src/services/user/slice';
import { TUser } from '../src/utils/types';

const user: TUser = {
  email: 'test@test.com',
  name: 'Test User'
};

describe('userSlice', () => {
  it('initialState', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('clearError', () => {
    const prevState = { ...initialState, error: 'some' };
    expect(reducer(prevState, clearError()).error).toBeNull();
  });

  it('setAuthChecked', () => {
    expect(reducer(initialState, setAuthChecked(true)).isAuthChecked).toBe(
      true
    );
    expect(reducer(initialState, setAuthChecked(false)).isAuthChecked).toBe(
      false
    );
  });

  it('resetPasswordState', () => {
    const prevState = {
      ...initialState,
      error: 'err',
      passwordResetRequested: true
    };
    const res = reducer(prevState, resetPasswordState());
    expect(res.error).toBeNull();
    expect(res.passwordResetRequested).toBe(false);
  });

  it('forceLogout', () => {
    const prevState: UserState = {
      ...initialState,
      user,
      isAuthenticated: true,
      isAuthChecked: false,
      isLoading: true,
      error: 'err'
    };
    const res = reducer(prevState, forceLogout());
    expect(res.user).toBeNull();
    expect(res.isAuthenticated).toBe(false);
    expect(res.isAuthChecked).toBe(true);
    expect(res.isLoading).toBe(false);
    expect(res.error).toBeNull();
  });

  // ---- login ----
  it('login pending', () => {
    const state = reducer(initialState, { type: login.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });
  it('login fulfilled', () => {
    const payload = { user };
    const state = reducer(initialState, {
      type: login.fulfilled.type,
      payload
    });
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeNull();
  });
  it('login rejected', () => {
    const action = { type: login.rejected.type, payload: 'no auth' };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBe('no auth');
  });

  // ---- register ----
  it('register pending', () => {
    expect(
      reducer(initialState, { type: register.pending.type }).isLoading
    ).toBe(true);
  });
  it('register fulfilled', () => {
    const payload = { user };
    const state = reducer(initialState, {
      type: register.fulfilled.type,
      payload
    });
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
    expect(state.user).toEqual(user);
  });
  it('register rejected', () => {
    const action = { type: register.rejected.type, error: { message: 'fail' } };
    const state = reducer(initialState, action);
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.error).toBe('fail');
  });

  // ---- logout ----
  it('logout pending', () => {
    expect(reducer(initialState, { type: logout.pending.type }).isLoading).toBe(
      true
    );
  });
  it('logout fulfilled', () => {
    const filled = { ...initialState, user, isAuthenticated: true };
    const state = reducer(filled, { type: logout.fulfilled.type });
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
  it('logout rejected', () => {
    const prev = { ...initialState, isAuthenticadet: true, user };
    const state = reducer(prev, { type: logout.rejected.type });
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.error).toBeNull();
  });

  // ---- getUser ----
  it('getUser pending', () => {
    expect(
      reducer(initialState, { type: getUser.pending.type }).isLoading
    ).toBe(true);
  });
  it('getUser fulfilled', () => {
    const payload = { user };
    const state = reducer(initialState, {
      type: getUser.fulfilled.type,
      payload
    });
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
  });
  it('getUser rejected', () => {
    const action = { type: getUser.rejected.type, error: { message: 'err2' } };
    const state = reducer(initialState, action);
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBe('err2');
  });

  // ---- updateUser ----
  it('updateUser pending', () => {
    expect(
      reducer(initialState, { type: updateUser.pending.type }).isLoading
    ).toBe(true);
  });
  it('updateUser fulfilled', () => {
    const payload = { user };
    const state = reducer(initialState, {
      type: updateUser.fulfilled.type,
      payload
    });
    expect(state.user).toEqual(user);
    expect(state.error).toBeNull();
  });
  it('updateUser rejected', () => {
    const action = {
      type: updateUser.rejected.type,
      error: { message: 'failUpd' }
    };
    const state = reducer(initialState, action);
    expect(state.error).toBe('failUpd');
  });

  // ---- forgotPassword ----
  it('forgotPassword pending', () => {
    const res = reducer(initialState, { type: forgotPassword.pending.type });
    expect(res.isLoading).toBe(true);
    expect(res.passwordResetRequested).toBe(false);
  });
  it('forgotPassword fulfilled', () => {
    const res = reducer(initialState, { type: forgotPassword.fulfilled.type });
    expect(res.isLoading).toBe(false);
    expect(res.passwordResetRequested).toBe(true);
    expect(res.error).toBeNull();
  });
  it('forgotPassword rejected', () => {
    const action = {
      type: forgotPassword.rejected.type,
      error: { message: 'noReset' }
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.passwordResetRequested).toBe(false);
    expect(state.error).toBe('noReset');
  });

  // ---- resetPassword ----
  it('resetPassword pending', () => {
    expect(
      reducer(initialState, { type: resetPassword.pending.type }).isLoading
    ).toBe(true);
  });
  it('resetPassword fulfilled', () => {
    const res = reducer(initialState, { type: resetPassword.fulfilled.type });
    expect(res.isLoading).toBe(false);
    expect(res.passwordResetRequested).toBe(false);
    expect(res.error).toBeNull();
  });
  it('resetPassword rejected', () => {
    const action = {
      type: resetPassword.rejected.type,
      error: { message: 'resetFail' }
    };
    const state = reducer(initialState, action);
    expect(state.error).toBe('resetFail');
  });

  // ---- checkUserAuth ----
  it('checkUserAuth pending', () => {
    expect(
      reducer(initialState, { type: checkUserAuth.pending.type }).isLoading
    ).toBe(true);
  });
  it('checkUserAuth fulfilled', () => {
    const payload = { user };
    const state = reducer(initialState, {
      type: checkUserAuth.fulfilled.type,
      payload
    });
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeNull();
  });
  it('checkUserAuth rejected', () => {
    const state = reducer(initialState, { type: checkUserAuth.rejected.type });
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeNull();
  });

  // ---- refreshUserToken ----
  it('refreshUserToken pending', () => {
    expect(
      reducer(initialState, { type: refreshUserToken.pending.type }).isLoading
    ).toBe(true);
  });
  it('refreshUserToken fulfilled', () => {
    expect(
      reducer(initialState, { type: refreshUserToken.fulfilled.type }).isLoading
    ).toBe(false);
  });
  it('refreshUserToken rejected', () => {
    const state = reducer(initialState, {
      type: refreshUserToken.rejected.type
    });
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBe('Сессия истекла');
  });
});
