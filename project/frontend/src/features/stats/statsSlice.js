import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import statsService from './statsService'

const initialState = {
  summary: null,
  isError: false,
  isLoading: false,
  message: '',
}

export const getSummary = createAsyncThunk('stats/getSummary', async (days, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await statsService.getSummary(days, token)
  } catch (error) {
    let message = error.message

    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message
    }

    return thunkAPI.rejectWithValue(message)
  }
})

export const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSummary.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getSummary.fulfilled, (state, action) => {
        state.isLoading = false
        state.summary = action.payload
      })
      .addCase(getSummary.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export default statsSlice.reducer
