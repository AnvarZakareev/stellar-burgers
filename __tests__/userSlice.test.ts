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

describe('userSlice', () => {
  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('login pending', () => {
    const action = { type: login.pending.type };
    expect(reducer(initialState, action).isLoading).toBe(true);
  });

  it('login fulfilled', () => {
    const user = { email: 'mail', name: 'name' };
    const action = { type: login.fulfilled.type, payload: { user } };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
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

  // Аналогично для остальных экшенов (register/logout/getUser/...)
  it('clearError', () => {
    const filled = { ...initialState, error: 'err' };
    expect(reducer(filled, clearError())).toEqual({ ...filled, error: null });
  });
  it('setAuthChecked', () => {
    expect(reducer(initialState, setAuthChecked(true)).isAuthChecked).toBe(
      true
    );
  });
  it('resetPasswordState', () => {
    expect(
      reducer(
        { ...initialState, passwordResetRequested: true, error: '1' },
        resetPasswordState()
      )
    ).toEqual({ ...initialState, passwordResetRequested: false, error: null });
  });
  it('forceLogout', () => {
    expect(
      reducer(
        {
          ...initialState,
          user: { email: 'mail', name: 'name' },
          isAuthenticated: true,
          isAuthChecked: false,
          isLoading: true,
          error: 'err'
        },
        forceLogout()
      )
    ).toEqual({
      ...initialState,
      user: null,
      isAuthenticated: false,
      isAuthChecked: true,
      isLoading: false,
      error: null
    });
  });
});
