import { createSlice } from '@reduxjs/toolkit';

export const conversationsSlice = createSlice({
  name: 'todos',
  initialState: {
    conversations: [],
  },
  reducers: {
  },
});

// this is for dispatch
export const { } = conversationsSlice.actions;

// this is for configureStore
export default conversationsSlice.reducer;
