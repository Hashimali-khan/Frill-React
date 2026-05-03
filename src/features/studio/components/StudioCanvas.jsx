import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Rect, Image as KonvaImage, Text, Line, Group, Transformer, Circle } from 'react-konva'
import Konva from 'konva'
import { useDispatch, useSelector } from 'react-redux'
import {
  addObject,
  clearActiveObject,
  finalizeObject,
  selectActiveObjectId,
  selectDesign,
  selectUiState,
  setActiveObject,
  setZoom,
  updateObject,
} from '../studioSlice'
import { clamp, createLineObject } from '../studioUtils'

const SNAP_THRESHOLD = 6

function useResizeObserver(ref, onResize) {
  useEffect(() => {
    if (!ref.current) return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) onResize(entry.contentRect)
    })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref, onResize])
}

function useKonvaImage(src) {
  const [image, setImage] = useState(null)

  useEffect(() => {
    if (!src) {
      setImage(null)
      return
    }

    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setImage(img)
    img.src = src

    return () => {
      img.onload = null
    }
  }, [src])

  return image
}

function getCropAttributes(object, image) {
  if (!object?.crop || !image) return null
  const zoom = Math.max(object.crop.zoom || 1, 1)
  const cropWidth = image.width / zoom
  const cropHeight = image.height / zoom
  const offsetX = clamp(object.crop.offsetX ?? 0.5, 0, 1)
  const offsetY = clamp(object.crop.offsetY ?? 0.5, 0, 1)
  const cropX = (image.width - cropWidth) * offsetX
  const cropY = (image.height - cropHeight) * offsetY

  return {
    x: cropX,
    y: cropY,
    width: cropWidth,
    height: cropHeight,
  }
}

function DesignImageNode({ object, isActive, onSelect, onDragMove, onDragEnd }) {
  const shapeRef = useRef(null)
  const image = useKonvaImage(object.src)
  const crop = getCropAttributes(object, image)

  const filters = useMemo(() => {
    const items = []
    if (object.filters?.grayscale) items.push(Konva.Filters.Grayscale)
    if (object.filters?.brightness) items.push(Konva.Filters.Brighten)
    return items
  }, [object.filters])

  useEffect(() => {
    if (!shapeRef.current) return
    if (!filters.length) {
      shapeRef.current.clearCache()
      return
    }

    shapeRef.current.cache()
    shapeRef.current.filters(filters)
    shapeRef.current.brightness(object.filters?.brightness || 0)
    shapeRef.current.getLayer()?.batchDraw()
  }, [filters, object.filters])

  return (
    <KonvaImage
      id={object.id}
      name="design-object"
      ref={shapeRef}
      image={image}
      x={object.x}
      y={object.y}
      width={object.width}
      height={object.height}
      scaleX={object.scaleX}
      scaleY={object.scaleY}
      rotation={object.rotation}
      skewX={object.skewX}
      skewY={object.skewY}
      opacity={object.opacity}
      crop={crop || undefined}
      draggable={!object.locked}
      onClick={onSelect}
      onTap={onSelect}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      listening
    />
  )
}

