import reducer, { initialState } from '../src/services/ingredients/slice';
import { fetchIngredients } from '../src/services/ingredients/actions';
import { TIngredient } from '../src/utils/types';

const fakeIngredient: TIngredient = {
  _id: 'foo',
  name: 'Булка',
  type: 'bun',
  proteins: 1,
  fat: 2,
  carbohydrates: 3,
  calories: 4,
  price: 100,
  image: 'url',
  image_large: 'urlL',
  image_mobile: 'urlM'
};

describe('ingredientSlice', () => {
  it('returns initial state by default', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('fetchIngredients async actions', () => {
    it('pending sets loading', () => {
      const state = reducer(
        initialState,
        fetchIngredients.pending('', undefined)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled sets ingredients and stops loading', () => {
      const payload = [
        fakeIngredient,
        { ...fakeIngredient, _id: 'bar', name: 'Салат' }
      ];
      const state = reducer(
        initialState,
        fetchIngredients.fulfilled(payload, '', undefined)
      );
      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual(payload);
      expect(state.error).toBeNull();
    });

    it('rejected sets error and disables loading', () => {
      const action: any = {
        type: fetchIngredients.rejected.type,
        error: { message: 'loading failed' }
      };
      const state = reducer({ ...initialState, isLoading: true }, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('loading failed');
    });
  });

  it('returns state for unknown action', () => {
    expect(reducer(initialState, { type: 'unknown_action' })).toEqual(
      initialState
    );
  });
});
