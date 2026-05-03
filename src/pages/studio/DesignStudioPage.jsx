import { useLocation, useNavigate, useParams } from 'react-router-dom'
import StudioShell from '@/features/studio/components/StudioShell'
import { useGetProductByIdQuery, useGetProductsQuery } from '@/features/products/productsApi'

export default function DesignStudioPage() {
  const { productId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const isNewSession = productId === 'new'
  const { data: products = [] } = useGetProductsQuery({}, { skip: !isNewSession })
  const { data: productById, isLoading } = useGetProductByIdQuery(
    { id: productId },
    { skip: isNewSession || !productId }
  )

  const product = isNewSession ? products[0] : productById
  const initialColorId = location.state?.selectedColorId
  const initialViewId = location.state?.selectedViewId

  if (!isNewSession && isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-purple/20 border-t-purple rounded-full animate-spin" />
        <p className="font-head text-sm font-bold text-purple uppercase tracking-widest">Loading Studio...</p>
      </div>
    )
  }

  return (
    <StudioShell
      product={product}
      initialColorId={initialColorId}
      initialViewId={initialViewId}
      backLink="/collections"
      onBack={() => navigate(-1)}
    />
  )
}