export default function StudioCanvas({ stageRef, backgroundLayerRef, designLayerRef, uiLayerRef }) {
  const dispatch = useDispatch()
  const design = useSelector(selectDesign)
  const ui = useSelector(selectUiState)
  const activeObjectId = useSelector(selectActiveObjectId)
  const containerRef = useRef(null)
  const groupRef = useRef(null)
  const transformerRef = useRef(null)
  const dragRafRef = useRef(null)
  const pinchRef = useRef(null)

  const [stageSize, setStageSize] = useState({ width: 800, height: 700 })
  const [guides, setGuides] = useState([])
  const [draftLine, setDraftLine] = useState(null)

  useResizeObserver(containerRef, (rect) => {
    setStageSize({ width: rect.width, height: rect.height })
  })

  const backgroundImage = useKonvaImage(design.background.imageUrl)

  const fitScale = useMemo(() => {
    const widthScale = stageSize.width / design.stage.width
    const heightScale = stageSize.height / design.stage.height
    return Math.min(widthScale, heightScale) * 0.96
  }, [stageSize, design.stage])

  const stageScale = useMemo(() => fitScale * ui.zoom, [fitScale, ui.zoom])
  const offsetX = (stageSize.width - design.stage.width * stageScale) / 2
  const offsetY = (stageSize.height - design.stage.height * stageScale) / 2

  const handleTouchStart = useCallback(
    (event) => {
      if (!stageRef.current) return
      const touches = event.evt.touches
      if (touches.length !== 2) return

      const stage = stageRef.current
      const rect = stage.container().getBoundingClientRect()
      const point1 = { x: touches[0].clientX - rect.left, y: touches[0].clientY - rect.top }
      const point2 = { x: touches[1].clientX - rect.left, y: touches[1].clientY - rect.top }
      const center = { x: (point1.x + point2.x) / 2, y: (point1.y + point2.y) / 2 }

      const designPoint = {
        x: (center.x - offsetX) / stageScale,
        y: (center.y - offsetY) / stageScale,
      }

      let isOnActive = false
      const activeNode = activeObjectId ? stage.findOne(`#${activeObjectId}`) : null
      if (activeNode && groupRef.current) {
        const box = activeNode.getClientRect({ relativeTo: groupRef.current })
        isOnActive =
          designPoint.x >= box.x &&
          designPoint.x <= box.x + box.width &&
          designPoint.y >= box.y &&
          designPoint.y <= box.y + box.height
      }

      pinchRef.current = {
        dist: Math.hypot(point1.x - point2.x, point1.y - point2.y),
        angle: Math.atan2(point2.y - point1.y, point2.x - point1.x),
        zoom: ui.zoom,
        isOnActive,
        object: activeNode
          ? {
              id: activeNode.id(),
              scaleX: activeNode.scaleX(),
              scaleY: activeNode.scaleY(),
              rotation: activeNode.rotation(),
            }
          : null,
      }
    },
    [activeObjectId, offsetX, offsetY, stageScale, stageRef, ui.zoom]
  )

  const handleTouchMove = useCallback(
    (event) => {
      if (!stageRef.current || !pinchRef.current) return
      const touches = event.evt.touches
      if (touches.length !== 2) return

      const stage = stageRef.current
      const rect = stage.container().getBoundingClientRect()
      const point1 = { x: touches[0].clientX - rect.left, y: touches[0].clientY - rect.top }
      const point2 = { x: touches[1].clientX - rect.left, y: touches[1].clientY - rect.top }

      const newDist = Math.hypot(point1.x - point2.x, point1.y - point2.y)
      const newAngle = Math.atan2(point2.y - point1.y, point2.x - point1.x)
      const scaleChange = newDist / pinchRef.current.dist
      const rotationChange = ((newAngle - pinchRef.current.angle) * 180) / Math.PI

      if (pinchRef.current.isOnActive && pinchRef.current.object) {
        dispatch(
          updateObject({
            id: pinchRef.current.object.id,
            changes: {
              scaleX: clamp(pinchRef.current.object.scaleX * scaleChange, 0.2, 4),
              scaleY: clamp(pinchRef.current.object.scaleY * scaleChange, 0.2, 4),
              rotation: pinchRef.current.object.rotation + rotationChange,
            },
          })
        )
      } else {
        const nextZoom = clamp(pinchRef.current.zoom * scaleChange, 0.5, 3)
        dispatch(setZoom(nextZoom))
      }
    },
    [dispatch, stageRef]
  )

  const handleTouchEnd = useCallback(() => {
    if (!pinchRef.current) return
    if (pinchRef.current.isOnActive && pinchRef.current.object) {
      dispatch(
        finalizeObject({
          id: pinchRef.current.object.id,
          changes: {},
        })
      )
    }
    pinchRef.current = null
  }, [dispatch])

  const getDesignPointer = useCallback(
    (stage) => {
      const pos = stage.getPointerPosition()
      if (!pos) return null
      return {
        x: (pos.x - offsetX) / stageScale,
        y: (pos.y - offsetY) / stageScale,
      }
    },
    [offsetX, offsetY, stageScale]
  )

  const handleStagePointerDown = useCallback(
    (event) => {
      if (!stageRef.current) return
      if (event.evt?.touches && event.evt.touches.length > 1) {
        handleTouchStart(event)
        return
      }

      if (ui.tool === 'brush') {
        const stage = stageRef.current
        const point = getDesignPointer(stage)
        if (!point) return
        setDraftLine({
          points: [point.x, point.y],
          stroke: ui.brush.color,
          strokeWidth: ui.brush.size,
        })
        dispatch(clearActiveObject())
        return
      }

      const clickedOnEmpty = event.target === event.target.getStage() || event.target.name() === 'background'
      if (clickedOnEmpty) {
        dispatch(clearActiveObject())
      }
    },
      [dispatch, getDesignPointer, handleTouchStart, stageRef, ui.tool, ui.brush]
  )

  const handleStagePointerMove = useCallback(
    (event) => {
      if (event.evt?.touches && event.evt.touches.length > 1) {
        handleTouchMove(event)
        return
      }
      if (ui.tool !== 'brush' || !draftLine || !stageRef.current) return
      const stage = stageRef.current
      const point = getDesignPointer(stage)
      if (!point) return

      setDraftLine((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          points: prev.points.concat([point.x, point.y]),
        }
      })
    },
      [draftLine, getDesignPointer, handleTouchMove, stageRef, ui.tool]
  )

  const handleStagePointerUp = useCallback((event) => {
    if (event?.evt?.touches && event.evt.touches.length > 0) return
    if (pinchRef.current) handleTouchEnd()
    if (ui.tool !== 'brush' || !draftLine) return
    if (draftLine.points.length > 2) {
      dispatch(
        addObject(
          createLineObject({
            points: draftLine.points,
            stroke: draftLine.stroke,
            strokeWidth: draftLine.strokeWidth,
          })
        )
      )
    }
    setDraftLine(null)
  }, [dispatch, draftLine, handleTouchEnd, ui.tool])

  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return
    const stage = stageRef.current
    const transformer = transformerRef.current
    const selectedNode = activeObjectId ? stage.findOne(`#${activeObjectId}`) : null

    if (selectedNode) {
      transformer.nodes([selectedNode])
    } else {
      transformer.nodes([])
    }

    transformer.getLayer()?.batchDraw()
  }, [activeObjectId, design.objects, stageRef])

  useEffect(() => {
    if (!backgroundLayerRef?.current) return
    backgroundLayerRef.current.batchDraw()
  }, [backgroundImage, design.background, backgroundLayerRef])

  const handleSelect = useCallback(
    (id) => {
      if (ui.tool === 'brush') return
      dispatch(setActiveObject(id))
    },
    [dispatch, ui.tool]
  )

  const scheduleObjectUpdate = useCallback(
    (id, changes) => {
      if (dragRafRef.current) return
      dragRafRef.current = requestAnimationFrame(() => {
        dispatch(updateObject({ id, changes }))
        dragRafRef.current = null
      })
    },
    [dispatch]
  )

  const getLineGuideStops = useCallback(
    (skipId) => {
      const vertical = [0, design.stage.width / 2, design.stage.width]
      const horizontal = [0, design.stage.height / 2, design.stage.height]

      if (!stageRef.current || !groupRef.current) return { vertical, horizontal }

      stageRef.current.find('.design-object').forEach((node) => {
        if (node.id() === skipId) return
        const box = node.getClientRect({ relativeTo: groupRef.current })
        vertical.push(box.x, box.x + box.width / 2, box.x + box.width)
        horizontal.push(box.y, box.y + box.height / 2, box.y + box.height)
      })

      return { vertical, horizontal }
    },
    [design.stage, stageRef]
  )

  const getObjectSnappingEdges = useCallback((node) => {
    const box = node.getClientRect({ relativeTo: groupRef.current })
    const position = node.position()

    return {
      vertical: [
        { guide: box.x, offset: position.x - box.x },
        { guide: box.x + box.width / 2, offset: position.x - (box.x + box.width / 2) },
        { guide: box.x + box.width, offset: position.x - (box.x + box.width) },
      ],
      horizontal: [
        { guide: box.y, offset: position.y - box.y },
        { guide: box.y + box.height / 2, offset: position.y - (box.y + box.height / 2) },
        { guide: box.y + box.height, offset: position.y - (box.y + box.height) },
      ],
    }
  }, [])

  const getGuides = useCallback((lineGuideStops, itemBounds) => {
    const result = []

    const verticalGuides = []
    lineGuideStops.vertical.forEach((lineGuide) => {
      itemBounds.vertical.forEach((itemBound) => {
        const diff = Math.abs(lineGuide - itemBound.guide)
        if (diff < SNAP_THRESHOLD) {
          verticalGuides.push({
            guide: lineGuide,
            offset: itemBound.offset,
            diff,
            orientation: 'V',
          })
        }
      })
    })

    const horizontalGuides = []
    lineGuideStops.horizontal.forEach((lineGuide) => {
      itemBounds.horizontal.forEach((itemBound) => {
        const diff = Math.abs(lineGuide - itemBound.guide)
        if (diff < SNAP_THRESHOLD) {
          horizontalGuides.push({
            guide: lineGuide,
            offset: itemBound.offset,
            diff,
            orientation: 'H',
          })
        }
      })
    })

    const closestV = verticalGuides.sort((a, b) => a.diff - b.diff)[0]
    const closestH = horizontalGuides.sort((a, b) => a.diff - b.diff)[0]

    if (closestV) result.push(closestV)
    if (closestH) result.push(closestH)

    return result
  }, [])

  const handleDragMove = useCallback(
    (event, id) => {
      const node = event.target
      if (!ui.snapping) {
        scheduleObjectUpdate(id, { x: node.x(), y: node.y() })
        return
      }

      const lineGuideStops = getLineGuideStops(id)
      const itemBounds = getObjectSnappingEdges(node)
      const guides = getGuides(lineGuideStops, itemBounds)

      if (guides.length === 0) {
        setGuides([])
        scheduleObjectUpdate(id, { x: node.x(), y: node.y() })
        return
      }

      const position = node.position()
      guides.forEach((guide) => {
        if (guide.orientation === 'V') {
          position.x = guide.guide + guide.offset
        } else if (guide.orientation === 'H') {
          position.y = guide.guide + guide.offset
        }
      })

      node.position(position)
      setGuides(guides)
      scheduleObjectUpdate(id, { x: position.x, y: position.y })
    },
    [getGuides, getLineGuideStops, getObjectSnappingEdges, scheduleObjectUpdate, ui.snapping]
  )

  const handleDragEnd = useCallback(
    (event, id) => {
      const node = event.target
      dispatch(finalizeObject({ id, changes: { x: node.x(), y: node.y() } }))
      setGuides([])
    },
    [dispatch]
  )

  const handleTransformEnd = useCallback(() => {
    if (!transformerRef.current) return
    const node = transformerRef.current.nodes()[0]
    if (!node) return

    dispatch(
      finalizeObject({
        id: node.id(),
        changes: {
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY(),
          skewX: node.skewX(),
          skewY: node.skewY(),
        },
      })
    )
  }, [dispatch])

  const handleWheel = useCallback(
    (event) => {
      event.evt.preventDefault()
      const direction = event.evt.deltaY > 0 ? -1 : 1
      const nextZoom = clamp(ui.zoom + direction * 0.08, 0.5, 2.8)
      dispatch(setZoom(nextZoom))
    },
    [dispatch, ui.zoom]
  )

  const backgroundDimensions = useMemo(() => {
    if (!backgroundImage) {
      return { x: 0, y: 0, width: design.stage.width, height: design.stage.height }
    }

    const scale = Math.min(
      design.stage.width / backgroundImage.width,
      design.stage.height / backgroundImage.height
    )
    const width = backgroundImage.width * scale
    const height = backgroundImage.height * scale

    return {
      width,
      height,
      x: (design.stage.width - width) / 2,
      y: (design.stage.height - height) / 2,
    }
  }, [backgroundImage, design.stage])

  return (
    <div ref={containerRef} className="w-full h-full">
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={handleStagePointerDown}
        onTouchStart={handleStagePointerDown}
        onMouseMove={handleStagePointerMove}
        onTouchMove={handleStagePointerMove}
        onMouseUp={handleStagePointerUp}
        onTouchEnd={handleStagePointerUp}
        onWheel={handleWheel}
      >
        <Layer ref={backgroundLayerRef} listening>
          <Group x={offsetX} y={offsetY} scaleX={stageScale} scaleY={stageScale}>
            <Rect
              name="background"
              width={design.stage.width}
              height={design.stage.height}
              fill={design.background.color}
              listening
            />
            {backgroundImage && (
              <KonvaImage
                image={backgroundImage}
                x={backgroundDimensions.x}
                y={backgroundDimensions.y}
                width={backgroundDimensions.width}
                height={backgroundDimensions.height}
                listening={false}
                opacity={0.98}
              />
            )}
          </Group>
        </Layer>

        <Layer ref={designLayerRef}>
          <Group ref={groupRef} x={offsetX} y={offsetY} scaleX={stageScale} scaleY={stageScale}>
            {design.objects.map((object) => {
              if (object.type === 'text') {
                const fontStyle = `${object.fontWeight === 'bold' ? 'bold' : 'normal'}${
                  object.fontStyle === 'italic' ? ' italic' : ''
                }`.trim()
                return (
                  <Text
                    key={object.id}
                    id={object.id}
                    name="design-object"
                    text={object.text}
                    x={object.x}
                    y={object.y}
                    width={object.width}
                    fontFamily={object.fontFamily}
                    fontSize={object.fontSize}
                    fontStyle={fontStyle}
                    fill={object.fill}
                    align={object.align}
                    lineHeight={object.lineHeight}
                    letterSpacing={object.letterSpacing}
                    direction={object.direction}
                    opacity={object.opacity}
                    rotation={object.rotation}
                    scaleX={object.scaleX}
                    scaleY={object.scaleY}
                    skewX={object.skewX}
                    skewY={object.skewY}
                    draggable={!object.locked && ui.tool !== 'brush'}
                    onClick={() => handleSelect(object.id)}
                    onTap={() => handleSelect(object.id)}
                    onDragMove={(e) => handleDragMove(e, object.id)}
                    onDragEnd={(e) => handleDragEnd(e, object.id)}
                  />
                )
              }

              if (object.type === 'image') {
                return (
                  <DesignImageNode
                    key={object.id}
                    object={object}
                    isActive={object.id === activeObjectId}
                    onSelect={() => handleSelect(object.id)}
                    onDragMove={(e) => handleDragMove(e, object.id)}
                    onDragEnd={(e) => handleDragEnd(e, object.id)}
                  />
                )
              }

              if (object.type === 'shape' && object.shape === 'circle') {
                return (
                  <Circle
                    key={object.id}
                    id={object.id}
                    name="design-object"
                    x={object.x}
                    y={object.y}
                    radius={object.radius}
                    fill={object.fill}
                    stroke={object.stroke}
                    strokeWidth={object.strokeWidth}
                    opacity={object.opacity}
                    rotation={object.rotation}
                    scaleX={object.scaleX}
                    scaleY={object.scaleY}
                    skewX={object.skewX}
                    skewY={object.skewY}
                    draggable={!object.locked && ui.tool !== 'brush'}
                    onClick={() => handleSelect(object.id)}
                    onTap={() => handleSelect(object.id)}
                    onDragMove={(e) => handleDragMove(e, object.id)}
                    onDragEnd={(e) => handleDragEnd(e, object.id)}
                  />
                )
              }

              if (object.type === 'shape') {
                return (
                  <Rect
                    key={object.id}
                    id={object.id}
                    name="design-object"
                    x={object.x}
                    y={object.y}
                    width={object.width}
                    height={object.height}
                    fill={object.fill}
                    stroke={object.stroke}
                    strokeWidth={object.strokeWidth}
                    opacity={object.opacity}
                    rotation={object.rotation}
                    scaleX={object.scaleX}
                    scaleY={object.scaleY}
                    skewX={object.skewX}
                    skewY={object.skewY}
                    cornerRadius={8}
                    draggable={!object.locked && ui.tool !== 'brush'}
                    onClick={() => handleSelect(object.id)}
                    onTap={() => handleSelect(object.id)}
                    onDragMove={(e) => handleDragMove(e, object.id)}
                    onDragEnd={(e) => handleDragEnd(e, object.id)}
                  />
                )
              }

              if (object.type === 'line') {
                return (
                  <Line
                    key={object.id}
                    id={object.id}
                    name="design-object"
                    points={object.points}
                    stroke={object.stroke}
                    strokeWidth={object.strokeWidth}
                    lineCap={object.lineCap}
                    lineJoin={object.lineJoin}
                    tension={object.tension}
                    opacity={object.opacity}
                    rotation={object.rotation}
                    scaleX={object.scaleX}
                    scaleY={object.scaleY}
                    onClick={() => handleSelect(object.id)}
                    onTap={() => handleSelect(object.id)}
                  />
                )
              }

              return null
            })}

            {draftLine && (
              <Line
                points={draftLine.points}
                stroke={draftLine.stroke}
                strokeWidth={draftLine.strokeWidth}
                lineCap="round"
                lineJoin="round"
                tension={0.5}
              />
            )}
          </Group>
        </Layer>

        <Layer ref={uiLayerRef} listening={false}>
          <Group x={offsetX} y={offsetY} scaleX={stageScale} scaleY={stageScale}>
            <Rect
              x={design.background.printArea.x}
              y={design.background.printArea.y}
              width={design.background.printArea.width}
              height={design.background.printArea.height}
              stroke="#C2185B"
              dash={[8, 6]}
              strokeWidth={1.5}
              opacity={0.8}
            />
            {guides.map((guide, index) => (
              <Line
                key={`${guide.orientation}-${index}`}
                points={
                  guide.orientation === 'V'
                    ? [guide.guide, 0, guide.guide, design.stage.height]
                    : [0, guide.guide, design.stage.width, guide.guide]
                }
                stroke="#E11D48"
                strokeWidth={1}
                dash={[4, 6]}
              />
            ))}
          </Group>
          <Transformer
            ref={transformerRef}
            rotateEnabled
            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right', 'top-center', 'bottom-center']}
            anchorSize={10}
            borderDash={[4, 4]}
            onTransformEnd={handleTransformEnd}
          />
        </Layer>
      </Stage>
    </div>
  )
}
