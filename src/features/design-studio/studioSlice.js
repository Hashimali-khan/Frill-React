import { createSlice } from '@reduxjs/toolkit'

const MAX_HISTORY = 30  // max undo steps to keep in memory

const studioSlice = createSlice({
  name: 'studio',
  initialState: {
    tool:         'select',    // 'select' | 'text' | 'image' | 'shape'
    activeFont:   'Montserrat',
    activeFontSize: 36,
    activeColor:  '#3B1F5E',
    activeProductId: null,
    isDirty:      false,      // has the user made changes?
    history:      [],          // array of JSON strings (canvas snapshots)
    historyIndex: -1,        // current position in history
    previewDataUrl: null,     // generated PNG for print preview
    activeObject: null, // Stores metadata about the selected item
  },
  reducers: {
    setTool(state, { payload }) { state.tool = payload },
    setActiveFont(state, { payload }) { state.activeFont = payload },
    setActiveFontSize(state, { payload }) { state.activeFontSize = payload },
    setActiveColor(state, { payload }) { state.activeColor = payload },
    setActiveProduct(state, { payload }) { state.activeProductId = payload },
    setPreview(state, { payload }) { state.previewDataUrl = payload },
  
    setActiveObject(state, { payload }) {
    state.activeObject = payload;
  },
  clearActiveObject(state) {
    state.activeObject = null;
  },

    /** Push a new canvas snapshot onto the history stack */
    pushHistory(state, { payload: jsonSnapshot }) {
      // Discard any "future" states if user undid then made a new change
      state.history = state.history.slice(0, state.historyIndex + 1)
      state.history.push(jsonSnapshot)
      // Keep only the last MAX_HISTORY snapshots
      if (state.history.length > MAX_HISTORY) state.history.shift()
      state.historyIndex = state.history.length - 1
      state.isDirty = true
    },

    undo(state) {
      if (state.historyIndex > 0) state.historyIndex--
    },
    redo(state) {
      if (state.historyIndex < state.history.length - 1) state.historyIndex++
    },
    resetStudio(state) {
      state.history = []; state.historyIndex = -1
      state.isDirty = false; state.previewDataUrl = null
    },
  },
})

export const { 
  setTool, 
  setActiveFont, 
  setActiveFontSize, 
  setActiveColor,
  setActiveProduct, 
  setPreview, 
  setActiveObject,      
  clearActiveObject,    
  pushHistory, 
  undo, 
  redo, 
  resetStudio 
} = studioSlice.actions

export default studioSlice.reducer

// Selectors
export const selectCanUndo  = state => state.studio.historyIndex > 0
export const selectCanRedo  = state => state.studio.historyIndex < state.studio.history.length - 1
export const selectSnapshot = state => state.studio.history[state.studio.historyIndex]