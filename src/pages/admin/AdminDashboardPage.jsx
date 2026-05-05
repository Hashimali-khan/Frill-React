import { TrendingUp, Package, Users, ShoppingBag, Eye } from 'lucide-react'
import { Link } from 'react-router-dom' // <-- ADDED FOR ROUTING
import { useEffect, useState } from 'react'
import { formatPKR } from '@/utils/currency'
import OrderTable from '@/pages/admin/OrderTable'
import { useGetOrdersQuery } from '@/features/orders/ordersApi'

const KPI_CARDS = [
  { label: 'Total Revenue',  value: 248500, format: 'pkr', delta: '+22%', icon: TrendingUp, color: 'green' },
  { label: 'Orders Today',   value: 17,     format: 'num', delta: '+4',   icon: ShoppingBag, color: 'purple' },
  { label: 'Active Products',value: 12,     format: 'num', delta: '+2',   icon: Package,    color: 'magenta' },
  { label: 'Total Customers',value: 2480,   format: 'num', delta: '+130', icon: Users,      color: 'blue' },
]

const COLOR_MAP = {
  green:  'bg-green-50  border-green-200  text-green-700',
  purple: 'bg-purple/5  border-purple/20  text-purple',
  magenta:'bg-magenta/5 border-magenta/20 text-magenta',
  blue:   'bg-blue-50   border-blue-200   text-blue-700',
}

// Recent orders will be loaded from localStorage via getOrders()

export default function AdminDashboardPage() {
  const [recentOrders, setRecentOrders] = useState([])
  const { data: orders = [] } = useGetOrdersQuery()

  useEffect(() => {
    if (orders && orders.length > 0) {
      const sorted = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setRecentOrders(sorted.slice(0, 5))
    } else {
      setRecentOrders([])
    }
  }, [orders])
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-head text-2xl font-black text-purple">Dashboard Overview</h1>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {KPI_CARDS.map(({ label, value, format, delta, icon: Icon, color }) => (
          <div key={label} className={`border rounded-frill-lg p-5 ${COLOR_MAP[color]}`}>
            <div className="flex items-start justify-between mb-3">
              <Icon size={20} />
              <span className="font-head text-[.7rem] font-bold bg-white/60 px-2 py-0.5 rounded-full">
                {delta} this week
              </span>
            </div>
            <p className="font-head text-2xl font-black">
              {format === 'pkr' ? formatPKR(value, true) : value.toLocaleString()}
            </p>
            <p className="font-head text-[.72rem] font-semibold uppercase tracking-wide opacity-60 mt-0.5">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Recent Orders Table ── */}
      <div className="bg-white border border-brand-border rounded-frill-lg overflow-hidden shadow-sm">
        <div className="flex justify-between items-center p-5 border-b border-brand-border">
          <h2 className="font-head font-bold text-purple text-lg">Recent Orders</h2>
          {/* FIX: Replaced <a> with <Link> */}
          <Link to="/admin/orders" className="text-sm font-semibold text-magenta hover:text-magenta-hot hover:underline">
            View All Orders →
          </Link>
        </div>
        
          <div>
        <OrderTable orders={recentOrders} variant="dashboard" />
      </div>
      </div>
    </div>
  )
}