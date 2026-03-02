import reducer, {
  initialState,
  clearOrders,
  clearError,
  fetchUserOrders
} from '../src/services/profile/slice';

describe('profileSlice', () => {
  it('начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });
  it('pending', () => {
    const action = { type: fetchUserOrders.pending.type };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });
  it('fulfilled', () => {
    const orders = [
      {
        _id: '1',
        status: '',
        name: '',
        createdAt: '',
        updatedAt: '',
        number: 1,
        ingredients: []
      }
    ];
    const action = { type: fetchUserOrders.fulfilled.type, payload: orders };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(orders);
    expect(state.error).toBeNull();
  });
  it('rejected', () => {
    const action = { type: fetchUserOrders.rejected.type, payload: 'fail' };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('fail');
  });
  it('clearOrders', () => {
    const filled = {
      ...initialState,
      orders: [
        {
          _id: '1',
          status: '',
          name: '',
          createdAt: '',
          updatedAt: '',
          number: 1,
          ingredients: []
        }
      ],
      error: 'err'
    };
    expect(reducer(filled, clearOrders())).toEqual({
      ...filled,
      orders: [],
      error: null
    });
  });
  it('clearError', () => {
    const filled = { ...initialState, error: 'err' };
    expect(reducer(filled, clearError())).toEqual({ ...filled, error: null });
  });
});
