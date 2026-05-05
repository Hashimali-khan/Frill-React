import { useState, useMemo, useEffect } from 'react'
import { Eye, Download, CheckCircle, XCircle, Clock, Mail } from 'lucide-react'
import { formatPKR } from '@/utils/currency'
import { PRODUCTS_MOCK } from '@/data/products.mock'
import { useGetDesignsQuery, useApproveDesignMutation, useRejectDesignMutation } from '@/features/designs/designsApi'
import { useToast } from '@/hooks/useToast'

const STATUS_COLORS = {
  pending: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: Clock },
  approved: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: CheckCircle },
  rejected: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: XCircle },
}

/**
 * Design Preview Modal
 * Shows full-size canvas preview with actions
 */
function DesignPreviewModal({ design, onClose, onApprove, onReject }) {
  if (!design) return null

  const product = PRODUCTS_MOCK.find(p => p.id === design.productId)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-frill-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-purple to-magenta text-white p-6 flex items-center justify-between border-b border-purple/20">
          <div>
            <h2 className="font-head text-xl font-black">{design.title}</h2>
            <p className="text-sm text-white/70">{design.customerName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-white/70 transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Canvas Preview */}
          <div className="bg-frill-50 rounded-frill border border-brand-border p-4">
            <h3 className="font-head text-xs font-bold uppercase tracking-wide text-frill-600 mb-3">Design Preview</h3>
            <img
              src={design.previewUrl}
              alt={design.title}
              className="w-full h-auto rounded-frill border border-brand-border shadow-sm"
            />
          </div>

          {/* Design Details */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-frill-50 rounded-frill">
            <div>
              <p className="text-[.7rem] uppercase font-bold tracking-wider text-frill-600 mb-1">Product</p>
              <p className="font-semibold text-frill-900">{design.product}</p>
            </div>
            <div>
              <p className="text-[.7rem] uppercase font-bold tracking-wider text-frill-600 mb-1">Status</p>
              <div className="flex items-center gap-2">
                {(() => {
                  const config = STATUS_COLORS[design.status]
                  const Icon = config.icon
                  return (
                    <>
                      <Icon size={16} className={config.text} />
                      <span className={`font-semibold capitalize ${config.text}`}>{design.status}</span>
                    </>
                  )
                })()}
              </div>
            </div>
            <div>
              <p className="text-[.7rem] uppercase font-bold tracking-wider text-frill-600 mb-1">Created</p>
              <p className="font-semibold text-frill-900">{design.createdAt}</p>
            </div>
            <div>
              <p className="text-[.7rem] uppercase font-bold tracking-wider text-frill-600 mb-1">Updated</p>
              <p className="font-semibold text-frill-900">{design.updatedAt}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-head text-xs font-bold uppercase tracking-wide text-frill-600 mb-2">Description</h4>
            <p className="text-sm text-frill-700">{design.description}</p>
          </div>

          {/* Customer Info */}
          <div className="border-l-4 border-purple pl-4 py-2">
            <p className="text-[.7rem] uppercase font-bold tracking-wider text-frill-600 mb-2">Customer</p>
            <p className="font-semibold text-frill-900 mb-1">{design.customerName}</p>
            <a
              href={`mailto:${design.customerEmail}`}
              className="text-sm text-purple hover:text-magenta transition-colors flex items-center gap-1"
            >
              <Mail size={14} /> {design.customerEmail}
            </a>
          </div>

          {/* Admin Notes */}
          {design.notes && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-frill">
              <p className="text-[.7rem] uppercase font-bold tracking-wider text-yellow-700 mb-1">Admin Notes</p>
              <p className="text-sm text-yellow-800">{design.notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-brand-border">
            <button
              onClick={async () => {
  try {
    const response = await fetch(design.printUrl)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${design.title}-print.png`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (err) {
    console.error('Download failed:', err)
  }
}}
              className="flex-1 flex items-center justify-center gap-2 bg-frill-100 text-frill-700 rounded-frill px-4 py-2.5 font-head text-xs font-bold uppercase tracking-wide hover:bg-frill-200 transition-colors"
            >
              <Download size={14} /> Download Print
            </button>
            {design.status === 'pending' && (
              <>
                <button
                  onClick={() => onApprove(design.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white rounded-frill px-4 py-2.5 font-head text-xs font-bold uppercase tracking-wide hover:bg-green-600 transition-colors"
                >
                  <CheckCircle size={14} /> Approve
                </button>
                <button
                  onClick={() => onReject(design.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white rounded-frill px-4 py-2.5 font-head text-xs font-bold uppercase tracking-wide hover:bg-red-600 transition-colors"
                >
                  <XCircle size={14} /> Reject
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-frill-200 text-frill-700 rounded-frill font-head text-xs font-bold uppercase tracking-wide hover:bg-frill-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Admin Designs Page
 * Gallery of customer design submissions with filtering and admin controls
 */
export default function AdminDesignsPage() {
  const { toast } = useToast()
  const [selectedDesign, setSelectedDesign] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  
  // Fetch designs in real-time with RTK Query
  const { data: designs = [], isLoading, refetch } = useGetDesignsQuery({ status: filterStatus })
  
  // Refetch designs when component mounts or filter changes to ensure fresh data from new orders
  useEffect(() => {
    refetch()
  }, [filterStatus, refetch])
  
  // API mutations for approve/reject
  const [approveDesign] = useApproveDesignMutation()
  const [rejectDesign] = useRejectDesignMutation()

  const filteredDesigns = useMemo(
    () => designs,
    [designs]
  )

  async function handleApprove(designId) {
    try {
      await approveDesign({ id: designId }).unwrap()
      toast.success('Design approved!')
      setSelectedDesign(null)
    } catch (err) {
      console.error('Approve failed:', err)
      toast.error('Failed to approve design')
    }
  }

  async function handleReject(designId) {
    try {
      await rejectDesign({ id: designId }).unwrap()
      toast.success('Design rejected!')
      setSelectedDesign(null)
    } catch (err) {
      console.error('Reject failed:', err)
      toast.error('Failed to reject design')
    }
  }

  const stats = {
    total: designs.length,
    pending: designs.filter(d => d.status === 'pending').length,
    approved: designs.filter(d => d.status === 'approved').length,
    rejected: designs.filter(d => d.status === 'rejected').length,
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-7">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-head text-2xl font-black text-purple">Design Submissions</h1>
        <p className="font-head text-xs uppercase tracking-wide text-frill-500">
          {filteredDesigns.length} designs
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'bg-blue-50 border-blue-200 text-blue-700' },
          { label: 'Pending', value: stats.pending, color: 'bg-amber-50 border-amber-200 text-amber-700' },
          { label: 'Approved', value: stats.approved, color: 'bg-green-50 border-green-200 text-green-700' },
          { label: 'Rejected', value: stats.rejected, color: 'bg-red-50 border-red-200 text-red-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`border rounded-frill p-4 ${color}`}>
            <p className="font-head text-xs font-bold uppercase tracking-wider opacity-70 mb-1">{label}</p>
            <p className="font-head text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-brand-border pb-4">
        {['all', 'pending', 'approved', 'rejected'].map(status => (
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

      {/* Designs Gallery */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin">
            <div className="w-8 h-8 border-4 border-frill-200 border-t-purple rounded-full"></div>
          </div>
          <p className="text-frill-600 mt-4">Loading designs...</p>
        </div>
      ) : filteredDesigns.length === 0 ? (
        <div className="text-center py-12 bg-frill-50 rounded-frill border border-dashed border-brand-border">
          <p className="text-frill-600 font-head text-sm">No designs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDesigns.map(design => {
            const config = STATUS_COLORS[design.status]
            const StatusIcon = config.icon

            return (
              <div
                key={design.id}
                className={`border rounded-frill overflow-hidden hover:shadow-lg transition-all ${config.border} ${config.bg}`}
              >
                
                {/* Image */}
                <div className="relative overflow-hidden bg-gray-200 h-48">
                  <img
                    src={design.previewUrl}
                    alt={design.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => setSelectedDesign(design)}
                  />
                  <div className="absolute top-2 right-2">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 bg-white/90 backdrop-blur rounded-full ${config.text}`}>
                      <StatusIcon size={14} />
                      <span className="font-head text-[.65rem] font-bold uppercase">{design.status}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  
                  {/* Title & Description */}
                  <div>
                    <h3 className="font-head font-bold text-frill-900 line-clamp-1">{design.title}</h3>
                    <p className="text-xs text-frill-600 line-clamp-2">{design.description}</p>
                  </div>

                  {/* Customer & Product */}
                  <div className="space-y-1">
                    <p className="text-[.7rem] uppercase font-bold tracking-wider text-frill-500">
                      by <span className="text-frill-700">{design.customerName}</span>
                    </p>
                    <p className="text-xs font-semibold text-frill-700">{design.product}</p>
                  </div>

                  {/* Date */}
                  <p className="text-[.7rem] text-frill-500">
                    {new Date(design.createdAt).toLocaleDateString('en-PK', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>

                  {/* Action Button */}
                  <button
                    onClick={() => setSelectedDesign(design)}
                    className="w-full flex items-center justify-center gap-2 bg-purple text-white rounded-frill px-3 py-2 font-head text-xs font-bold uppercase tracking-wide hover:bg-magenta transition-colors"
                  >
                    <Eye size={14} /> Preview & Manage
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Preview Modal */}
      <DesignPreviewModal
        design={selectedDesign}
        onClose={() => setSelectedDesign(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  )
}
