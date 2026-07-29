import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import sessionService from './sessionService'
import { extractError } from '../../app/api'

const initialState = {
  items: [],
  isLoading: false,
  isError: false,
  message: '',
}

export const fetchSessions = createAsyncThunk('sessions/fetch', async (params, thunkAPI) => {
  try {
    return await sessionService.getSessions(params)
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error))
  }
})

export const addSession = createAsyncThunk('sessions/add', async (payload, thunkAPI) => {
  try {
    return await sessionService.createSession(payload)
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error))
  }
})

export const editSession = createAsyncThunk('sessions/edit', async ({ id, payload }, thunkAPI) => {
  try {
    return await sessionService.updateSession(id, payload)
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error))
  }
})

export const removeSession = createAsyncThunk('sessions/remove', async (id, thunkAPI) => {
  try {
    return await sessionService.deleteSession(id)
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error))
  }
})

const sessionSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(addSession.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(editSession.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload._id ? action.payload : item
        )
      })
      .addCase(removeSession.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload.id)
      })
      .addMatcher(
        (action) => action.type.startsWith('sessions/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false
          state.isError = true
          state.message = action.payload
        }
      )
  },
})

export default sessionSlice.reducer
