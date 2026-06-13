// GVR Pharma IMS — Auth Slice
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user:    null,   // { uid, email, name, role }
  loading: false,
  error:   null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user    = action.payload;
      state.loading = false;
      state.error   = null;
    },
    clearUser(state) {
      state.user    = null;
      state.loading = false;
      state.error   = null;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error   = action.payload;
      state.loading = false;
    },
  },
});

export const { setUser, clearUser, setLoading, setError } = authSlice.actions;

// Selectors
export const selectUser        = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError   = (state) => state.auth.error;
export const selectUserRole    = (state) => state.auth.user?.role ?? 'sales';

export default authSlice.reducer;
