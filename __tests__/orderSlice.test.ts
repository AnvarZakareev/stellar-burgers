import reducer, {
  initialState,
  setOrderRequest,
  setOrderModalData,
  setCurrentOrder,
  setLoading
} from '../src/services/order/slice';

describe('orderSlice', () => {
  it('начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });
  it('setOrderRequest', () => {
    expect(reducer(initialState, setOrderRequest(true))).toEqual({
      ...initialState,
      orderRequest: true
    });
  });
  it('setOrderModalData', () => {
    expect(
      reducer(
        initialState,
        setOrderModalData({
          _id: '1',
          status: '',
          name: '',
          createdAt: '',
          updatedAt: '',
          number: 1,
          ingredients: []
        })
      )
    ).toMatchObject({ ...initialState, orderModalData: { _id: '1' } });
  });
  it('setCurrentOrder', () => {
    expect(
      reducer(
        initialState,
        setCurrentOrder({
          _id: '2',
          status: '',
          name: '',
          createdAt: '',
          updatedAt: '',
          number: 2,
          ingredients: []
        })
      )
    ).toMatchObject({ ...initialState, currentOrder: { _id: '2' } });
  });
  it('setLoading', () => {
    expect(reducer(initialState, setLoading(true))).toEqual({
      ...initialState,
      loading: true
    });
  });
});
