import { TIngredient } from '@utils-types';

export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const SET_BUN = 'SET_BUN';

export const addIngredient = (ingredient: TIngredient) => ({
  type: ADD_INGREDIENT,
  payload: ingredient
});

export const setBun = (bun: TIngredient) => ({
  type: SET_BUN,
  payload: bun
});
