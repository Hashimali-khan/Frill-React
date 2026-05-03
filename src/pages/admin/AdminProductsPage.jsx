import { useEffect, useMemo, useState } from 'react'
import { UploadCloud, Plus, Trash2 } from 'lucide-react'
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from '@/features/products/productsApi'
import { useToast } from '@/hooks/useToast'
import { formatPKR } from '@/utils/currency'

const VIEW_TEMPLATES = [
  { id: 'front', label: 'Front' },
  { id: 'back', label: 'Back' },
  { id: 'sleeve', label: 'Sleeve' },
]

const DEFAULT_PRINT_AREA = {
  x: 170,
  y: 180,
  width: 480,
  height: 520,
}

const EMPTY_FORM = {
  name: '',
  vendor: 'Frill Custom Apparel',
  category: 'tshirt',
  price: 0,
  oldPrice: '',
  desc: '',
  longDesc: '',
  stars: 4.5,
  reviews: 0,
  customizable: true,
  sizes: 'XS,S,M,L,XL',
  colors: [],
}

function createViewTemplate(template) {
  return {
    id: template.id,
    label: template.label,
    imageUrl: '',
    printArea: { ...DEFAULT_PRINT_AREA },
  }
}

function createColorVariant() {
  return {
    id: `color-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: '',
    hex: '#1a1a1a',
    views: VIEW_TEMPLATES.map(createViewTemplate),
  }
}

function parseSizes(input) {
  return String(input || '')
    .split(/\s*,\s*/)
    .map((value) => value.trim())
    .filter(Boolean)
}

export default function AdminProductsPage() {
  const { toast } = useToast()
  const { data: products = [], isLoading, isError } = useGetProductsQuery({})
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation()
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()

  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ ...EMPTY_FORM, colors: [createColorVariant()] })
  const [uploading, setUploading] = useState({})

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  const isBusy = isCreating || isUpdating || isDeleting

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => Number(b.id) - Number(a.id)),
    [products]
  )

  useEffect(() => {
    if (!products.length || editingId) return
    if (!form.colors.length) {
      setForm((prev) => ({ ...prev, colors: [createColorVariant()] }))
    }
  }, [products.length, editingId, form.colors.length])

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function setColorField(index, key, value) {
    setForm((prev) => {
      const colors = [...prev.colors]
      colors[index] = { ...colors[index], [key]: value }
      return { ...prev, colors }
    })
  }

  function setViewField(colorIndex, viewIndex, key, value) {
    setForm((prev) => {
      const colors = [...prev.colors]
      const views = [...colors[colorIndex].views]
      views[viewIndex] = { ...views[viewIndex], [key]: value }
      colors[colorIndex] = { ...colors[colorIndex], views }
      return { ...prev, colors }
    })
  }

  function addColorVariant() {
    setForm((prev) => ({ ...prev, colors: [...prev.colors, createColorVariant()] }))
  }

  function removeColorVariant(index) {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, idx) => idx !== index),
    }))
  }

  function resetForm() {
    setEditingId(null)
    setForm({ ...EMPTY_FORM, colors: [createColorVariant()] })
  }

  async function uploadToCloudinary(file) {
    if (!cloudName || !uploadPreset) {
      toast.error('Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.')
      return null
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) throw new Error('Upload failed')
    const data = await response.json()
    return data.secure_url
  }

  async function handleViewUpload(colorIndex, viewIndex, file) {
    if (!file) return
    const key = `${colorIndex}-${viewIndex}`
    setUploading((prev) => ({ ...prev, [key]: true }))
    try {
      const url = await uploadToCloudinary(file)
      if (url) setViewField(colorIndex, viewIndex, 'imageUrl', url)
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }))
    }
  }

  function startEdit(product) {
    setEditingId(product.id)
    setForm({
      name: product.name || '',
      vendor: product.vendor || 'Frill Custom Apparel',
      category: product.category || 'tshirt',
      price: product.price || 0,
      oldPrice: product.oldPrice ?? '',
      desc: product.desc || '',
      longDesc: product.longDesc || '',
      stars: product.stars || 4.5,
      reviews: product.reviews || 0,
      customizable: Boolean(product.customizable),
      sizes: product.sizes?.join(',') || '',
      colors: product.colors?.length
        ? product.colors.map((color) => ({
            ...color,
            views: (color.views || VIEW_TEMPLATES).map((view, index) => ({
              id: view.id || VIEW_TEMPLATES[index]?.id,
              label: view.label || VIEW_TEMPLATES[index]?.label,
              imageUrl: view.imageUrl || '',
              printArea: view.printArea || { ...DEFAULT_PRINT_AREA },
            })),
          }))
        : [createColorVariant()],
    })
  }

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

    if (!form.colors.length) {
      toast.error('Add at least one color variant')
      return
    }

    const missingView = form.colors.some((color) =>
      color.views.some((view) => !view.imageUrl)
    )

    if (missingView) {
      toast.error('Each color must include images for Front, Back, and Sleeve views')
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
      sizes: parseSizes(form.sizes),
      colors: form.colors.map((color) => ({
        ...color,
        name: color.name.trim(),
        views: color.views.map((view) => ({
          ...view,
          imageUrl: view.imageUrl.trim(),
          printArea: {
            x: Number(view.printArea.x),
            y: Number(view.printArea.y),
            width: Number(view.printArea.width),
            height: Number(view.printArea.height),
          },
        })),
      })),
    }

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
        <h1 className="font-head text-2xl font-black text-purple">Product Builder</h1>
        <p className="font-head text-xs uppercase tracking-wide text-frill-500">
          {sortedProducts.length} products
        </p>
      </div>

      <section className="bg-white border border-brand-border rounded-frill-lg p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
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

        {!cloudName || !uploadPreset ? (
          <div className="bg-amber-50 border border-amber-200 rounded-frill px-4 py-3 text-xs text-amber-800">
            Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to enable uploads.
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
            value={form.sizes}
            onChange={(e) => setField('sizes', e.target.value)}
            placeholder="Sizes (comma separated)"
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
            className="lg:col-span-2 border border-brand-border rounded-frill px-3 py-2 text-sm min-h-20"
            value={form.desc}
            onChange={(e) => setField('desc', e.target.value)}
            placeholder="Short description"
          />
          <textarea
            className="lg:col-span-2 border border-brand-border rounded-frill px-3 py-2 text-sm min-h-24"
            value={form.longDesc}
            onChange={(e) => setField('longDesc', e.target.value)}
            placeholder="Long description"
          />
          <label className="lg:col-span-2 inline-flex items-center gap-2 text-sm text-frill-700">
            <input
              type="checkbox"
              checked={form.customizable}
              onChange={(e) => setField('customizable', e.target.checked)}
            />
            Customizable product
          </label>

          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-head text-sm font-bold text-purple">Color Variants</h3>
              <button
                type="button"
                onClick={addColorVariant}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-magenta"
              >
                <Plus size={14} /> Add Color Variant
              </button>
            </div>

            <div className="space-y-6">
              {form.colors.map((color, colorIndex) => (
                <div key={color.id} className="border border-brand-border rounded-frill p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={color.name}
                        onChange={(event) => setColorField(colorIndex, 'name', event.target.value)}
                        placeholder="Color name"
                        className="border border-brand-border rounded-frill px-3 py-2 text-sm"
                      />
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(event) => setColorField(colorIndex, 'hex', event.target.value)}
                        className="w-12 h-10 border border-brand-border rounded-frill"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeColorVariant(colorIndex)}
                      className="text-xs font-bold uppercase tracking-widest text-red-500"
                    >
                      <Trash2 size={14} className="inline-block mr-1" /> Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {color.views.map((view, viewIndex) => {
                      const uploadKey = `${colorIndex}-${viewIndex}`
                      return (
                        <div key={view.id} className="space-y-3">
                          <p className="text-xs font-bold uppercase tracking-widest text-frill-500">
                            {view.label} View
                          </p>
                          <div className="aspect-3/4 rounded-frill bg-frill-100 border border-brand-border overflow-hidden">
                            {view.imageUrl ? (
                              <img src={view.imageUrl} alt={view.label} className="w-full h-full object-cover" />
                            ) : (
                              <div className="h-full flex items-center justify-center text-xs text-frill-400">No image</div>
                            )}
                          </div>
                          <input
                            type="text"
                            value={view.imageUrl}
                            onChange={(event) => setViewField(colorIndex, viewIndex, 'imageUrl', event.target.value)}
                            placeholder="Image URL"
                            className="w-full border border-brand-border rounded-frill px-3 py-2 text-xs"
                          />
                          <label className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-purple cursor-pointer">
                            <input
                              type="file"
                              className="hidden"
                              accept="image/png,image/jpeg,image/webp"
                              onChange={(event) => handleViewUpload(colorIndex, viewIndex, event.target.files?.[0])}
                            />
                            <UploadCloud size={14} />
                            {uploading[uploadKey] ? 'Uploading...' : 'Upload'}
                          </label>

                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="number"
                              value={view.printArea.x}
                              onChange={(event) =>
                                setViewField(colorIndex, viewIndex, 'printArea', {
                                  ...view.printArea,
                                  x: Number(event.target.value),
                                })
                              }
                              placeholder="X"
                              className="border border-brand-border rounded-frill px-2 py-1 text-xs"
                            />
                            <input
                              type="number"
                              value={view.printArea.y}
                              onChange={(event) =>
                                setViewField(colorIndex, viewIndex, 'printArea', {
                                  ...view.printArea,
                                  y: Number(event.target.value),
                                })
                              }
                              placeholder="Y"
                              className="border border-brand-border rounded-frill px-2 py-1 text-xs"
                            />
                            <input
                              type="number"
                              value={view.printArea.width}
                              onChange={(event) =>
                                setViewField(colorIndex, viewIndex, 'printArea', {
                                  ...view.printArea,
                                  width: Number(event.target.value),
                                })
                              }
                              placeholder="Width"
                              className="border border-brand-border rounded-frill px-2 py-1 text-xs"
                            />
                            <input
                              type="number"
                              value={view.printArea.height}
                              onChange={(event) =>
                                setViewField(colorIndex, viewIndex, 'printArea', {
                                  ...view.printArea,
                                  height: Number(event.target.value),
                                })
                              }
                              placeholder="Height"
                              className="border border-brand-border rounded-frill px-2 py-1 text-xs"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className="lg:col-span-2 bg-purple text-white rounded-frill px-4 py-2 font-head font-bold uppercase tracking-wide text-xs disabled:opacity-60"
          >
            {isBusy ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      </section>

      <section className="bg-white border border-brand-border rounded-frill-lg overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-brand-border">
          <h2 className="font-head text-lg font-bold text-purple">Current Products</h2>
        </div>

        {isLoading ? <p className="p-5 text-sm text-frill-600">Loading products...</p> : null}
        {isError ? <p className="p-5 text-sm text-red-600">Could not load products.</p> : null}

        {!isLoading && !isError ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-frill-500 border-b border-brand-border">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Colors</th>
                  <th className="px-4 py-3">Views</th>
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
                    <td className="px-4 py-3 text-frill-600">{product.colors?.length || 0}</td>
                    <td className="px-4 py-3 text-frill-600">{product.colors?.[0]?.views?.length || 0}</td>
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
