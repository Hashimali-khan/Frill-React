const DESIGNS_STORAGE_KEY = 'frill_designs_v2'
const ORDERS_STORAGE_KEY = 'frill_orders'

function safeParseArray(rawValue) {
  if (!rawValue) return []

  try {
    const parsed = JSON.parse(rawValue)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function getDesignIdentity(design) {
  return design.sourceKey || `order:${design.orderId || 'mock'}:${design.id}`
}

function getOrderIdentity(order, item, index) {
  return item?.key || item?.designId || `idx-${index}`
}

function hashStringToPositiveInt(input) {
  let hash = 5381

  for (let index = 0; index < input.length; index += 1) {
    hash = ((hash << 5) + hash) + input.charCodeAt(index)
    hash |= 0
  }

  return Math.abs(hash) + 1000
}

function createDesignFromOrderItem(order, item, index) {
  if (!item || (!item.designJson && !item.designId)) return null

  const orderId = order?.id || null
  const sourceKey = `${orderId || 'order'}:${getOrderIdentity(order, item, index)}`
  const customerName = [order?.firstName, order?.lastName].filter(Boolean).join(' ').trim() || 'Guest Customer'
  const createdAt = order?.createdAt ? new Date(order.createdAt) : new Date()
  const createdDate = Number.isNaN(createdAt.getTime()) ? new Date() : createdAt
  const dateValue = createdDate.toISOString().split('T')[0]
  const numericId = hashStringToPositiveInt(sourceKey)

  return {
    id: numericId,
    customerId: order?.customerId || 'default-user',
    customerName,
    customerEmail: order?.email || 'noemail@frill.pk',
    product: item.name || item.product?.name || 'Custom Product',
    productId: item.productId || item.product?.id || 0,
    title: `Order ${orderId || 'draft'} Design`,
    description: `Design created during checkout for order ${orderId || 'draft'}`,
    status: 'pending',
    createdAt: dateValue,
    updatedAt: dateValue,
    canvasJson: item.designJson || null,
    previewUrl: item.mockupUrl || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop',
    printUrl: item.printUrl || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&h=1500&fit=crop',
    notes: `Auto-created from order ${orderId || 'draft'}`,
    orderId,
    sourceKey,
  }
}

export function loadStoredDesigns() {
  if (typeof window === 'undefined') return []
  return safeParseArray(window.localStorage.getItem(DESIGNS_STORAGE_KEY))
}

export function loadStoredOrders() {
  if (typeof window === 'undefined') return []
  return safeParseArray(window.localStorage.getItem(ORDERS_STORAGE_KEY))
}

export function persistOrderDesigns(order, orderId) {
  if (typeof window === 'undefined') return []

  const existingDesigns = loadStoredDesigns()
  const existingByIdentity = new Set(existingDesigns.map(getDesignIdentity))
  const sourceOrder = orderId ? { ...order, id: orderId } : order
  const derivedDesigns = []

  ;(sourceOrder?.items || []).forEach((item, index) => {
    const design = createDesignFromOrderItem(sourceOrder, item, index)
    if (!design) return

    const identity = getDesignIdentity(design)
    if (existingByIdentity.has(identity)) return

    existingByIdentity.add(identity)
    derivedDesigns.push(design)
  })

  if (derivedDesigns.length > 0) {
    window.localStorage.setItem(DESIGNS_STORAGE_KEY, JSON.stringify([...existingDesigns, ...derivedDesigns]))
  }

  return derivedDesigns
}

export function hydrateDesignsFromOrders(designs = []) {
  if (typeof window === 'undefined') return designs

  const existingByIdentity = new Set(designs.map(getDesignIdentity))
  const orders = loadStoredOrders()
  const hydrated = [...designs]

  orders.forEach((order) => {
    ;(order.items || []).forEach((item, index) => {
      const design = createDesignFromOrderItem(order, item, index)
      if (!design) return

      const identity = getDesignIdentity(design)
      if (existingByIdentity.has(identity)) return

      existingByIdentity.add(identity)
      hydrated.push(design)
    })
  })

  const seenIds = new Set()
  return hydrated.map((design, index) => {
    if (!seenIds.has(design.id)) {
      seenIds.add(design.id)
      return design
    }

    const reassigned = {
      ...design,
      id: hashStringToPositiveInt(`${getDesignIdentity(design)}:${index}`),
    }
    seenIds.add(reassigned.id)
    return reassigned
  })
}
