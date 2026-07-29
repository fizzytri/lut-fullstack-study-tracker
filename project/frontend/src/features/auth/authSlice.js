import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'
import { extractError } from '../../app/api'

const stored = localStorage.getItem('user')

const initialState = {
  user: stored ? JSON.parse(stored) : null,
  isLoading: false,
  isError: false,
  message: '',
}

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    return await authService.register(userData)
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error))
  }
})

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    return await authService.login(userData)
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error))
  }
})

export const updateProfile = createAsyncThunk('auth/update', async (payload, thunkAPI) => {
  try {
    return await authService.updateProfile(payload)
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error))
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  authService.logout()
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null
      })
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true
          state.isError = false
          state.message = ''
        }
      )
      .addMatcher(
        (action) =>
          ['auth/register/fulfilled', 'auth/login/fulfilled', 'auth/update/fulfilled'].includes(
            action.type
          ),
        (state, action) => {
          state.isLoading = false
          state.user = action.payload
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false
          state.isError = true
          state.message = action.payload
        }
      )
  },
})

export const { reset } = authSlice.actions
export default authSlice.reducer
