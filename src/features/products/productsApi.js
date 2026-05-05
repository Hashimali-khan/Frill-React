import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { PRODUCTS_MOCK } from '@/data/products.mock'
import { applyProductImageCrop } from '@/utils/images'

const STORAGE_KEY = 'frill_products_v3'

function normalizeViews(views) {
  return (Array.isArray(views) ? views : []).map((view) => ({
    ...view,
    imageUrl: applyProductImageCrop(view.imageUrl),
  }))
}

function normalizeColors(colors) {
  return (Array.isArray(colors) ? colors : []).map((color) => ({
    ...color,
    views: normalizeViews(color.views),
  }))
}

function normalizeProduct(product) {
  return {
    ...product,
    colors: normalizeColors(product.colors),
  }
}

function loadProducts() {
  if (typeof window === 'undefined') return PRODUCTS_MOCK

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length) return parsed.map(normalizeProduct)
    }
  } catch {
    // Ignore storage parse errors.
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(PRODUCTS_MOCK))
  return PRODUCTS_MOCK.map(normalizeProduct)
}

function saveProducts(products) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

function slugify(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      queryFn(params) {
        let data = loadProducts()
        if (params?.category && params.category !== 'all') {
          data = data.filter((product) => product.category === params.category)
        }
        if (params?.search) {
          const term = params.search.toLowerCase()
          data = data.filter((product) => product.name.toLowerCase().includes(term))
        }
        if (params?.sort === 'price-asc') data.sort((a, b) => a.price - b.price)
        if (params?.sort === 'price-desc') data.sort((a, b) => b.price - a.price)
        if (params?.sort === 'rating') data.sort((a, b) => b.stars - a.stars)
        return { data }
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Product', id: 'LIST' },
              ...result.map((p) => ({ type: 'Product', id: p.id })),
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    getProductBySlug: builder.query({
      queryFn({ slug }) {
        const products = loadProducts()
        const product = products.find((item) => item.slug === slug)
        if (!product) return { error: { status: 404, data: 'Not found' } }
        return { data: product }
      },
      providesTags: (_, __, { slug }) => [{ type: 'Product', id: slug }],
    }),

    getProductById: builder.query({
      queryFn({ id }) {
        const products = loadProducts()
        const numericId = Number(id)
        const product = products.find((item) => item.id === numericId)
        if (!product) return { error: { status: 404, data: 'Not found' } }
        return { data: product }
      },
      providesTags: (_, __, { id }) => [{ type: 'Product', id }],
    }),

    createProduct: builder.mutation({
      queryFn(newProduct) {
        const products = loadProducts()
        const created = normalizeProduct({
          ...newProduct,
          id: Date.now(),
          slug: slugify(newProduct.name),
        })

        products.push(created)
        saveProducts(products)
        return { data: created }
      },
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    updateProduct: builder.mutation({
      queryFn({ id, ...patch }) {
        const products = loadProducts()
        const numericId = Number(id)
        const index = products.findIndex((item) => item.id === numericId)
        if (index === -1) return { error: { status: 404 } }

        const current = products[index]
        const updated = normalizeProduct({
          ...current,
          ...patch,
          id: current.id,
          slug: patch.name ? slugify(patch.name) : current.slug,
        })

        products[index] = updated
        saveProducts(products)
        return { data: updated }
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Product', id: 'LIST' }, { type: 'Product', id }],
    }),

    deleteProduct: builder.mutation({
      queryFn(id) {
        const products = loadProducts()
        const numericId = Number(id)
        const next = products.filter((item) => item.id !== numericId)
        saveProducts(next)
        return { data: { success: true } }
      },
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi
