import { FC, memo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store/store';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { addBun, addIngredient } from '../../services/constructor/slice';
import type { AppDispatch } from '../../services/store/store';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();

    const handleAdd = useCallback(() => {
      if (ingredient.type === 'bun') {
        dispatch(addBun(ingredient));
      } else {
        const ingredientWithId = {
          ...ingredient,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
        };
        dispatch(addIngredient(ingredientWithId));
      }
    }, [dispatch, ingredient]);

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
