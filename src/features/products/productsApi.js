import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { PRODUCTS_MOCK } from '@/data/products.mock'
import { applyProductImageCrop, applyProductImageCropList } from '@/utils/images'

/**
 * RTK Query API slice for products.
 * Currently returns mock data — swap baseQuery for a real
 * API URL and remove the queryFn overrides when backend is live.
 */
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({

    getProducts: builder.query({
      // queryFn: use mock during dev; comment out & use query() for production
      queryFn(params) {
        let data = [...PRODUCTS_MOCK]
        if (params?.category && params.category !== 'all')
          data = data.filter(p => p.category === params.category)
        if (params?.search)
          data = data.filter(p => p.name.toLowerCase().includes(params.search.toLowerCase()))
        if (params?.sort === 'price-asc')  data.sort((a, b) => a.price - b.price)
        if (params?.sort === 'price-desc') data.sort((a, b) => b.price - a.price)
        if (params?.sort === 'rating')     data.sort((a, b) => b.stars - a.stars)
        return { data }
      },
      providesTags: ['Product'],
    }),

    getProductBySlug: builder.query({
      queryFn({ slug }) {
        const product = PRODUCTS_MOCK.find(p => p.slug === slug)
        if (!product) return { error: { status: 404, data: 'Not found' } }
        return { data: product }
      },
      providesTags: (_, __, { slug }) => [{ type: 'Product', id: slug }],
    }),

    createProduct: builder.mutation({
      queryFn(newProduct) {
        // Mock: assign a new ID and add to local array
        const imgs = applyProductImageCropList(newProduct.imgs || [])
        const img = applyProductImageCrop(newProduct.img || imgs[0] || '')
        const created = {
          ...newProduct,
          id: Date.now(),
          slug: newProduct.name.toLowerCase().replace(/\s+/g, '-'),
          img,
          imgs: img ? [img, ...imgs.filter((image) => image !== img)] : imgs,
        }
        PRODUCTS_MOCK.push(created)
        return { data: created }
      },
      invalidatesTags: ['Product'],  // auto-refetch getProducts after mutation
    }),

    updateProduct: builder.mutation({
      queryFn({ id, ...patch }) {
        const idx = PRODUCTS_MOCK.findIndex(p => p.id === id)
        if (idx === -1) return { error: { status: 404 } }
        const current = PRODUCTS_MOCK[idx]
        const imgs = applyProductImageCropList(patch.imgs || current.imgs || [])
        const img = applyProductImageCrop(patch.img || imgs[0] || current.img || '')
        const updated = {
          ...current,
          ...patch,
          img,
          imgs: img ? [img, ...imgs.filter((image) => image !== img)] : imgs,
          slug: patch.name ? patch.name.toLowerCase().replace(/\s+/g, '-') : current.slug,
        }

        PRODUCTS_MOCK[idx] = updated
        return { data: updated }
      },
      invalidatesTags: (result, error, { id }) => {
        const tags = ['Product', { type: 'Product', id }]

        if (result?.slug) {
          tags.push({ type: 'Product', id: result.slug })
        }

        return tags
      },
    }),

    deleteProduct: builder.mutation({
      queryFn(id) {
        const idx = PRODUCTS_MOCK.findIndex(p => p.id === id)
        if (idx !== -1) PRODUCTS_MOCK.splice(idx, 1)
        return { data: { success: true } }
      },
      invalidatesTags: ['Product'],
    }),

  }),
})

export const { useGetProductsQuery, useGetProductBySlugQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } = productsApi