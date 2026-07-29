import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import courseService from './courseService'
import { extractError } from '../../app/api'

const initialState = {
  items: [],
  isLoading: false,
  isError: false,
  message: '',
}

export const fetchCourses = createAsyncThunk('courses/fetch', async (_, thunkAPI) => {
  try {
    return await courseService.getCourses()
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error))
  }
})

export const addCourse = createAsyncThunk('courses/add', async (payload, thunkAPI) => {
  try {
    return await courseService.createCourse(payload)
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error))
  }
})

export const editCourse = createAsyncThunk('courses/edit', async ({ id, payload }, thunkAPI) => {
  try {
    return await courseService.updateCourse(id, payload)
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error))
  }
})

export const removeCourse = createAsyncThunk('courses/remove', async (id, thunkAPI) => {
  try {
    return await courseService.deleteCourse(id)
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error))
  }
})

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(editCourse.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload._id ? action.payload : item
        )
      })
      .addCase(removeCourse.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload.id)
      })
      .addMatcher(
        (action) => action.type.startsWith('courses/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false
          state.isError = true
          state.message = action.payload
        }
      )
  },
})

export default courseSlice.reducer
