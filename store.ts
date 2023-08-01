import { configureStore } from '@reduxjs/toolkit'
import authReducer from './src/features/auth.feature'
import remindersReducer from './src/features/reminders.feature'
import usersReducer from './src/features/users.feature'

export const store = configureStore({
  reducer: {
    users: usersReducer,
    reminders: remindersReducer,
    auth: authReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch