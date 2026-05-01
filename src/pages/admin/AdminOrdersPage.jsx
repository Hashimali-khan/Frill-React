import { useState } from 'react'
import { cn } from '@/utils/cn'
import OrderTable from '@/pages/admin/OrderTable'

const STATUS_PIPELINE = ['Pending', 'Confirmed', 'Printing', 'Dispatched', 'Delivered']

/** Mock orders — replace with RTK Query useGetOrdersQuery() */
const MOCK_ORDERS = [
  { id: '#F-1024', customer: 'Ahmed Hassan', city: 'Lahore',   items: 2, total: 4998, status: 'Printing',   date: '2026-03-20', phone: '0311-2345678' },
  { id: '#F-1023', customer: 'Sara Raza',    city: 'Islamabad', items: 1, total: 2499, status: 'Dispatched', date: '2026-03-19', phone: '0321-9876543' },
  { id: '#F-1022', customer: 'M. Kamran',    city: 'Karachi',   items: 50,total: 89950,status: 'Confirmed',  date: '2026-03-18', phone: '0333-1122334' },
]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [filter, setFilter] = useState('all')

  function advanceStatus(orderId) {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o
      const idx = STATUS_PIPELINE.indexOf(o.status)
      if (idx < STATUS_PIPELINE.length - 1)
        return { ...o, status: STATUS_PIPELINE[idx + 1] }
      return o
    }))
  }

  // Derived state for the filter tabs
  const displayed = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-head text-2xl font-black text-purple">Orders</h1>
        
        {/* Dynamic Filter Tabs */}
        <div className="flex gap-2">
          {['all', ...STATUS_PIPELINE].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={cn('font-head text-[.68rem] font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full border transition-colors',
                filter === s ? 'bg-purple text-white border-purple' : 'border-brand-border text-frill-600 hover:border-purple')}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-brand-border rounded-frill-lg overflow-hidden shadow-sm">
        {/* 🔥 THE MAGIC: Replaced 50 lines of HTML with this single component */}
        <OrderTable 
          orders={displayed} 
          onAdvance={advanceStatus} 
        />
      </div>
    </div>
  )
}