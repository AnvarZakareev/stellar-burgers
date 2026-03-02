import reducer, {
  initialState,
  clearOrders,
  clearError,
  fetchUserOrders
} from '../src/services/profile/slice';
import { TOrder } from '../src/utils/types';

const fakeOrder: TOrder = {
  _id: '1',
  status: 'done',
  name: 'My order',
  createdAt: 'date',
  updatedAt: 'date',
  number: 1,
  ingredients: ['i1', 'i2']
};

describe('profileSlice', () => {
  it('returns initial state by default', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('sync reducers', () => {
    it('clearOrders resets orders and error', () => {
      const state = {
        ...initialState,
        orders: [fakeOrder],
        error: 'err'
      };
      const result = reducer(state, clearOrders());
      expect(result.orders).toEqual([]);
      expect(result.error).toBeNull();
    });

    it('clearError resets error only', () => {
      const state = {
        ...initialState,
        error: 'error'
      };
      const result = reducer(state, clearError());
      expect(result.error).toBeNull();
      expect(result.orders).toEqual([]);
    });
  });

  describe('fetchUserOrders async actions', () => {
    it('pending sets isLoading', () => {
      const state = reducer(
        initialState,
        fetchUserOrders.pending('', undefined)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled sets orders and stops loading', () => {
      const payload = [fakeOrder, { ...fakeOrder, _id: '2' }];
      const state = reducer(
        initialState,
        fetchUserOrders.fulfilled(payload, '', undefined)
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.orders).toEqual(payload);
    });

    it('rejected sets error and stops loading', () => {
      const action: any = {
        type: fetchUserOrders.rejected.type,
        payload: 'loading error'
      };
      const state = reducer({ ...initialState, isLoading: true }, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('loading error');
    });
  });

  it('should return same state for unknown action', () => {
    const state = reducer(initialState, { type: 'unknown_action' });
    expect(state).toEqual(initialState);
  });
});
