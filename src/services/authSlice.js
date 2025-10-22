import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { authStorage } from './../storage/authStorage'

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch('http://192.168.1.100:10601/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })
      if (!response.ok)  {
        const data = await response.json()
        throw new Error(data.message || 'Login failed')
      }
      const user = await response.json()
      await authStorage.saveUser({ ...user, data: { ...user.data, deviceId: credentials.deviceId } })
      return { user: user.data, token: user.token }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  })

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { getState }) => {
    try {
      const { token } = getState().auth
      if (token) {
        await fetch('http://192.168.1.100:10601/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      }
    } catch (error) {
      console.warn('⚠️ Logout API error:', error)
    } finally {
      await authStorage.removeUser();
    }
    return null
  })

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, loading: false },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.token = action.payload?.token || null
    },
    logout: (state) => {
      state.user = null
      state.token = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
      })
  }
})

export const { setUser, logout } = authSlice.actions;
export const loading = state => state.auth.loading;
export default authSlice.reducer
