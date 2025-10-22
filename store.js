import { configureStore } from '@reduxjs/toolkit'
import  leaveApi  from './src/services/leave'
import authReducer from './src/services/authSlice'
import scheduleApi from './src/services/schedule'
import masterApi from './src/services/master'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [leaveApi.reducerPath]: leaveApi.reducer,
    [scheduleApi.reducerPath]: scheduleApi.reducer,
    [masterApi.reducerPath]: masterApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(leaveApi.middleware, scheduleApi.middleware, masterApi.middleware),
})