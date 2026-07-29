import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import courseReducer from '../features/courses/courseSlice'
import sessionReducer from '../features/sessions/sessionSlice'
import goalReducer from '../features/goals/goalSlice'
import statsReducer from '../features/stats/statsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    sessions: sessionReducer,
    goals: goalReducer,
    stats: statsReducer,
  },
})
