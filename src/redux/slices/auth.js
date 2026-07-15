import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

export const authSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },

    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    updateProfile: (state, action) => {
      if (!state.user) return;
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },

    updateOnlineStatus: (state, action) => {
      if (!state.user) return;
      state.user.isOnline = action.payload;
    },
  },
});

export const {
  setUser,
  clearUser,
  setLoading,
  updateProfile,
  updateOnlineStatus,
} = authSlice.actions;

export default authSlice.reducer;
