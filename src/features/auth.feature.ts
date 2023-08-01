import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface IAuthState {
    token: string | null;
}

const initialState: IAuthState = {
    token: null
}

export const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
        state.token = action.payload;
    },
    logout(state) {
        state.token = null;
    }
  },
})

export const { login, logout } = auth.actions;

export const selectToken = (state: RootState) => state.auth.token;

export default auth.reducer