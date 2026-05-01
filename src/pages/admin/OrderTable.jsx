import { Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPKR } from '@/utils/currency'
import { cn } from '@/utils/cn'

const STATUS_COLORS = {
  Pending:    'bg-amber-100 text-amber-800',
  Confirmed:  'bg-blue-100 text-blue-800',
  Printing:   'bg-purple/10 text-purple',
  Dispatched: 'bg-cyan-100 text-cyan-800',
  Delivered:  'bg-green-100 text-green-800',
  Processing: 'bg-orange-100 text-orange-700',
  Shipped:    'bg-blue-100 text-blue-700',
}

export default function OrderTable({ orders, variant = 'full', onAdvance }) {
  const isDashboard = variant === 'dashboard'

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-sm">
        <thead className="bg-frill-50 text-frill-500 font-head text-[.7rem] uppercase tracking-wider border-b border-brand-border">
          <tr>
            <th className="p-4 font-bold">Order ID</th>
            <th className="p-4 font-bold">Customer</th>
            
            {/* Conditional Columns based on variant */}
            {isDashboard ? (
              <th className="p-4 font-bold">Date</th>
            ) : (
              <>
                <th className="p-4 font-bold">City</th>
                <th className="p-4 font-bold">Items</th>
              </>
            )}
            
            <th className="p-4 font-bold">Total</th>
            <th className="p-4 font-bold">Status</th>
            <th className="p-4 font-bold text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-border">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-frill-50/50 transition-colors">
              <td className="p-4 font-head font-bold text-purple">{order.id}</td>
              
              {/* Customer Column logic */}
              <td className="p-4">
                <p className={isDashboard ? "text-frill-600" : "font-semibold text-frill-800"}>
                  {order.customer}
                </p>
                {!isDashboard && order.phone && (
                  <p className="text-[.7rem] text-frill-400">{order.phone}</p>
                )}
              </td>

              {/* Conditional Data Rows */}
              {isDashboard ? (
                <td className="p-4 text-frill-500">{order.date}</td>
              ) : (
                <>
                  <td className="p-4 text-frill-600">{order.city}</td>
                  <td className="p-4 text-frill-600">{order.items}</td>
                </>
              )}

              <td className="p-4 font-head font-bold">{formatPKR(order.total)}</td>
              
              {/* Status Badge */}
              <td className="p-4">
                <span className={cn('text-[.68rem] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full', STATUS_COLORS[order.status] || 'bg-frill-100 text-frill-600')}>
                  {order.status}
                </span>
              </td>
              
              {/* Actions Column */}
              <td className="p-4 text-center">
                {isDashboard ? (
                  <Link to={`/admin/orders/${order.id}`} className="p-1.5 text-frill-400 hover:text-magenta hover:bg-magenta/10 rounded-md transition-colors inline-flex items-center justify-center">
                    <Eye size={18} />
                  </Link>
                ) : (
                  order.status !== 'Delivered' && onAdvance && (
                    <button onClick={() => onAdvance(order.id)} className="font-head text-[.68rem] font-bold text-magenta hover:underline">
                      Advance →
                    </button>
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}