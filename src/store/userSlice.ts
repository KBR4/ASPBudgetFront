import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = number;
const increment: CaseReducer<State, PayloadAction<number>> = (state, action) =>
  state + action.payload;

export const userSlice = createSlice({
  reducerPath: 'user',
  name: 'test',
  initialState: 0,
  reducers: {
    increment,
  },
});
