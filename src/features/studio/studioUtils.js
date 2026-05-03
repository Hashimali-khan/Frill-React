import { nanoid } from '@reduxjs/toolkit'

export const DEFAULT_STAGE = {
  width: 820,
  height: 960,
}

export const DEFAULT_PRINT_AREA = {
  x: 170,
  y: 180,
  width: 480,
  height: 520,
}

export const VIEW_OPTIONS = [
  { id: 'front', label: 'Front' },
  { id: 'back', label: 'Back' },
  { id: 'sleeve', label: 'Sleeve' },
]

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function createTextObject(overrides = {}) {
  return {
    id: overrides.id || nanoid(),
    type: 'text',
    name: overrides.name || 'Text',
    x: overrides.x ?? 220,
    y: overrides.y ?? 240,
    rotation: overrides.rotation ?? 0,
    scaleX: overrides.scaleX ?? 1,
    scaleY: overrides.scaleY ?? 1,
    skewX: overrides.skewX ?? 0,
    skewY: overrides.skewY ?? 0,
    opacity: overrides.opacity ?? 1,
    text: overrides.text ?? 'Edit text',
    fontFamily: overrides.fontFamily ?? 'Montserrat',
    fontSize: overrides.fontSize ?? 48,
    fontStyle: overrides.fontStyle ?? 'normal',
    fontWeight: overrides.fontWeight ?? 'bold',
    fill: overrides.fill ?? '#3B1F5E',
    align: overrides.align ?? 'center',
    width: overrides.width ?? 320,
    lineHeight: overrides.lineHeight ?? 1.2,
    letterSpacing: overrides.letterSpacing ?? 0,
    direction: overrides.direction ?? 'ltr',
  }
}

export function createImageObject(overrides = {}) {
  return {
    id: overrides.id || nanoid(),
    type: 'image',
    name: overrides.name || 'Image',
    x: overrides.x ?? 220,
    y: overrides.y ?? 220,
    rotation: overrides.rotation ?? 0,
    scaleX: overrides.scaleX ?? 1,
    scaleY: overrides.scaleY ?? 1,
    skewX: overrides.skewX ?? 0,
    skewY: overrides.skewY ?? 0,
    opacity: overrides.opacity ?? 1,
    src: overrides.src || '',
    width: overrides.width ?? 260,
    height: overrides.height ?? 260,
    crop: {
      zoom: overrides.crop?.zoom ?? 1,
      offsetX: overrides.crop?.offsetX ?? 0.5,
      offsetY: overrides.crop?.offsetY ?? 0.5,
    },
    filters: {
      grayscale: overrides.filters?.grayscale ?? false,
      brightness: overrides.filters?.brightness ?? 0,
    },
  }
}

export function createShapeObject(shape = 'rect', overrides = {}) {
  return {
    id: overrides.id || nanoid(),
    type: 'shape',
    shape,
    name: overrides.name || (shape === 'circle' ? 'Circle' : 'Rectangle'),
    x: overrides.x ?? 240,
    y: overrides.y ?? 260,
    rotation: overrides.rotation ?? 0,
    scaleX: overrides.scaleX ?? 1,
    scaleY: overrides.scaleY ?? 1,
    skewX: overrides.skewX ?? 0,
    skewY: overrides.skewY ?? 0,
    opacity: overrides.opacity ?? 1,
    width: overrides.width ?? 220,
    height: overrides.height ?? 160,
    radius: overrides.radius ?? 70,
    fill: overrides.fill ?? '#C2185B',
    stroke: overrides.stroke ?? 'transparent',
    strokeWidth: overrides.strokeWidth ?? 0,
  }
}

export function createLineObject(overrides = {}) {
  return {
    id: overrides.id || nanoid(),
    type: 'line',
    name: overrides.name || 'Brush Stroke',
    points: overrides.points || [],
    stroke: overrides.stroke ?? '#111827',
    strokeWidth: overrides.strokeWidth ?? 6,
    lineCap: overrides.lineCap ?? 'round',
    lineJoin: overrides.lineJoin ?? 'round',
    tension: overrides.tension ?? 0.5,
    opacity: overrides.opacity ?? 1,
    rotation: overrides.rotation ?? 0,
    scaleX: overrides.scaleX ?? 1,
    scaleY: overrides.scaleY ?? 1,
  }
}

export function serializeDesign(design) {
  try {
    return JSON.stringify(design)
  } catch {
    return ''
  }
}

export function parseDesign(payload, fallback) {
  if (!payload) return fallback
  try {
    const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload
    return parsed && typeof parsed === 'object' ? parsed : fallback
  } catch {
    return fallback
  }
}
