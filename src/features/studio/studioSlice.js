import { createSlice } from '@reduxjs/toolkit'
import { DEFAULT_PRINT_AREA, DEFAULT_STAGE } from './studioUtils'

const MAX_HISTORY = 30

function createDesign() {
  return {
    stage: { ...DEFAULT_STAGE },
    background: {
      color: '#f8f7fb',
      imageUrl: '',
      viewId: 'front',
      viewLabel: 'Front',
      printArea: { ...DEFAULT_PRINT_AREA },
    },
    product: {
      id: null,
      name: '',
      colorId: null,
      colorName: '',
      colorHex: '#ffffff',
      price: 0,
    },
    objects: [],
  }
}

function cloneDesign(design) {
  return JSON.parse(JSON.stringify(design))
}

function createHistoryState() {
  const present = createDesign()
  return {
    past: [],
    present,
    future: [],
    lastCommitted: cloneDesign(present),
  }
}

const initialState = {
  history: createHistoryState(),
  ui: {
    tool: 'select',
    activeObjectId: null,
    brush: {
      color: '#111827',
      size: 6,
    },
    keyboardLayout: 'qwerty',
    zoom: 1,
    snapping: true,
  },
}

function areDesignsEqual(a, b) {
  try {
    return JSON.stringify(a) === JSON.stringify(b)
  } catch {
    return false
  }
}

const studioSlice = createSlice({
  name: 'studio',
  initialState,
  reducers: {
    setTool(state, { payload }) {
      state.ui.tool = payload
    },
    setActiveObject(state, { payload }) {
      state.ui.activeObjectId = payload
    },
    clearActiveObject(state) {
      state.ui.activeObjectId = null
    },
    setBrush(state, { payload }) {
      state.ui.brush = { ...state.ui.brush, ...payload }
    },
    setKeyboardLayout(state, { payload }) {
      state.ui.keyboardLayout = payload
    },
    setZoom(state, { payload }) {
      state.ui.zoom = payload
    },
    setSnapping(state, { payload }) {
      state.ui.snapping = payload
    },
    setStageSize(state, { payload }) {
      state.history.present.stage = {
        ...state.history.present.stage,
        ...payload,
      }
    },
    setBackground(state, { payload }) {
      state.history.present.background = {
        ...state.history.present.background,
        ...payload,
      }
    },
    setProductContext(state, { payload }) {
      state.history.present.product = {
        ...state.history.present.product,
        ...payload,
      }
    },
    addObject(state, { payload }) {
      const object = {
        ...payload,
        // Tag object with the currently active view so designs stay view-specific
        viewId: state.history.present.background.viewId,
      }
      state.history.present.objects.push(object)
      state.ui.activeObjectId = object.id
    },
    updateObject(state, { payload }) {
      const { id, changes } = payload
      const index = state.history.present.objects.findIndex((obj) => obj.id === id)
      if (index < 0) return
      state.history.present.objects[index] = {
        ...state.history.present.objects[index],
        ...changes,
      }
    },
    finalizeObject(state, { payload }) {
      const { id, changes } = payload
      const index = state.history.present.objects.findIndex((obj) => obj.id === id)
      if (index < 0) return
      state.history.present.objects[index] = {
        ...state.history.present.objects[index],
        ...changes,
      }
    },
    removeObject(state, { payload }) {
      state.history.present.objects = state.history.present.objects.filter((obj) => obj.id !== payload)
      if (state.ui.activeObjectId === payload) {
        state.ui.activeObjectId = null
      }
    },
    reorderObject(state, { payload }) {
      const { id, direction } = payload
      const objects = state.history.present.objects
      const index = objects.findIndex((obj) => obj.id === id)
      if (index < 0) return

      if (direction === 'forward' && index < objects.length - 1) {
        const next = objects[index + 1]
        objects[index + 1] = objects[index]
        objects[index] = next
      }

      if (direction === 'backward' && index > 0) {
        const prev = objects[index - 1]
        objects[index - 1] = objects[index]
        objects[index] = prev
      }

      if (direction === 'front' && index < objects.length - 1) {
        const [item] = objects.splice(index, 1)
        objects.push(item)
      }

      if (direction === 'back' && index > 0) {
        const [item] = objects.splice(index, 1)
        objects.unshift(item)
      }
    },
    setDesign(state, { payload }) {
      state.history = {
        past: [],
        present: cloneDesign(payload),
        future: [],
        lastCommitted: cloneDesign(payload),
      }
      state.ui.activeObjectId = null
    },
    resetStudio(state) {
      state.history = createHistoryState()
      state.ui.activeObjectId = null
      state.ui.tool = 'select'
      state.ui.zoom = 1
    },
    commitHistory(state) {
      const current = state.history.present
      const lastCommitted = state.history.lastCommitted
      if (areDesignsEqual(current, lastCommitted)) return

      state.history.past.push(cloneDesign(lastCommitted))
      if (state.history.past.length > MAX_HISTORY) {
        state.history.past.shift()
      }

      state.history.lastCommitted = cloneDesign(current)
      state.history.future = []
    },
    undo(state) {
      if (state.history.past.length === 0) return

      const previous = state.history.past.pop()
      state.history.future.unshift(cloneDesign(state.history.lastCommitted))
      state.history.lastCommitted = cloneDesign(previous)
      state.history.present = cloneDesign(previous)
      state.ui.activeObjectId = null
    },
    redo(state) {
      if (state.history.future.length === 0) return

      const next = state.history.future.shift()
      state.history.past.push(cloneDesign(state.history.lastCommitted))
      state.history.lastCommitted = cloneDesign(next)
      state.history.present = cloneDesign(next)
      state.ui.activeObjectId = null
    },
  },
})

export const {
  setTool,
  setActiveObject,
  clearActiveObject,
  setBrush,
  setKeyboardLayout,
  setZoom,
  setSnapping,
  setStageSize,
  setBackground,
  setProductContext,
  addObject,
  updateObject,
  finalizeObject,
  removeObject,
  reorderObject,
  setDesign,
  resetStudio,
  commitHistory,
  undo,
  redo,
} = studioSlice.actions

export default studioSlice.reducer

export const selectDesign = (state) => state.studio.history.present
export const selectObjects = (state) => state.studio.history.present.objects
export const selectActiveObjectId = (state) => state.studio.ui.activeObjectId
export const selectUiState = (state) => state.studio.ui
export const selectCanUndo = (state) => state.studio.history.past.length > 0
export const selectCanRedo = (state) => state.studio.history.future.length > 0
export const selectActiveObject = (state) => {
  const id = state.studio.ui.activeObjectId
  if (!id) return null
  return state.studio.history.present.objects.find((obj) => obj.id === id) || null
}
