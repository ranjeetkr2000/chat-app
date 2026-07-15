import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../redux/slices/auth';
import messageReducer from '../redux/slices/message';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      message: messageReducer,
    },
  })
}
