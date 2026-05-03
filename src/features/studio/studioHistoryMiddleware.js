import {
  addObject,
  removeObject,
  reorderObject,
  setBackground,
  setStageSize,
  finalizeObject,
  commitHistory,
} from './studioSlice'

const HISTORY_TRIGGER_ACTIONS = new Set([
  addObject.type,
  removeObject.type,
  reorderObject.type,
  setBackground.type,
  setStageSize.type,
  finalizeObject.type,
])

export const studioHistoryMiddleware = (store) => (next) => (action) => {
  const result = next(action)

  if (HISTORY_TRIGGER_ACTIONS.has(action.type)) {
    store.dispatch(commitHistory())
  }

  return result
}
