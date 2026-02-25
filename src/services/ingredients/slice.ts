import { createSlice } from '@reduxjs/toolkit';

type TIngredientsState = {
  ingredients: any;
};

const initialState: TIngredientsState = {
  ingredients: []
};
export const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredients: (state, action) => {
      state.ingredients = action.payload;
    },
    addIngredient: (state, action) => {
      state.ingredients.push(action.payload);
    }
  }
});

export const { setIngredients, addIngredient } = ingredientSlice.actions;
export default ingredientSlice.reducer;
