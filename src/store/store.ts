import { configureStore } from '@reduxjs/toolkit';
import { anyReducer } from '../slice/slice';

export const store = configureStore({
  reducer: {
    any: anyReducer
  }
});

export default store;
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
