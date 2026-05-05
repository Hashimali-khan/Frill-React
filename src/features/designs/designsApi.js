import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { DESIGNS_MOCK } from '@/data/designs.mock'
import { hydrateDesignsFromOrders, loadStoredDesigns } from '@/utils/designPersistence'

const STORAGE_KEY = 'frill_designs_v2'

function loadDesigns() {
  if (typeof window === 'undefined') return DESIGNS_MOCK

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        const hydrated = hydrateDesignsFromOrders(parsed)
        const parsedIds = parsed.map((design) => design.id)
        const hydratedIds = hydrated.map((design) => design.id)
        const idsChanged = parsedIds.length !== hydratedIds.length || parsedIds.some((id, index) => id !== hydratedIds[index])

        if (idsChanged) {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(hydrated))
          return hydrated
        }
        return parsed
      }
    }
  } catch {
    // Ignore storage parse errors.
  }

  const hydratedStored = hydrateDesignsFromOrders(loadStoredDesigns())
  if (hydratedStored.length > 0) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(hydratedStored))
    return hydratedStored
  }

  // Only seed DESIGNS_MOCK once on first app launch, but don't re-seed on every load
  try {
    const hasEverBeenInitialized = window.localStorage.getItem(`${STORAGE_KEY}_initialized`)
    if (!hasEverBeenInitialized) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DESIGNS_MOCK))
      window.localStorage.setItem(`${STORAGE_KEY}_initialized`, 'true')
      return DESIGNS_MOCK
    }
  } catch {}

  // If not initialized marker exists but no data, return empty array (real data will be added)
  return []
}

function saveDesigns(designs) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(designs))
}

export const designsApi = createApi({
  reducerPath: 'designsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Design'],
  endpoints: (builder) => ({
    getDesigns: builder.query({
      queryFn(params = {}) {
        let data = loadDesigns()
        
        // Filter by status if provided
        if (params.status && params.status !== 'all') {
          data = data.filter((design) => design.status === params.status)
        }
        
        // Filter by customer if provided
        if (params.customerId) {
          data = data.filter((design) => design.customerId === params.customerId)
        }
        
        // Sort by newest first
        data = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        
        return { data }
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Design', id: 'LIST' },
              ...result.map((d) => ({ type: 'Design', id: d.id })),
            ]
          : [{ type: 'Design', id: 'LIST' }],
    }),

    getDesignById: builder.query({
      queryFn({ id }) {
        const designs = loadDesigns()
        const design = designs.find((item) => item.id === Number(id))
        if (!design) return { error: { status: 404, data: 'Not found' } }
        return { data: design }
      },
      providesTags: (_, __, { id }) => [{ type: 'Design', id }],
    }),

    updateDesignStatus: builder.mutation({
      queryFn({ id, status, notes = '' }) {
        const designs = loadDesigns()
        const index = designs.findIndex((item) => item.id === Number(id))
        if (index === -1) return { error: { status: 404 } }

        const updated = {
          ...designs[index],
          status,
          notes,
          updatedAt: new Date().toISOString().split('T')[0],
        }

        designs[index] = updated
        saveDesigns(designs)
        return { data: updated }
      },
      invalidatesTags: (_, __, { id }) => [
        { type: 'Design', id: 'LIST' },
        { type: 'Design', id },
      ],
    }),

    deleteDesign: builder.mutation({
      queryFn(id) {
        const designs = loadDesigns()
        const numericId = Number(id)
        const next = designs.filter((item) => item.id !== numericId)
        saveDesigns(next)
        return { data: { success: true } }
      },
      invalidatesTags: [{ type: 'Design', id: 'LIST' }],
    }),

    approveDesign: builder.mutation({
      queryFn({ id, notes = '' }) {
        const designs = loadDesigns()
        const index = designs.findIndex((item) => item.id === Number(id))
        if (index === -1) return { error: { status: 404 } }

        const updated = {
          ...designs[index],
          status: 'approved',
          notes,
          updatedAt: new Date().toISOString().split('T')[0],
        }

        designs[index] = updated
        saveDesigns(designs)
        return { data: updated }
      },
      invalidatesTags: (_, __, { id }) => [
        { type: 'Design', id: 'LIST' },
        { type: 'Design', id },
      ],
    }),

    rejectDesign: builder.mutation({
      queryFn({ id, notes = '' }) {
        const designs = loadDesigns()
        const index = designs.findIndex((item) => item.id === Number(id))
        if (index === -1) return { error: { status: 404 } }

        const updated = {
          ...designs[index],
          status: 'rejected',
          notes,
          updatedAt: new Date().toISOString().split('T')[0],
        }

        designs[index] = updated
        saveDesigns(designs)
        return { data: updated }
      },
      invalidatesTags: (_, __, { id }) => [
        { type: 'Design', id: 'LIST' },
        { type: 'Design', id },
      ],
    }),
  }),
})

export const {
  useGetDesignsQuery,
  useGetDesignByIdQuery,
  useUpdateDesignStatusMutation,
  useDeleteDesignMutation,
  useApproveDesignMutation,
  useRejectDesignMutation,
} = designsApi
