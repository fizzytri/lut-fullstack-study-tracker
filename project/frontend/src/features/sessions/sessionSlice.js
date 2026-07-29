import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import sessionService from './sessionService'

const initialState = {
  sessions: [],
  isError: false,
  isLoading: false,
  message: '',
}

const getMessage = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message
  }

  return error.message
}

export const getSessions = createAsyncThunk('sessions/getAll', async (courseId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await sessionService.getSessions(courseId, token)
  } catch (error) {
    return thunkAPI.rejectWithValue(getMessage(error))
  }
})

export const createSession = createAsyncThunk('sessions/create', async (sessionData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await sessionService.createSession(sessionData, token)
  } catch (error) {
    return thunkAPI.rejectWithValue(getMessage(error))
  }
})

export const deleteSession = createAsyncThunk('sessions/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await sessionService.deleteSession(id, token)
  } catch (error) {
    return thunkAPI.rejectWithValue(getMessage(error))
  }
})

export const sessionSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSessions.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getSessions.fulfilled, (state, action) => {
        state.isLoading = false
        state.sessions = action.payload
      })
      .addCase(getSessions.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.sessions.unshift(action.payload)
      })
      .addCase(deleteSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.filter((session) => session._id !== action.payload.id)
      })
  },
})

export default sessionSlice.reducer
