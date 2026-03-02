import { combineSlices } from '@reduxjs/toolkit';
import {
  ingredientSlice,
  initialState as ingredientsInit
} from '../src/services/ingredients/slice';
import {
  constructorSlice,
  initialState as constructorInit
} from '../src/services/constructor/slice';
import {
  orderSlice,
  initialState as orderInit
} from '../src/services/order/slice';
import {
  feedSlice,
  initialState as feedInit
} from '../src/services/feed/slice';
import {
  userSlice,
  initialState as userInit
} from '../src/services/user/slice';
import {
  profileSlice,
  initialState as profileInit
} from '../src/services/profile/slice';

const rootReducer = combineSlices(
  ingredientSlice,
  constructorSlice,
  orderSlice,
  feedSlice,
  userSlice,
  profileSlice
);

describe('rootReducer', () => {
  it('возвращает начальное состояние при неизвестном экшене', () => {
    const initialState = rootReducer(undefined, { type: 'SOME_UNKNOWN' });
    expect(initialState).toEqual({
      ingredients: ingredientsInit,
      burgerConstructor: constructorInit,
      order: orderInit,
      feed: feedInit,
      user: userInit,
      profile: profileInit
    });
  });
});
