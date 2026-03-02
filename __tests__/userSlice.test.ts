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
import { TUser } from '../src/utils/types';

describe('userSlice', () => {
  const user: TUser = { email: 'mail', name: 'name' };
  const filledState = {
    ...initialState,
    user: user,
    isAuthenticated: true,
    isAuthChecked: true,
    isLoading: false,
    error: 'err',
    passwordResetRequested: true
  };

  it('returns initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  // LOGIN
  it('login pending', () => {
    const action = { type: login.pending.type };
    expect(reducer(initialState, action).isLoading).toBe(true);
  });

  it('login fulfilled', () => {
    const action = { type: login.fulfilled.type, payload: { user } };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeNull();
  });

  it('login rejected', () => {
    const action = {
      type: login.rejected.type,
      payload: 'fail',
      error: { message: 'fail' }
    };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.isLoading).toBe(false);
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBe('fail');
  });

  // REGISTER
  it('register pending', () => {
    const action = { type: register.pending.type };
    expect(reducer(initialState, action).isLoading).toBe(true);
  });

  it('register fulfilled', () => {
    const action = { type: register.fulfilled.type, payload: { user } };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeNull();
  });

  it('register rejected', () => {
    const action = {
      type: register.rejected.type,
      error: { message: 'fail' }
    };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.isLoading).toBe(false);
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBe('fail');
  });

  // LOGOUT
  it('logout pending', () => {
    const action = { type: logout.pending.type };
    expect(
      reducer({ ...filledState, isLoading: false }, action).isLoading
    ).toBe(true);
  });

  it('logout fulfilled', () => {
    const action = { type: logout.fulfilled.type };
    const state = reducer({ ...filledState, isLoading: true }, action);
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('logout rejected', () => {
    const action = { type: logout.rejected.type };
    const state = reducer({ ...filledState, isLoading: true }, action);
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  // GET USER
  it('getUser pending', () => {
    const action = { type: getUser.pending.type };
    expect(reducer(initialState, action).isLoading).toBe(true);
  });

  it('getUser fulfilled', () => {
    const action = { type: getUser.fulfilled.type, payload: { user } };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeNull();
  });

  it('getUser rejected', () => {
    const action = {
      type: getUser.rejected.type,
      error: { message: 'fail' }
    };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBe('fail');
    expect(state.isLoading).toBe(false);
  });

  // UPDATE USER
  it('updateUser pending', () => {
    const action = { type: updateUser.pending.type };
    expect(reducer(initialState, action).isLoading).toBe(true);
  });

  it('updateUser fulfilled', () => {
    const changedUser = { email: 'new@mail', name: 'New' };
    const action = {
      type: updateUser.fulfilled.type,
      payload: { user: changedUser }
    };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.user).toEqual(changedUser);
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('updateUser rejected', () => {
    const action = {
      type: updateUser.rejected.type,
      error: { message: 'fail' }
    };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.error).toBe('fail');
    expect(state.isLoading).toBe(false);
  });

  // FORGOT PASSWORD
  it('forgotPassword pending', () => {
    const action = { type: forgotPassword.pending.type };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.passwordResetRequested).toBe(false);
  });

  it('forgotPassword fulfilled', () => {
    const action = { type: forgotPassword.fulfilled.type };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.isLoading).toBe(false);
    expect(state.passwordResetRequested).toBe(true);
    expect(state.error).toBeNull();
  });

  it('forgotPassword rejected', () => {
    const action = {
      type: forgotPassword.rejected.type,
      error: { message: 'fail' }
    };
    const state = reducer(
      { ...initialState, isLoading: true, passwordResetRequested: false },
      action
    );
    expect(state.isLoading).toBe(false);
    expect(state.passwordResetRequested).toBe(false);
    expect(state.error).toBe('fail');
  });

  // RESET PASSWORD
  it('resetPassword pending', () => {
    const action = { type: resetPassword.pending.type };
    expect(reducer(initialState, action).isLoading).toBe(true);
  });

  it('resetPassword fulfilled', () => {
    const action = { type: resetPassword.fulfilled.type };
    const state = reducer(
      { ...initialState, isLoading: true, passwordResetRequested: true },
      action
    );
    expect(state.isLoading).toBe(false);
    expect(state.passwordResetRequested).toBe(false);
    expect(state.error).toBeNull();
  });

  it('resetPassword rejected', () => {
    const action = {
      type: resetPassword.rejected.type,
      error: { message: 'fail' }
    };
    const state = reducer(
      { ...initialState, isLoading: true, passwordResetRequested: true },
      action
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('fail');
  });

  // CHECK USER AUTH
  it('checkUserAuth pending', () => {
    const action = { type: checkUserAuth.pending.type };
    expect(reducer(initialState, action).isLoading).toBe(true);
  });

  it('checkUserAuth fulfilled', () => {
    const action = { type: checkUserAuth.fulfilled.type, payload: { user } };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeNull();
  });

  it('checkUserAuth rejected', () => {
    const action = { type: checkUserAuth.rejected.type };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  // REFRESH USER TOKEN
  it('refreshUserToken pending', () => {
    const action = { type: refreshUserToken.pending.type };
    expect(reducer(initialState, action).isLoading).toBe(true);
  });

  it('refreshUserToken fulfilled', () => {
    const action = { type: refreshUserToken.fulfilled.type };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('refreshUserToken rejected', () => {
    const action = { type: refreshUserToken.rejected.type };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.isLoading).toBe(false);
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBe('Сессия истекла');
  });

  // BASIC SYNC REDUCERS
  it('clearError', () => {
    const state = reducer({ ...initialState, error: 'err' }, clearError());
    expect(state.error).toBeNull();
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
    const state = reducer(
      { ...initialState, passwordResetRequested: true, error: 'err' },
      resetPasswordState()
    );
    expect(state.passwordResetRequested).toBe(false);
    expect(state.error).toBeNull();
  });

  it('forceLogout', () => {
    const state = reducer(
      {
        ...initialState,
        user,
        isAuthenticated: true,
        isAuthChecked: false,
        isLoading: true,
        error: 'err'
      },
      forceLogout()
    );
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });
});
