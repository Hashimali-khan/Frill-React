import { createSlice } from '@reduxjs/toolkit';

const studioSlice = createSlice({ name: 'studio', initialState: { tools: [] }, reducers: { setTools(state, action) { state.tools = action.payload; } } });

export const { setTools } = studioSlice.actions;
export default studioSlice.reducer;
