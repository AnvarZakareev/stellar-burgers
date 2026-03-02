import reducer, {
  initialState,
  setOrderRequest,
  setOrderModalData,
  setCurrentOrder,
  setLoading
} from '../src/services/order/slice';
import { TOrder } from '../src/utils/types';

const mockOrder: TOrder = {
  _id: '123',
  status: 'done',
  name: 'Test Order',
  createdAt: '2024-06-07T00:00:00.000Z',
  updatedAt: '2024-06-07T00:00:01.000Z',
  number: 101,
  ingredients: ['abc', 'def']
};

describe('orderSlice', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('setOrderRequest sets orderRequest', () => {
    let state = reducer(initialState, setOrderRequest(true));
    expect(state.orderRequest).toBe(true);
    state = reducer(state, setOrderRequest(false));
    expect(state.orderRequest).toBe(false);
  });

  it('setOrderModalData sets orderModalData', () => {
    let state = reducer(initialState, setOrderModalData(mockOrder));
    expect(state.orderModalData).toEqual(mockOrder);
    state = reducer(state, setOrderModalData(null));
    expect(state.orderModalData).toBeNull();
  });

  it('setCurrentOrder sets currentOrder', () => {
    let state = reducer(initialState, setCurrentOrder(mockOrder));
    expect(state.currentOrder).toEqual(mockOrder);
    state = reducer(state, setCurrentOrder(null));
    expect(state.currentOrder).toBeNull();
  });

  it('setLoading sets loading', () => {
    let state = reducer(initialState, setLoading(true));
    expect(state.loading).toBe(true);
    state = reducer(state, setLoading(false));
    expect(state.loading).toBe(false);
  });

  it('returns state for unknown action', () => {
    expect(reducer(initialState, { type: 'unknown_action' })).toEqual(
      initialState
    );
  });
});
