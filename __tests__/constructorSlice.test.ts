import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  initialState
} from '../src/services/constructor/slice';
import { TConstructorIngredient } from '../src/utils/types';

const ctorIng = (id: string, name: string): TConstructorIngredient => ({
  _id: id,
  name,
  type: 'main',
  proteins: 1,
  fat: 1,
  carbohydrates: 1,
  calories: 1,
  price: 1,
  image: 'img',
  image_large: 'img_l',
  image_mobile: 'img_m',
  id
});

describe('constructorSlice', () => {
  it('добавляет ингредиент', () => {
    const ingredient = ctorIng('1', 'some');
    expect(reducer(initialState, addIngredient(ingredient))).toMatchObject({
      ...initialState,
      ingredients: [ingredient]
    });
  });

  it('удаляет ингредиент по id', () => {
    const ing1 = ctorIng('id_1', 'item1');
    const ing2 = ctorIng('id_2', 'item2');
    const startState = {
      ...initialState,
      ingredients: [ing1, ing2]
    };
    expect(reducer(startState, removeIngredient('id_1')).ingredients).toEqual([
      ing2
    ]);
  });

  it('перемещает ингредиенты', () => {
    const A = ctorIng('A', 'A');
    const B = ctorIng('B', 'B');
    const C = ctorIng('C', 'C');
    const startState = {
      ...initialState,
      ingredients: [A, B, C]
    };
    expect(
      reducer(startState, moveIngredient({ fromIndex: 0, toIndex: 2 }))
        .ingredients
    ).toEqual([B, C, A]);
  });
});
