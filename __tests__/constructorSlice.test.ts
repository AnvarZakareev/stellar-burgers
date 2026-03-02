import reducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../src/services/constructor/slice';
import { TConstructorIngredient, TIngredient } from '../src/utils/types';

const bun: TIngredient = {
  _id: 'bun1',
  name: 'Булка вкусная',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 40,
  price: 100,
  image: 'img',
  image_large: 'img_l',
  image_mobile: 'img_m'
};

const ingredient1: TConstructorIngredient = {
  _id: 'sauce1',
  name: 'Соус классный',
  type: 'sauce',
  proteins: 5,
  fat: 5,
  carbohydrates: 5,
  calories: 5,
  price: 20,
  image: 'img',
  image_large: 'img_l',
  image_mobile: 'img_m',
  id: 'unique-id-1'
};

const ingredient2: TConstructorIngredient = {
  _id: 'main1',
  name: 'Мясо вкусное',
  type: 'main',
  proteins: 50,
  fat: 50,
  carbohydrates: 10,
  calories: 300,
  price: 200,
  image: 'img',
  image_large: 'img_l',
  image_mobile: 'img_m',
  id: 'unique-id-2'
};

describe('constructorSlice', () => {
  it('должен возвращать initialState', () => {
    expect(reducer(undefined, { type: '' })).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('addBun работает', () => {
    const state = reducer(undefined, addBun(bun));
    expect(state.bun).toEqual(bun);
  });

  it('addIngredient работает', () => {
    const state = reducer(undefined, addIngredient(ingredient1));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(ingredient1);
  });

  it('removeIngredient работает', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [ingredient1, ingredient2]
    };
    const state = reducer(
      stateWithIngredients,
      removeIngredient(ingredient1.id)
    );
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(ingredient2);
  });

  it('moveIngredient работает', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [ingredient1, ingredient2]
    };
    const state = reducer(
      stateWithIngredients,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );
    expect(state.ingredients[0]).toEqual(ingredient2);
    expect(state.ingredients[1]).toEqual(ingredient1);
  });

  it('clearConstructor работает', () => {
    const stateWithStuff = {
      bun,
      ingredients: [ingredient1, ingredient2]
    };
    const state = reducer(stateWithStuff, clearConstructor());
    expect(state).toEqual({ bun: null, ingredients: [] });
  });
});
