import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { designsApi } from '@/features/designs/designsApi'
import { persistOrderDesigns } from '@/utils/designPersistence'

const ORDERS_STORAGE_KEY = 'frill_orders'
const DESIGNS_STORAGE_KEY = 'frill_designs_v2'

function loadOrders() {
  if (typeof window === 'undefined') return []
  try {
    const stored = window.localStorage.getItem(ORDERS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveOrders(orders) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
}

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Order', 'Design'],
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      async onQueryStarted(_order, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          // Force a hard refresh of all designsApi cache entries
          dispatch(designsApi.util.resetApiState())
          // Then re-populate by dispatching an invalidation
          dispatch(designsApi.util.invalidateTags([{ type: 'Design', id: 'LIST' }]))
        } catch {
          // Ignore if the order creation itself fails.
        }
      },
      queryFn: async (order) => {
        try {
          // Simulate API latency
          await new Promise(r => setTimeout(r, 800))
          
          // Get existing orders
          const orders = loadOrders()
          
          // Create new order with ID and timestamp
          const newOrder = {
            ...order,
            id: `ORD-${Date.now()}`,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          
          // Add to storage
          orders.push(newOrder)
          saveOrders(orders)
          
          persistOrderDesigns(order, newOrder.id)
          
          return { data: newOrder }
        } catch (err) {
          return Promise.reject({
            response: { data: { message: 'Failed to save order' } }
          })
        }
      },
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),

    getOrders: builder.query({
      queryFn: async (customerId = null) => {
        try {
          // Simulate API latency
          await new Promise(r => setTimeout(r, 500))
          
          let orders = loadOrders()
          
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
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Order', id: 'LIST' },
              ...result.map((o) => ({ type: 'Order', id: o.id })),
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    updateOrderStatus: builder.mutation({
      queryFn: async ({ orderId, status }) => {
        try {
          const orders = loadOrders()
          const orderIdx = orders.findIndex(o => o.id === orderId)
          if (orderIdx === -1) throw new Error('Order not found')
          
          orders[orderIdx].status = status
          orders[orderIdx].updatedAt = new Date().toISOString()
          
          saveOrders(orders)
          return { data: orders[orderIdx] }
        } catch (err) {
          return Promise.reject({
            response: { data: { message: 'Failed to update order' } }
          })
        }
      },
      invalidatesTags: (_, __, { orderId }) => [
        { type: 'Order', id: 'LIST' },
        { type: 'Order', id: orderId },
      ],
    }),
  }),
})

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} = ordersApi
