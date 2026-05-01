import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { login as loginApi, signup as signupApi } from '@/api/auth.api'

/** Read persisted token on store initialisation */
const getStoredToken = () => localStorage.getItem('frill_token')
const getStoredUser  = () => {
  try { return JSON.parse(localStorage.getItem('frill_user')) }
  catch { return null }
}

/* ── Async Thunks ── */
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { token, user } = await loginApi(credentials)
    localStorage.setItem('frill_token', token)
    localStorage.setItem('frill_user',  JSON.stringify(user))
    return { token, user }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const signupUser = createAsyncThunk('auth/signup', async (data, { rejectWithValue }) => {
  try {
    const { token, user } = await signupApi(data)
    localStorage.setItem('frill_token', token)
    localStorage.setItem('frill_user',  JSON.stringify(user))
    return { token, user }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Signup failed')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token:  getStoredToken(),
    user:   getStoredUser(),
    status: 'idle',     // 'idle' | 'loading' | 'succeeded' | 'failed'
    error:  null,
  },
  reducers: {
    logout(state) {
      state.token = null; state.user = null; state.status = 'idle'
      localStorage.removeItem('frill_token')
      localStorage.removeItem('frill_user')
    },
  },
  extraReducers: (builder) => {
    [loginUser, signupUser].forEach(thunk => {
      builder
        .addCase(thunk.pending,   state => { state.status = 'loading'; state.error = null })
        .addCase(thunk.fulfilled, (state, { payload }) => {
          state.status = 'succeeded'; state.token = payload.token; state.user = payload.user
        })
        .addCase(thunk.rejected,  (state, { payload }) => {
          state.status = 'failed'; state.error = payload
        })
    })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer

// Selectors
export const selectIsAuthenticated = state => !!state.auth.token
export const selectUser             = state => state.auth.user
export const selectIsAdmin          = state => state.auth.user?.role === 'admin'
export const selectAuthError        = state => state.auth.error
export const selectAuthLoading      = state => state.auth.status === 'loading'