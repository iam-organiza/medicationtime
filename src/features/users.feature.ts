import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface IUser {
  email: string; 
  password: string
}

interface IUsersState {
  list: Record<string, IUser>
}

const initialState: IUsersState = {
  list: {}
}

export const auth = createSlice({
  name: 'users',
  initialState,
  reducers: {
    initUsers: (state, action) => {
      state.list = action.payload;
    },
    addUser: (state, action) => {
      state.list[action.payload.email] = action.payload;
    },
  },
})

export const { addUser, initUsers } = auth.actions;
export const selectUsers = (state: RootState) => state.users.list;
export default auth.reducer;
