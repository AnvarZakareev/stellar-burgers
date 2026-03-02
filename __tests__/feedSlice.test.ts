import reducer, { clearFeedError } from '../src/services/feed/slice';
import { getFeedOrders } from '../src/services/feed/slice';
import { FeedState } from '../src/services/feed/slice';
import { TOrder } from '../src/utils/types';

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

const stubOrder: TOrder = {
  _id: 'order1',
  name: 'Order 1',
  status: 'done',
  createdAt: '2023-01-01',
  updatedAt: '2023-01-01',
  number: 1,
  ingredients: ['id1', 'id2']
};

describe('feedSlice', () => {
  it('возвращает initialState', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('pending getFeedOrders', () => {
    const state = reducer(initialState, { type: getFeedOrders.pending.type });
    expect(state.isLoading).toBeTruthy();
    expect(state.error).toBeNull();
  });

  it('fulfilled getFeedOrders', () => {
    const payload = {
      orders: [stubOrder],
      total: 10,
      totalToday: 2
    };
    const state = reducer(initialState, {
      type: getFeedOrders.fulfilled.type,
      payload
    });
    expect(state.isLoading).toBeFalsy();
    expect(state.orders).toEqual([stubOrder]);
    expect(state.total).toBe(10);
    expect(state.totalToday).toBe(2);
  });

  it('rejected getFeedOrders', () => {
    const state = reducer(initialState, {
      type: getFeedOrders.rejected.type,
      error: { message: 'fail' }
    });
    expect(state.isLoading).toBeFalsy();
    expect(state.error).toBe('fail');
  });

  it('clearFeedError', () => {
    const stateWithErr = { ...initialState, error: 'some' };
    expect(reducer(stateWithErr, clearFeedError()).error).toBeNull();
  });
});
