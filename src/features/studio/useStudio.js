import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addObject,
  removeObject,
  setTool,
  setBrush,
  setKeyboardLayout,
  undo,
  redo,
  reorderObject,
  selectCanUndo,
  selectCanRedo,
  selectActiveObjectId,
} from './studioSlice'
import {
  createTextObject,
  createImageObject,
  createShapeObject,
  createLineObject,
} from './studioUtils'

export function useStudioActions() {
  const dispatch = useDispatch()
  const canUndo = useSelector(selectCanUndo)
  const canRedo = useSelector(selectCanRedo)
  const activeObjectId = useSelector(selectActiveObjectId)

  const addText = useCallback(
    () => dispatch(addObject(createTextObject())),
    [dispatch]
  )

  const addUrduText = useCallback(
    () =>
      dispatch(
        addObject(
          createTextObject({
            text: 'یہاں لکھیں',
            fontFamily: 'Noto Nastaliq Urdu',
            direction: 'rtl',
            align: 'right',
          })
        )
      ),
    [dispatch]
  )

  const addImage = useCallback(
    (src) => {
      if (!src) return
      dispatch(addObject(createImageObject({ src })))
    },
    [dispatch]
  )

  const addRectangle = useCallback(
    () => dispatch(addObject(createShapeObject('rect'))),
    [dispatch]
  )

  const addCircle = useCallback(
    () => dispatch(addObject(createShapeObject('circle'))),
    [dispatch]
  )

  const addLine = useCallback(
    (line) => dispatch(addObject(createLineObject(line))),
    [dispatch]
  )

  const deleteSelected = useCallback(() => {
    if (activeObjectId) {
      dispatch(removeObject(activeObjectId))
    }
  }, [dispatch, activeObjectId])

  const bringForward = useCallback(
    () => activeObjectId && dispatch(reorderObject({ id: activeObjectId, direction: 'forward' })),
    [dispatch, activeObjectId]
  )

  const sendBackward = useCallback(
    () => activeObjectId && dispatch(reorderObject({ id: activeObjectId, direction: 'backward' })),
    [dispatch, activeObjectId]
  )

  const bringToFront = useCallback(
    () => activeObjectId && dispatch(reorderObject({ id: activeObjectId, direction: 'front' })),
    [dispatch, activeObjectId]
  )

  const sendToBack = useCallback(
    () => activeObjectId && dispatch(reorderObject({ id: activeObjectId, direction: 'back' })),
    [dispatch, activeObjectId]
  )

  return {
    canUndo,
    canRedo,
    addText,
    addUrduText,
    addImage,
    addRectangle,
    addCircle,
    addLine,
    deleteSelected,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    setTool: (tool) => dispatch(setTool(tool)),
    setBrush: (brush) => dispatch(setBrush(brush)),
    setKeyboardLayout: (layout) => dispatch(setKeyboardLayout(layout)),
    undo: () => dispatch(undo()),
    redo: () => dispatch(redo()),
  }
}
