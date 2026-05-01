import { useEffect, useMemo, useState } from 'react'
import { Mail, MessageSquare, Ban, Check, Search, Download } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatPKR } from '@/utils/currency'
import { useToast } from '@/hooks/useToast'
import { CUSTOMERS_MOCK } from '@/data/customers.mock'

const CUSTOMER_STORAGE_KEY = 'frill-admin-customers'

const STATUS_COLORS = {
  active: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-800' },
  inactive: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', badge: 'bg-gray-100 text-gray-800' },
  banned: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-800' },
}

/**
 * Customer Details Modal
 */
function CustomerModal({ customer, onClose, onStatusChange }) {
  if (!customer) return null

  const currentConfig = STATUS_COLORS[customer.status]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-frill-lg max-w-3xl w-full shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-linear-to-r from-purple to-magenta text-white p-6 flex items-start justify-between gap-6 sticky top-0">
          <div>
            <h2 className="font-head text-xl font-black">{customer.name}</h2>
            <p className="text-sm text-white/70">{customer.email}</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${customer.status === 'active' ? 'bg-green-300' : customer.status === 'inactive' ? 'bg-gray-300' : 'bg-red-300'}`} />
              <span className="text-[.7rem] font-bold uppercase tracking-[0.25em] text-white/90">
                {customer.status}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-white/70 text-2xl">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          
          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-frill-50 rounded-frill">
            <div>
              <p className="text-[.7rem] uppercase font-bold tracking-wider text-frill-600 mb-1">Email</p>
              <a href={`mailto:${customer.email}`} className="font-semibold text-purple hover:text-magenta">
                {customer.email}
              </a>
            </div>
            <div>
              <p className="text-[.7rem] uppercase font-bold tracking-wider text-frill-600 mb-1">Phone</p>
              <a href={`tel:${customer.phone}`} className="font-semibold text-frill-900">
                {customer.phone}
              </a>
            </div>
            <div>
              <p className="text-[.7rem] uppercase font-bold tracking-wider text-frill-600 mb-1">City</p>
              <p className="font-semibold text-frill-900">{customer.city}</p>
            </div>
            <div>
              <p className="text-[.7rem] uppercase font-bold tracking-wider text-frill-600 mb-1">Country</p>
              <p className="font-semibold text-frill-900">{customer.country}</p>
            </div>
          </div>

          {/* Account Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center p-4 bg-purple/5 rounded-frill">
            <div>
              <p className="text-[.7rem] uppercase font-bold tracking-wider text-frill-600 mb-1">Orders</p>
              <p className="font-head text-2xl font-black text-purple">{customer.orders}</p>
            </div>
            <div>
              <p className="text-[.7rem] uppercase font-bold tracking-wider text-frill-600 mb-1">Total Spent</p>
              <p className="font-head text-lg font-black text-purple">{formatPKR(customer.totalSpent, true)}</p>
            </div>
            <div>
              <p className="text-[.7rem] uppercase font-bold tracking-wider text-frill-600 mb-1">Member Since</p>
              <p className="font-semibold text-frill-900 text-sm">{customer.joinedDate}</p>
            </div>
          </div>

          {/* Status Management */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="font-head text-xs font-bold uppercase tracking-wide text-frill-600">Account Status</h3>
                <p className="text-xs text-frill-500 mt-1">Status can only be changed from this details panel.</p>
              </div>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[.7rem] font-bold uppercase tracking-wide ${currentConfig.badge}`}>
                {customer.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['active', 'inactive', 'banned'].map(status => (
                <button
                  key={status}
                  type="button"
                  onClick={() => onStatusChange(customer.id, status)}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-frill border px-4 py-3 text-left transition-all',
                    customer.status === status
                      ? 'border-purple bg-purple/5 shadow-sm'
                      : 'border-brand-border hover:border-purple hover:bg-frill-50'
                  )}
                >
                  <div>
                    <p className="font-head text-xs font-bold uppercase tracking-wide text-frill-700">{status}</p>
                    <p className="text-[.7rem] text-frill-500 mt-1">
                      {status === 'active' && 'Customer can place orders'}
                      {status === 'inactive' && 'Temporarily paused'}
                      {status === 'banned' && 'Access blocked'}
                    </p>
                  </div>
                  <span className={`h-3 w-3 rounded-full ${status === 'active' ? 'bg-green-400' : status === 'inactive' ? 'bg-gray-400' : 'bg-red-400'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-brand-border">
            <button className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white rounded-frill px-4 py-2.5 font-head text-xs font-bold uppercase tracking-wide hover:bg-blue-600 transition-colors">
              <Mail size={14} /> Send Email
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-purple text-white rounded-frill px-4 py-2.5 font-head text-xs font-bold uppercase tracking-wide hover:bg-magenta transition-colors">
              <MessageSquare size={14} /> Contact
            </button>
            <button onClick={onClose} className="px-6 py-2.5 bg-frill-200 text-frill-700 rounded-frill font-head text-xs font-bold uppercase tracking-wide hover:bg-frill-300 transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Admin Customers Page
 * Manage customer accounts, view order history, send communications
 */
export default function AdminCustomersPage() {
  const { toast } = useToast()
  const [customers, setCustomers] = useState(() => {
    if (typeof window === 'undefined') return CUSTOMERS_MOCK

    try {
      const saved = window.localStorage.getItem(CUSTOMER_STORAGE_KEY)
      return saved ? JSON.parse(saved) : CUSTOMERS_MOCK
    } catch {
      return CUSTOMERS_MOCK
    }
  })
  const [selectedCustomerId, setSelectedCustomerId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customers))
  }, [customers])

  const selectedCustomer = selectedCustomerId
    ? customers.find(customer => customer.id === selectedCustomerId) ?? null
    : null

  const filteredCustomers = useMemo(() => {
    let result = customers
    
    if (filterStatus !== 'all') {
      result = result.filter(c => c.status === filterStatus)
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(c => 
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.city.toLowerCase().includes(term)
      )
    }
    
    return result.sort((a, b) => new Date(b.lastOrder) - new Date(a.lastOrder))
  }, [customers, searchTerm, filterStatus])

  function handleStatusChange(customerId, newStatus) {
    setCustomers(prev =>
      prev.map(c => (c.id === customerId ? { ...c, status: newStatus } : c))
    )
    toast.success(`Customer marked as ${newStatus}`)
  }

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    inactive: customers.filter(c => c.status === 'inactive').length,
    banned: customers.filter(c => c.status === 'banned').length,
    revenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-7">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-head text-2xl font-black text-purple">Customers</h1>
        <p className="font-head text-xs uppercase tracking-wide text-frill-500">
          {filteredCustomers.length} customers
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'bg-blue-50 border-blue-200 text-blue-700' },
          { label: 'Active', value: stats.active, color: 'bg-green-50 border-green-200 text-green-700' },
          { label: 'Inactive', value: stats.inactive, color: 'bg-gray-50 border-gray-200 text-gray-700' },
          { label: 'Banned', value: stats.banned, color: 'bg-red-50 border-red-200 text-red-700' },
          { label: 'Revenue', value: formatPKR(stats.revenue, true), color: 'bg-purple/5 border-purple/20 text-purple' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`border rounded-frill p-4 ${color}`}>
            <p className="font-head text-[.7rem] font-bold uppercase tracking-wider opacity-70 mb-1">{label}</p>
            <p className="font-head font-black text-lg">{value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-frill-400" />
          <input
            type="text"
            placeholder="Search by name, email, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-brand-border rounded-frill text-sm focus:outline-none focus:border-purple"
          />
        </div>

        <div className="flex gap-2 border-b border-brand-border pb-4">
          {['all', 'active', 'inactive', 'banned'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`font-head text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full border transition-colors ${
                filterStatus === status
                  ? 'bg-purple text-white border-purple'
                  : 'border-brand-border text-frill-600 hover:border-purple'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12 bg-frill-50 rounded-frill border border-dashed border-brand-border">
          <p className="text-frill-600 font-head text-sm">No customers found</p>
        </div>
      ) : (
        <div className="bg-white border border-brand-border rounded-frill overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-frill-500 border-b border-brand-border bg-frill-50">
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Orders</th>
                  <th className="px-4 py-3">Total Spent</th>
                  <th className="px-4 py-3">Member Since</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer, idx) => {
                  const config = STATUS_COLORS[customer.status]
                  return (
                    <tr key={customer.id} className={cn('border-b border-brand-border/80', idx % 2 === 0 ? 'bg-white' : 'bg-frill-50/30')}>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-frill-900">{customer.name}</div>
                        <div className="text-xs text-frill-500">{customer.city}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs space-y-0.5">
                          <a href={`mailto:${customer.email}`} className="block text-purple hover:text-magenta">
                            {customer.email}
                          </a>
                          <a href={`tel:${customer.phone}`} className="block text-frill-600">
                            {customer.phone}
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold">{customer.orders}</td>
                      <td className="px-4 py-3 font-semibold">{formatPKR(customer.totalSpent)}</td>
                      <td className="px-4 py-3 text-frill-600">{customer.joinedDate}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[.7rem] font-bold uppercase tracking-wide ${config.badge}`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedCustomerId(customer.id)}
                          className="font-head text-[11px] font-bold uppercase tracking-wide border border-brand-border px-2.5 py-1.5 rounded-full text-purple hover:border-purple hover:bg-purple/5 transition-colors"
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Modal */}
      <CustomerModal
        customer={selectedCustomer}
        onClose={() => setSelectedCustomerId(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
