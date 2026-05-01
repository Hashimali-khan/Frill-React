import { useEffect, useMemo, useRef, useState } from 'react'
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from '@/features/products/productsApi'
import { formatPKR } from '@/utils/currency'
import { applyProductImageCrop, applyProductImageCropList } from '@/utils/images'
import { useToast } from '@/hooks/useToast'

const EMPTY_FORM = {
  name: '',
  vendor: 'Frill Custom Apparel',
  category: 'tshirt',
  price: 0,
  oldPrice: '',
  img: '',
  gallery: '',
  desc: '',
  stars: 4.5,
  reviews: 0,
  customizable: true,
}

function normalizeGallery(value) {
  return String(value || '')
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export default function AdminProductsPage() {
  const { toast } = useToast()
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const formSectionRef = useRef(null)

  const { data: products = [], isLoading, isError } = useGetProductsQuery({})
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation()
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()

  const isBusy = isCreating || isUpdating || isDeleting

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => Number(b.id) - Number(a.id)),
    [products]
  )

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function resetForm() {
    setForm(EMPTY_FORM)
    setEditingId(null)
  }

  function startEdit(product) {
    const productImages = Array.isArray(product.imgs) && product.imgs.length > 0
      ? product.imgs
      : product.img
        ? [product.img]
        : []

    setEditingId(product.id)
    setForm({
      name: product.name ?? '',
      vendor: product.vendor ?? 'Frill Custom Apparel',
      category: product.category ?? 'tshirt',
      price: Number(product.price) || 0,
      oldPrice: product.oldPrice ?? '',
      img: productImages[0] ?? '',
      gallery: productImages.slice(1).join('\n'),
      desc: product.desc ?? '',
      stars: Number(product.stars) || 4.5,
      reviews: Number(product.reviews) || 0,
      customizable: Boolean(product.customizable),
    })
    toast.success(`Editing ${product.name}`)
  }

  useEffect(() => {
    if (!editingId || !formSectionRef.current) return

    formSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [editingId])

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.name.trim()) {
      toast.error('Product name is required')
      return
    }

    if (!Number(form.price) || Number(form.price) < 1) {
      toast.error('Price must be greater than 0')
      return
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      vendor: form.vendor.trim() || 'Frill Custom Apparel',
      price: Number(form.price),
      oldPrice: form.oldPrice === '' ? null : Number(form.oldPrice),
      stars: Number(form.stars),
      reviews: Number(form.reviews),
      customizable: Boolean(form.customizable),
    }

    const galleryImages = normalizeGallery(form.gallery)
    const mainImage = applyProductImageCrop(form.img.trim() || galleryImages[0] || '')
    const remainingGallery = form.img.trim() ? galleryImages : galleryImages.slice(1)

    payload.img = mainImage
    payload.imgs = mainImage ? [mainImage, ...applyProductImageCropList(remainingGallery)] : applyProductImageCropList(remainingGallery)

    try {
      if (editingId) {
        await updateProduct({ id: editingId, ...payload }).unwrap()
        toast.success('Product updated')
      } else {
        await createProduct(payload).unwrap()
        toast.success('Product created')
      }

      resetForm()
    } catch {
      toast.error('Could not save product')
    }
  }

  async function handleDelete(id) {
    const ok = window.confirm('Delete this product? This cannot be undone.')
    if (!ok) return

    try {
      await deleteProduct(id).unwrap()
      if (editingId === id) resetForm()
      toast.success('Product deleted')
    } catch {
      toast.error('Could not delete product')
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-7">
      <div className="flex items-center justify-between">
        <h1 className="font-head text-2xl font-black text-purple">Product Management</h1>
        <p className="font-head text-xs uppercase tracking-wide text-frill-500">
          {sortedProducts.length} products
        </p>
      </div>

      <section ref={formSectionRef} className="bg-white border border-brand-border rounded-frill-lg p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-head text-lg font-bold text-purple">
            {editingId ? 'Edit Product' : 'Create Product'}
          </h2>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="font-head text-xs font-bold uppercase tracking-wide border border-brand-border px-3 py-1.5 rounded-full text-frill-600 hover:border-purple"
            >
              Cancel Edit
            </button>
          ) : null}
        </div>

        {editingId ? (
          <div className="mb-4 rounded-frill border border-purple/20 bg-purple/5 px-4 py-3 text-sm text-purple">
            You are editing an existing product. Change the fields below and click Update Product to save.
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="border border-brand-border rounded-frill px-3 py-2 text-sm"
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="Product name"
          />

          <input
            className="border border-brand-border rounded-frill px-3 py-2 text-sm"
            value={form.vendor}
            onChange={(e) => setField('vendor', e.target.value)}
            placeholder="Vendor"
          />

          <select
            className="border border-brand-border rounded-frill px-3 py-2 text-sm"
            value={form.category}
            onChange={(e) => setField('category', e.target.value)}
          >
            <option value="tshirt">T-Shirt</option>
            <option value="hoodie">Hoodie</option>
            <option value="jacket">Jacket</option>
          </select>

          <input
            type="number"
            min="1"
            className="border border-brand-border rounded-frill px-3 py-2 text-sm"
            value={form.price}
            onChange={(e) => setField('price', e.target.value)}
            placeholder="Price"
          />

          <input
            type="number"
            min="0"
            className="border border-brand-border rounded-frill px-3 py-2 text-sm"
            value={form.oldPrice}
            onChange={(e) => setField('oldPrice', e.target.value)}
            placeholder="Old price (optional)"
          />

          <input
            className="border border-brand-border rounded-frill px-3 py-2 text-sm"
            value={form.img}
            onChange={(e) => setField('img', e.target.value)}
            placeholder="Main image URL"
          />

          <textarea
            className="md:col-span-2 border border-brand-border rounded-frill px-3 py-2 text-sm min-h-28"
            value={form.gallery}
            onChange={(e) => setField('gallery', e.target.value)}
            placeholder="Gallery image URLs - one per line or comma separated"
          />

          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            className="border border-brand-border rounded-frill px-3 py-2 text-sm"
            value={form.stars}
            onChange={(e) => setField('stars', e.target.value)}
            placeholder="Stars"
          />

          <input
            type="number"
            min="0"
            className="border border-brand-border rounded-frill px-3 py-2 text-sm"
            value={form.reviews}
            onChange={(e) => setField('reviews', e.target.value)}
            placeholder="Reviews"
          />

          <textarea
            className="md:col-span-2 border border-brand-border rounded-frill px-3 py-2 text-sm min-h-24"
            value={form.desc}
            onChange={(e) => setField('desc', e.target.value)}
            placeholder="Short description"
          />

          <label className="md:col-span-2 inline-flex items-center gap-2 text-sm text-frill-700">
            <input
              type="checkbox"
              checked={form.customizable}
              onChange={(e) => setField('customizable', e.target.checked)}
            />
            Customizable product
          </label>

          <button
            type="submit"
            disabled={isBusy}
            className="md:col-span-2 bg-purple text-white rounded-frill px-4 py-2 font-head font-bold uppercase tracking-wide text-xs disabled:opacity-60"
          >
            {isBusy ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      </section>

      <section className="bg-white border border-brand-border rounded-frill-lg overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-brand-border">
          <h2 className="font-head text-lg font-bold text-purple">Current Products</h2>
        </div>

        {isLoading ? (
          <p className="p-5 text-sm text-frill-600">Loading products...</p>
        ) : null}

        {isError ? (
          <p className="p-5 text-sm text-red-600">Could not load products.</p>
        ) : null}

        {!isLoading && !isError ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-frill-500 border-b border-brand-border">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Gallery</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((product) => (
                  <tr key={product.id} className="border-b border-brand-border/80">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-frill-900">{product.name}</div>
                      <div className="text-xs text-frill-500">{product.vendor}</div>
                    </td>
                    <td className="px-4 py-3 capitalize">{product.category}</td>
                    <td className="px-4 py-3">{formatPKR(product.price)}</td>
                    <td className="px-4 py-3 text-frill-600">
                      {product.imgs?.length ? `${product.imgs.length} image${product.imgs.length > 1 ? 's' : ''}` : '1 image'}
                    </td>
                    <td className="px-4 py-3">{product.stars} ({product.reviews})</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(product)}
                          className="font-head text-[11px] font-bold uppercase tracking-wide border border-brand-border px-2.5 py-1.5 rounded-full text-frill-700 hover:border-purple"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          disabled={isDeleting}
                          className="font-head text-[11px] font-bold uppercase tracking-wide border border-red-200 px-2.5 py-1.5 rounded-full text-red-600 hover:bg-red-50 disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  )
}
