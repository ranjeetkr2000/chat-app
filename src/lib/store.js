import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../redux/slices/user';

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
  })
}
