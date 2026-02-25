import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SetAnyPayload = {
  id: string;
};

type AnyState = {
  id: string | null;
};

const initialState: AnyState = {
  id: null
};

const slice = createSlice({
  name: 'any',
  initialState,
  reducers: {
    setAny: (state, action: PayloadAction<SetAnyPayload>) => {
      state = action.payload;
    },
    clearAny: () => initialState
  }
});

export const anyActions = slice.actions;
export const anyReducer = slice.reducer;
