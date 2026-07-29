import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import courseService from './courseService'

const initialState = {
  courses: [],
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

export const getCourses = createAsyncThunk('courses/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await courseService.getCourses(token)
  } catch (error) {
    return thunkAPI.rejectWithValue(getMessage(error))
  }
})

export const createCourse = createAsyncThunk('courses/create', async (courseData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await courseService.createCourse(courseData, token)
  } catch (error) {
    return thunkAPI.rejectWithValue(getMessage(error))
  }
})

export const updateCourse = createAsyncThunk('courses/update', async (data, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await courseService.updateCourse(data.id, data.courseData, token)
  } catch (error) {
    return thunkAPI.rejectWithValue(getMessage(error))
  }
})

export const deleteCourse = createAsyncThunk('courses/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await courseService.deleteCourse(id, token)
  } catch (error) {
    return thunkAPI.rejectWithValue(getMessage(error))
  }
})

export const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCourses.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCourses.fulfilled, (state, action) => {
        state.isLoading = false
        state.courses = action.payload
      })
      .addCase(getCourses.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.courses.unshift(action.payload)
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.courses = state.courses.map((course) =>
          course._id === action.payload._id ? action.payload : course
        )
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter((course) => course._id !== action.payload.id)
      })
  },
})

export default courseSlice.reducer
