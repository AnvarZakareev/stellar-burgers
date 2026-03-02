import reducer, {
  initialState,
  clearFeedError
} from '../src/services/feed/slice';
import { getFeedOrders } from '../src/services/feed/slice';

describe('feedSlice', () => {
  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('feed pending', () => {
    const action = { type: getFeedOrders.pending.type };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('feed fulfilled', () => {
    const payload = {
      orders: [
        {
          _id: '1',
          name: '',
          status: '',
          createdAt: '',
          updatedAt: '',
          number: 1,
          ingredients: []
        }
      ],
      total: 111,
      totalToday: 10
    };
    const action = { type: getFeedOrders.fulfilled.type, payload };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(payload.orders);
    expect(state.total).toBe(payload.total);
    expect(state.totalToday).toBe(payload.totalToday);
  });

  it('feed rejected', () => {
    const action = {
      type: getFeedOrders.rejected.type,
      error: { message: 'fail!' }
    };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('fail!');
  });

  it('clearFeedError очищает ошибку', () => {
    const start = { ...initialState, error: 'err' };
    expect(reducer(start, clearFeedError())).toEqual({ ...start, error: null });
  });
});
