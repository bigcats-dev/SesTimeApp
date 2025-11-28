import { configureStore } from '@reduxjs/toolkit'
import  leaveApi  from './src/services/leave'
import authReducer from './src/services/authSlice'
import scheduleApi from './src/services/schedule'
import masterApi from './src/services/master'
import overTimeApi from './src/services/overTime'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [leaveApi.reducerPath]: leaveApi.reducer,
    [scheduleApi.reducerPath]: scheduleApi.reducer,
    [masterApi.reducerPath]: masterApi.reducer,
    [overTimeApi.reducerPath]: overTimeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(leaveApi.middleware, scheduleApi.middleware, masterApi.middleware,overTimeApi.middleware),
})