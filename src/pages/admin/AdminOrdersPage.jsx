import { useState, useEffect } from 'react'
import { cn } from '@/utils/cn'
import { getOrders, updateOrderStatus } from '@/api/orders.api'
import { useToast } from '@/hooks/useToast'
import OrderTable from '@/pages/admin/OrderTable'

const STATUS_PIPELINE = ['pending', 'processing', 'shipped', 'delivered']
const STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
}

export default function AdminOrdersPage() {
  const { toast } = useToast()
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    setLoading(true)
    try {
      const { data } = await getOrders()
      setOrders(data || [])
    } catch (err) {
      console.error('Failed to load orders:', err)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  async function advanceStatus(orderId) {
    const order = orders.find(o => o.id === orderId)
    if (!order) return

    const currentIdx = STATUS_PIPELINE.indexOf(order.status)
    if (currentIdx < STATUS_PIPELINE.length - 1) {
      const newStatus = STATUS_PIPELINE[currentIdx + 1]
      try {
        await updateOrderStatus(orderId, newStatus)
        await loadOrders()
        toast.success(`Order status updated to ${STATUS_LABELS[newStatus]}`)
      } catch (err) {
        console.error('Failed to update order status:', err)
        toast.error('Failed to update order status')
      }
    }
  }

  // Derived state for the filter tabs
  const displayed = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-head text-2xl font-black text-purple">Orders</h1>
        
        {/* Dynamic Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={() => setFilter('all')}
            className={cn('font-head text-[.68rem] font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full border transition-colors',
              filter === 'all' ? 'bg-purple text-white border-purple' : 'border-brand-border text-frill-600 hover:border-purple')}
          >
            All ({orders.length})
          </button>
          {STATUS_PIPELINE.map(s => (
            <button 
              key={s} 
              onClick={() => setFilter(s)}
              className={cn('font-head text-[.68rem] font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full border transition-colors',
                filter === s ? 'bg-purple text-white border-purple' : 'border-brand-border text-frill-600 hover:border-purple')}
            >
              {STATUS_LABELS[s]} ({orders.filter(o => o.status === s).length})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin">
            <div className="w-8 h-8 border-4 border-frill-200 border-t-purple rounded-full"></div>
          </div>
          <p className="text-frill-600 mt-4">Loading orders...</p>
        </div>
      ) : (
        <div className="bg-white border border-brand-border rounded-frill-lg overflow-hidden shadow-sm">
          {/* 🔥 THE MAGIC: Replaced 50 lines of HTML with this single component */}
          <OrderTable 
            orders={displayed} 
            onAdvance={advanceStatus} 
          />
        </div>
      )}
    </div>
  )
}