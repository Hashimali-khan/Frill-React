/** Save order to localStorage and return with ID + timestamp */
import { persistOrderDesigns } from '@/utils/designPersistence'

export async function createOrder(order) {
  try {
    // Simulate API latency
    await new Promise(r => setTimeout(r, 800))
    
    // Get existing orders
    const stored = localStorage.getItem('frill_orders')
    const orders = stored ? JSON.parse(stored) : []
    
    // Create new order with ID and timestamp
    const newOrder = {
      ...order,
      id: `ORD-${Date.now()}`,
      status: 'pending', // pending | processing | shipped | delivered
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    // Add to storage
    orders.push(newOrder)
    localStorage.setItem('frill_orders', JSON.stringify(orders))

    persistOrderDesigns(order, newOrder.id)
    
    return { data: newOrder }
  } catch (err) {
    return Promise.reject({ 
      response: { data: { message: 'Failed to save order' } } 
    })
  }
}

/** Retrieve all orders (or filter by customerId) */
export async function getOrders(customerId = null) {
  try {
    // Simulate API latency
    await new Promise(r => setTimeout(r, 500))
    
    const stored = localStorage.getItem('frill_orders')
    let orders = stored ? JSON.parse(stored) : []
    
    // If customerId provided, filter
    if (customerId) {
      orders = orders.filter(o => o.customerId === customerId)
    }
    
    return { data: orders, total: orders.length }
  } catch (err) {
    return Promise.reject({ 
      response: { data: { message: 'Failed to fetch orders' } } 
    })
  }
}

/** Update order status (for admin) */
export async function updateOrderStatus(orderId, status) {
  try {
    const stored = localStorage.getItem('frill_orders')
    let orders = stored ? JSON.parse(stored) : []
    
    const orderIdx = orders.findIndex(o => o.id === orderId)
    if (orderIdx === -1) throw new Error('Order not found')
    
    orders[orderIdx].status = status
    orders[orderIdx].updatedAt = new Date().toISOString()
    
    localStorage.setItem('frill_orders', JSON.stringify(orders))
    return { data: orders[orderIdx] }
  } catch (err) {
    return Promise.reject({
      response: { data: { message: 'Failed to update order' } }
    })
  }
}
