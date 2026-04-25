import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { PRODUCTS_MOCK } from '@/data/products.mock'

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

  }),
})

export const { useGetProductsQuery, useGetProductBySlugQuery } = productsApi