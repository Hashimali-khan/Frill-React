import { useParams, Link } from 'react-router-dom'
import { useGetOrdersQuery } from '@/features/orders/ordersApi'

export default function AdminOrderDetails() {
  const { orderId } = useParams()
  const { data: orders = [], isLoading } = useGetOrdersQuery()

  const order = orders.find((o) => String(o.id) === String(orderId))

  if (isLoading) return <p className="p-6">Loading order...</p>
  if (!order) return (
    <div className="p-6">
      <p className="mb-4">Order not found.</p>
      <Link to="/admin/orders" className="text-magenta">Back to orders</Link>
    </div>
  )

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="font-head text-xl font-bold text-purple mb-4">Order {order.id}</h1>
      <div className="bg-white border border-brand-border rounded-frill p-4 mb-4">
        <p><strong>Customer:</strong> {order.customerName || order.customerId || '—'}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Placed:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Total:</strong> {order.total || '—'}</p>
      </div>

      <section className="bg-white border border-brand-border rounded-frill p-4">
        <h2 className="font-bold mb-3">Items</h2>
        {order.items?.length ? (
          <ul className="space-y-3">
            {order.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <div className="w-20 h-20 bg-frill-100 rounded-frill overflow-hidden">
                  {item.mockupUrl ? <img src={item.mockupUrl} alt="mock" className="w-full h-full object-cover" /> : null}
                </div>
                <div>
                  <div className="font-semibold">{item.product?.name || item.productName || 'Product'}</div>
                  <div className="text-xs text-frill-500">Size: {item.selectedSize || '—'}</div>
                  {item.designJson ? <div className="text-xs text-frill-500 mt-1">Custom design attached</div> : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No items found for this order.</p>
        )}
      </section>
    </div>
  )
}
