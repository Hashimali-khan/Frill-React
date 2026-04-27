import { useRef, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as fabric from 'fabric'
import {
  pushHistory,
  undo,
  redo,
  setPreview,
  setActiveObject,
  clearActiveObject,
  selectSnapshot,
  selectCanUndo,
  selectCanRedo,
} from './studioSlice'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const DEFAULT_GARMENT_COLOR = '#f3f4f6'

const SAFE_ZONE = {
  left: 220,
  top: 150,
  width: 360,
  height: 320,
}

function serializeCanvas(canvas) {
  return JSON.stringify(
    canvas.toJSON([
      'id',
      'name',
      'selectable',
      'evented',
      'excludeFromExport',
      'hasControls',
      'hasBorders',
    ])
  )
}

function bringObjectToFrontCompat(canvas, obj) {
  if (!canvas || !obj) return

  if (typeof obj.bringToFront === 'function') {
    obj.bringToFront()
    return
  }

  if (typeof canvas.bringObjectToFront === 'function') {
    canvas.bringObjectToFront(obj)
    return
  }

  // Last resort: re-add object to push it to the top of stack.
  canvas.remove(obj)
  canvas.add(obj)
}

function keepSafeZoneOnTop(canvas) {
  const safeZone = canvas?.getObjects()?.find((obj) => obj.id === 'safe-zone')
  if (!safeZone) return
  bringObjectToFrontCompat(canvas, safeZone)
}

function applySafeZone(canvas) {
  const existing = canvas.getObjects().find((obj) => obj.id === 'safe-zone')

  if (existing) {
    existing.set({
      left: SAFE_ZONE.left,
      top: SAFE_ZONE.top,
      width: SAFE_ZONE.width,
      height: SAFE_ZONE.height,
      stroke: '#C2185B',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      fill: 'transparent',
      selectable: false,
      evented: false,
      excludeFromExport: true,
      hasControls: false,
      hasBorders: false,
    })
  } else {
    const safeZone = new fabric.Rect({
      id: 'safe-zone',
      left: SAFE_ZONE.left,
      top: SAFE_ZONE.top,
      width: SAFE_ZONE.width,
      height: SAFE_ZONE.height,
      stroke: '#C2185B',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      fill: 'transparent',
      selectable: false,
      evented: false,
      excludeFromExport: true,
      hasControls: false,
      hasBorders: false,
    })
    canvas.add(safeZone)
  }

  keepSafeZoneOnTop(canvas)

  canvas.clipPath = new fabric.Rect({
    left: SAFE_ZONE.left,
    top: SAFE_ZONE.top,
    width: SAFE_ZONE.width,
    height: SAFE_ZONE.height,
    absolutePositioned: true,
  })
}

function loadFabricImage(url) {
  if (!url) return Promise.resolve(null)

  return new Promise((resolve, reject) => {
    try {
      const maybePromise = fabric.Image.fromURL(url, { crossOrigin: 'anonymous' })
      if (maybePromise && typeof maybePromise.then === 'function') {
        maybePromise.then(resolve).catch(reject)
        return
      }

      fabric.Image.fromURL(url, (img) => resolve(img), { crossOrigin: 'anonymous' })
    } catch (error) {
      reject(error)
    }
  })
}

function syncActiveObjectToStore(canvas, dispatch) {
  const activeObj = canvas.getActiveObject()
  if (!activeObj || activeObj.id === 'safe-zone') {
    dispatch(clearActiveObject())
    return
  }

  dispatch(
    setActiveObject({
      type: activeObj.type,
      fontFamily: activeObj.fontFamily || null,
      fill: activeObj.fill || null,
      opacity: activeObj.opacity ?? 1,
    })
  )
}

/**
 * useStudio: Fabric.js hook for a design editor with history + safe-zone clipping.
 */
export function useStudio(canvasRef, options = {}) {
  const { garmentColor = DEFAULT_GARMENT_COLOR, mockupImageUrl = '' } = options

  const fabricRef = useRef(null)
  const listenersRef = useRef(null)
  const skipHistoryRef = useRef(false)
  const isApplyingSnapshotRef = useRef(false)

  const dispatch = useDispatch()
  const snapshot = useSelector(selectSnapshot)
  const canUndo = useSelector(selectCanUndo)
  const canRedo = useSelector(selectCanRedo)

  const saveSnapshot = useCallback(() => {
    const fc = fabricRef.current
    if (!fc || skipHistoryRef.current || isApplyingSnapshotRef.current) return

    dispatch(pushHistory(serializeCanvas(fc)))
  }, [dispatch])

  const setGarmentBackground = useCallback(async (color, imageUrl) => {
    const fc = fabricRef.current
    if (!fc) return

    fc.backgroundColor = color || DEFAULT_GARMENT_COLOR

    if (imageUrl) {
      try {
        const bgImg = await loadFabricImage(imageUrl)
        if (bgImg) {
          bgImg.set({
            left: 0,
            top: 0,
            originX: 'left',
            originY: 'top',
            selectable: false,
            evented: false,
            opacity: 0.85,
          })
          bgImg.scaleToWidth(fc.getWidth())
          bgImg.scaleToHeight(fc.getHeight())
          fc.backgroundImage = bgImg
        }
      } catch {
        fc.backgroundImage = null
      }
    } else {
      fc.backgroundImage = null
    }

    fc.renderAll()
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return
    if (fabricRef.current) return

    // Defensive cleanup in case Fast Refresh/StrictMode left a stale Fabric handle.
    if (canvasRef.current.__fabric?.dispose) {
      canvasRef.current.__fabric.dispose()
    }

    const fc = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: garmentColor || DEFAULT_GARMENT_COLOR,
      preserveObjectStacking: true,
    })
    fabricRef.current = fc

    applySafeZone(fc)
    void setGarmentBackground(garmentColor, mockupImageUrl)

    const handleSelection = () => syncActiveObjectToStore(fc, dispatch)
    const handleHistoryMutation = () => {
      fc.renderAll()
      saveSnapshot()
      syncActiveObjectToStore(fc, dispatch)
    }

    fc.on('selection:created', handleSelection)
    fc.on('selection:updated', handleSelection)
    fc.on('selection:cleared', handleSelection)

    fc.on('object:added', handleHistoryMutation)
    fc.on('object:modified', handleHistoryMutation)
    fc.on('object:removed', handleHistoryMutation)

    listenersRef.current = { handleHistoryMutation }

    dispatch(pushHistory(serializeCanvas(fc)))
    fc.renderAll()

    return () => {
      fc.dispose()
      fabricRef.current = null
      listenersRef.current = null
    }
  }, [canvasRef, dispatch, saveSnapshot, setGarmentBackground])

  useEffect(() => {
    const fc = fabricRef.current
    if (!fc) return

    void setGarmentBackground(garmentColor, mockupImageUrl)
  }, [garmentColor, mockupImageUrl, setGarmentBackground])

  useEffect(() => {
    const fc = fabricRef.current
    const listeners = listenersRef.current
    if (!fc || !snapshot || !listeners) return

    const { handleHistoryMutation } = listeners

    const restoreFromHistory = async () => {
      isApplyingSnapshotRef.current = true
      skipHistoryRef.current = true

      // Detach mutation listeners while hydrating snapshot to prevent loops.
      fc.off('object:added', handleHistoryMutation)
      fc.off('object:modified', handleHistoryMutation)
      fc.off('object:removed', handleHistoryMutation)

      try {
        const maybePromise = fc.loadFromJSON(JSON.parse(snapshot), () => {})
        if (maybePromise && typeof maybePromise.then === 'function') {
          await maybePromise
        }

        applySafeZone(fc)
        fc.renderAll()
        syncActiveObjectToStore(fc, dispatch)
      } finally {
        fc.on('object:added', handleHistoryMutation)
        fc.on('object:modified', handleHistoryMutation)
        fc.on('object:removed', handleHistoryMutation)
        isApplyingSnapshotRef.current = false
        skipHistoryRef.current = false
      }
    }

    void restoreFromHistory()
  }, [snapshot, dispatch])

  const finalizeObjectAdd = useCallback((obj) => {
    const fc = fabricRef.current
    if (!fc || !obj) return

    fc.add(obj)
    keepSafeZoneOnTop(fc)

    fc.setActiveObject(obj)
    fc.renderAll()
  }, [])

  const addText = useCallback((text = 'Your Text') => {
    const textObj = new fabric.IText(text, {
      left: SAFE_ZONE.left + 20,
      top: SAFE_ZONE.top + 20,
      fontFamily: 'Montserrat',
      fontSize: 42,
      fill: '#3B1F5E',
      editable: true,
    })
    finalizeObjectAdd(textObj)
  }, [finalizeObjectAdd])

  const addUrduText = useCallback(() => {
    const textObj = new fabric.IText('یہاں لکھیں', {
      left: SAFE_ZONE.left + 20,
      top: SAFE_ZONE.top + 20,
      fontFamily: 'Noto Nastaliq Urdu',
      fontSize: 42,
      fill: '#3B1F5E',
      direction: 'rtl',
      textAlign: 'right',
      editable: true,
    })
    finalizeObjectAdd(textObj)
  }, [finalizeObjectAdd])

  const addRectangle = useCallback(() => {
    const rect = new fabric.Rect({
      left: SAFE_ZONE.left + 40,
      top: SAFE_ZONE.top + 40,
      width: 180,
      height: 110,
      rx: 8,
      ry: 8,
      fill: '#C2185B',
      opacity: 0.95,
    })
    finalizeObjectAdd(rect)
  }, [finalizeObjectAdd])

  const addCircle = useCallback(() => {
    const circle = new fabric.Circle({
      left: SAFE_ZONE.left + 70,
      top: SAFE_ZONE.top + 70,
      radius: 58,
      fill: '#3B1F5E',
      opacity: 0.95,
    })
    finalizeObjectAdd(circle)
  }, [finalizeObjectAdd])

  const addImageFromDataUrl = useCallback(async (dataUrl) => {
    const fc = fabricRef.current
    if (!fc || !dataUrl) return

    try {
      const img = await loadFabricImage(dataUrl)
      if (!img) return

      if (img.width > 360) img.scaleToWidth(360)
      img.set({
        left: SAFE_ZONE.left + 30,
        top: SAFE_ZONE.top + 30,
      })
      finalizeObjectAdd(img)
    } catch {
      // Ignore unreadable image payload.
    }
  }, [finalizeObjectAdd])

  const deleteSelected = useCallback(() => {
    const fc = fabricRef.current
    const obj = fc?.getActiveObject()
    if (!fc || !obj || obj.id === 'safe-zone') return

    fc.remove(obj)
    fc.renderAll()
  }, [])

  const duplicateSelected = useCallback(() => {
    const fc = fabricRef.current
    const obj = fc?.getActiveObject()
    if (!fc || !obj || obj.id === 'safe-zone') return

    obj.clone((cloned) => {
      cloned.set({
        left: (obj.left || 0) + 18,
        top: (obj.top || 0) + 18,
      })
      finalizeObjectAdd(cloned)
    })
  }, [finalizeObjectAdd])

  const updateSelectedProperty = useCallback((key, value) => {
    const fc = fabricRef.current
    const activeObj = fc?.getActiveObject()
    if (!fc || !activeObj || activeObj.id === 'safe-zone') return

    activeObj.set(key, value)
    activeObj.setCoords()
    fc.renderAll()

    syncActiveObjectToStore(fc, dispatch)
    dispatch(pushHistory(serializeCanvas(fc)))
  }, [dispatch])

  const bringForward = useCallback(() => {
    const fc = fabricRef.current
    const activeObj = fc?.getActiveObject()
    if (!fc || !activeObj || activeObj.id === 'safe-zone') return

    fc.bringForward(activeObj)
    keepSafeZoneOnTop(fc)
    fc.renderAll()
    dispatch(pushHistory(serializeCanvas(fc)))
  }, [dispatch])

  const sendBackwards = useCallback(() => {
    const fc = fabricRef.current
    const activeObj = fc?.getActiveObject()
    if (!fc || !activeObj || activeObj.id === 'safe-zone') return

    fc.sendBackwards(activeObj)
    fc.renderAll()
    dispatch(pushHistory(serializeCanvas(fc)))
  }, [dispatch])

  const handleUndo = useCallback(() => dispatch(undo()), [dispatch])
  const handleRedo = useCallback(() => dispatch(redo()), [dispatch])

  const generateExports = useCallback(() => {
    const fc = fabricRef.current
    if (!fc) return { mockupUrl: null, printUrl: null }

    fc.discardActiveObject()
    fc.renderAll()

    const mockupUrl = fc.toDataURL({ format: 'png', quality: 1 })

    const originalClipPath = fc.clipPath
    const originalBackgroundImage = fc.backgroundImage
    const originalBackgroundColor = fc.backgroundColor
    const safeZone = fc.getObjects().find((obj) => obj.id === 'safe-zone')
    const originalSafeZoneOpacity = safeZone?.opacity ?? 1

    fc.clipPath = null
    if (safeZone) safeZone.set('opacity', 0)
    fc.backgroundImage = null
    fc.backgroundColor = 'transparent'
    fc.renderAll()

    const printUrl = fc.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 3,
      enableRetinaScaling: true,
    })

    fc.clipPath = originalClipPath
    if (safeZone) safeZone.set('opacity', originalSafeZoneOpacity)
    fc.backgroundImage = originalBackgroundImage
    fc.backgroundColor = originalBackgroundColor
    fc.renderAll()

    dispatch(setPreview(mockupUrl))
    return { mockupUrl, printUrl }
  }, [dispatch])

  // Backward-compatible alias for existing page wiring.
  const generatePreview = useCallback(() => {
    const { mockupUrl } = generateExports()
    return mockupUrl
  }, [generateExports])

  return {
    fabricRef,
    addText,
    addUrduText,
    addRectangle,
    addCircle,
    addImageFromDataUrl,
    deleteSelected,
    duplicateSelected,
    updateSelectedProperty,
    bringForward,
    sendBackwards,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    generateExports,
    generatePreview,
  }
}
