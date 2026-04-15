import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    email: "",
    name: "",
    avatar: "",
    status: "",
    isOnline: "",
  },
  reducers: {
    updateProfile: (state, action) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.avatar = action.payload.avatar;
      state.status = action.payload.status;
      state.isOnline = action.payload.isOnline;
    },
    updateOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
  },
});

// this is for dispatch
export const { updateProfile, updateOnlineStatus } = userSlice.actions;

// this is for configureStore
export default userSlice.reducer;
