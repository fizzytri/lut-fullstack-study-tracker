import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import goalService from './goalService'

const initialState = {
  goals: [],
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

export const getGoals = createAsyncThunk('goals/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await goalService.getGoals(token)
  } catch (error) {
    return thunkAPI.rejectWithValue(getMessage(error))
  }
})

export const createGoal = createAsyncThunk('goals/create', async (goalData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await goalService.createGoal(goalData, token)
  } catch (error) {
    return thunkAPI.rejectWithValue(getMessage(error))
  }
})

export const updateGoal = createAsyncThunk('goals/update', async (data, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await goalService.updateGoal(data.id, data.goalData, token)
  } catch (error) {
    return thunkAPI.rejectWithValue(getMessage(error))
  }
})

export const deleteGoal = createAsyncThunk('goals/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await goalService.deleteGoal(id, token)
  } catch (error) {
    return thunkAPI.rejectWithValue(getMessage(error))
  }
})

export const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGoals.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getGoals.fulfilled, (state, action) => {
        state.isLoading = false
        state.goals = action.payload
      })
      .addCase(getGoals.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.goals.push(action.payload)
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        state.goals = state.goals.map((goal) =>
          goal._id === action.payload._id ? action.payload : goal
        )
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter((goal) => goal._id !== action.payload.id)
      })
  },
})

export default goalSlice.reducer
