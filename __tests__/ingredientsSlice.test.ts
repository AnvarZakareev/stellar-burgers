import reducer, { initialState } from '../src/services/ingredients/slice';
import { fetchIngredients } from '../src/services/ingredients/actions';
import { TIngredient } from '../src/utils/types';

describe('ingredientsSlice', () => {
  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('ingredients pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('ingredients fulfilled', () => {
    const payload: TIngredient[] = [
      {
        _id: '1',
        name: 'Булка',
        type: 'bun',
        proteins: 1,
        fat: 1,
        carbohydrates: 1,
        calories: 1,
        price: 1,
        image: 'str',
        image_large: 'str',
        image_mobile: 'str'
      }
    ];
    const action = { type: fetchIngredients.fulfilled.type, payload };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.ingredients).toEqual(payload);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('ingredients rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'fail!' }
    };
    const state = reducer({ ...initialState, isLoading: true }, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('fail!');
  });
});
