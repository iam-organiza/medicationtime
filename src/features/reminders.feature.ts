import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export type TimeOfDay = {
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
};

export interface IReminder {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: number;
  addedBy: string;
}

interface IRemindersState {
  list: Record<string, IReminder>
}

const initialState: IRemindersState = {
  list: {}
}

export const auth = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    initReminders: (state, action) => {
      state.list = action.payload;
    },
    addReminder: (state, action) => {
      state.list[action.payload.name] = action.payload;
    },
  },
})

export const { addReminder, initReminders } = auth.actions;
export const selectReminders = (state: RootState) => state.reminders.list;
export default auth.reducer;
