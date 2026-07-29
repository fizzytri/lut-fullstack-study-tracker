import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import statsService from './statsService'
import { extractError } from '../../app/api'

const initialState = {
  summary: null,
  isLoading: false,
  isError: false,
  message: '',
}

export const fetchSummary = createAsyncThunk('stats/summary', async (days, thunkAPI) => {
  try {
    return await statsService.getSummary(days)
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error))
  }
})

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummary.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.isLoading = false
        state.summary = action.payload
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export default statsSlice.reducer
