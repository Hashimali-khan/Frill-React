import { useSearchParams } from 'react-router-dom'
import { useGetProductsQuery } from '@/features/products/productsApi'
import FilterBar   from '@/components/organisms/FilterBar'
import ProductCard from '@/components/organisms/ProductCard'
import Spinner     from '@/components/atoms/Spinner'

export default function CollectionPage() {
  const [params] = useSearchParams()
  // RTK Query auto-refetches when params change
  const { data, isLoading, isError } = useGetProductsQuery({
    category: params.get('category'),
    sort:     params.get('sort'),
    search:   params.get('q'),
  })

  return (
    <div>
      {/* Hero strip */}
      <div className="bg-purple py-10 px-4">
        <div className="section-inner">
          <p className="font-head text-[.7rem] text-white/40 tracking-widest uppercase mb-1">
            Home › All Products
          </p>
          <h1 className="font-head text-3xl font-black text-white">All Products</h1>
          <p className="text-white/55 text-sm mt-1">Every piece is fully customisable.</p>
        </div>
      </div>

      <FilterBar totalCount={data?.length ?? 0} />

      <div className="section-inner py-10">
        {isLoading && <Spinner className="mx-auto my-20" />}
        {isError  && <p className="text-center text-red-500 my-20">Failed to load products.</p>}
        {data && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {data.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}