import client from './client'
import { PRODUCTS_MOCK } from '@/data/products.mock'

const USE_MOCK = import.meta.env.VITE_API_URL === undefined

/**
 * Get all products with optional filters
 * @param {{ category?: string, search?: string }} params
 */
export async function getProducts(params = {}) {
  if (USE_MOCK) {
    // Simulate network latency
    await new Promise(r => setTimeout(r, 300))
    let results = [...PRODUCTS_MOCK]
    if (params.category && params.category !== 'all')
      results = results.filter(p => p.category === params.category)
    if (params.search)
      results = results.filter(p =>
        p.name.toLowerCase().includes(params.search.toLowerCase()))
    return { data: results, total: results.length }
  }
  return client.get('/products', { params })
}

export async function getProductById(id) {
  if (USE_MOCK) {
    const product = PRODUCTS_MOCK.find(p => p.id === id)
    if (!product) throw new Error(`Product ${id} not found`)
    return { data: product }
  }
  return client.get(`/products/${id}`)
}