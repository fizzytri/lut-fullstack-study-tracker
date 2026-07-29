import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import goalService from './goalService'
import { extractError } from '../../app/api'

const initialState = {
  items: [],
  isLoading: false,
  isError: false,
  message: '',
}

export const fetchGoals = createAsyncThunk('goals/fetch', async (_, thunkAPI) => {
  try {
    return await goalService.getGoals()
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error))
  }
})

export const addGoal = createAsyncThunk('goals/add', async (payload, thunkAPI) => {
  try {
    return await goalService.createGoal(payload)
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error))
  }
})

export const toggleGoal = createAsyncThunk('goals/toggle', async ({ id, completed }, thunkAPI) => {
  try {
    return await goalService.updateGoal(id, { completed })
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error))
  }
})

export const removeGoal = createAsyncThunk('goals/remove', async (id, thunkAPI) => {
  try {
    return await goalService.deleteGoal(id)
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error))
  }
})

const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(addGoal.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(toggleGoal.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload._id ? action.payload : item
        )
      })
      .addCase(removeGoal.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload.id)
      })
      .addMatcher(
        (action) => action.type.startsWith('goals/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false
          state.isError = true
          state.message = action.payload
        }
      )
  },
})

export default goalSlice.reducer
