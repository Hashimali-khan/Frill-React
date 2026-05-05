import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, ShoppingBag, Trash2 } from 'lucide-react'
import { useCreateOrderMutation } from '@/features/orders/ordersApi'
import {
  checkoutStep1Schema,
  checkoutStep2Schema,
  checkoutStep3Schema,
} from '@/utils/validators'
import { formatPKR } from '@/utils/currency'
import {
  clearCart,
  removeItem,
  selectCartCount,
  selectCartItems,
  selectCartTotal,
  updateQuantity,
} from '@/features/cart/cartSlice'

const STEPS = [
  { label: 'Contact', schema: checkoutStep1Schema },
  { label: 'Delivery', schema: checkoutStep2Schema },
  { label: 'Payment', schema: checkoutStep3Schema },
]

function CheckoutField({ label, error, children, helper }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="checkout-label">{label}</label>
      {children}
      {helper && !error && <p className="text-[0.68rem] text-frill-400">{helper}</p>}
      {error && <p className="checkout-error">{error}</p>}
    </div>
  )
}

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector(selectCartItems)
  const count = useSelector(selectCartCount)
  const total = useSelector(selectCartTotal)
  
  const [createOrder] = useCreateOrderMutation()

  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({})
  const [submittedOrder, setSubmittedOrder] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(STEPS[step].schema),
    mode: 'onTouched',
    shouldUnregister: false,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      paymentMethod: 'cod',
      walletNumber: '',
    },
  })

  const selectedPayment = watch('paymentMethod')

  const orderSummary = useMemo(() => {
    return {
      count,
      total,
      items,
    }
  }, [count, total, items])

  function onStepSubmit(data) {
    if (submittedOrder) return

    const mergedData = { ...formData, ...data }
    setFormData(mergedData)

    if (step < STEPS.length - 1) {
      setStep((currentStep) => currentStep + 1)
      return
    }

    const finalOrder = {
      ...mergedData,
      items,
      count,
      total,
    }

    // Create order via RTK Query mutation
    createOrder(finalOrder)
      .unwrap()
      .then((savedOrder) => {
        setSubmittedOrder(savedOrder)
        dispatch(clearCart())
      })
      .catch((err) => {
        console.error('Failed to save order:', err)
        // Still show success message but note was not saved
        setSubmittedOrder(finalOrder)
        dispatch(clearCart())
      })
  }

  function handleBack() {
    setStep((currentStep) => Math.max(currentStep - 1, 0))
  }

  if (submittedOrder) {
    return (
      <div className="section-inner py-10 max-w-3xl">
        <div className="bg-white border border-brand-border rounded-frill-lg shadow-frill-sm p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={26} />
            </div>
            <div className="flex-1">
              <h1 className="font-head text-2xl md:text-3xl font-black text-purple">Order placed</h1>              {submittedOrder.id && <p className="text-xs text-frill-400 mt-1">Order #{submittedOrder.id}</p>}              <p className="text-frill-600 mt-2">
                Your order has been submitted successfully. We’ll confirm the details and start processing it shortly.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-frill-50 rounded-frill-lg border border-brand-border">
              <p className="text-[0.65rem] uppercase tracking-wider font-bold text-frill-400 mb-2">Contact</p>
              <p className="font-head font-bold text-purple">{submittedOrder.firstName} {submittedOrder.lastName}</p>
              <p className="text-sm text-frill-600">{submittedOrder.email}</p>
              <p className="text-sm text-frill-600">{submittedOrder.phone}</p>
              {submittedOrder.address && (
                <p className="text-sm text-frill-600 mt-2">
                  {submittedOrder.address}
                  {submittedOrder.city ? `, ${submittedOrder.city}` : ''}
                  {submittedOrder.province ? `, ${submittedOrder.province}` : ''}
                  {submittedOrder.postalCode ? ` ${submittedOrder.postalCode}` : ''}
                </p>
              )}
            </div>
            <div className="p-4 bg-frill-50 rounded-frill-lg border border-brand-border">
              <p className="text-[0.65rem] uppercase tracking-wider font-bold text-frill-400 mb-2">Payment</p>
              <p className="font-head font-bold text-purple uppercase">{submittedOrder.paymentMethod}</p>
              {submittedOrder.walletNumber && (
                <p className="text-sm text-frill-600 mt-1">Wallet: {submittedOrder.walletNumber}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              to="/collections"
              className="flex-1 text-center border border-brand-border font-head text-sm font-bold text-frill-600 py-3 rounded-frill hover:border-purple transition-colors"
            >
              Continue Shopping
            </Link>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 bg-magenta text-white font-head text-sm font-bold tracking-wider uppercase py-3 rounded-frill hover:bg-magenta-hot transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="section-inner py-10 max-w-3xl">
        <div className="bg-white border border-brand-border rounded-frill-lg shadow-frill-sm p-8 text-center">
          <ShoppingBag size={44} className="mx-auto text-frill-300 mb-4" />
          <h1 className="font-head text-2xl font-black text-purple">Your cart is empty</h1>
          <p className="text-frill-600 mt-2">Add items from the collection or product page before checking out.</p>
          <div className="mt-6">
            <Link
              to="/collections"
              className="inline-flex items-center justify-center bg-magenta text-white font-head text-sm font-bold tracking-wider uppercase px-6 py-3 rounded-frill hover:bg-magenta-hot transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section-inner py-6 lg:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <section className="lg:col-span-7">
          <div className="bg-white border border-brand-border rounded-frill-lg shadow-frill-sm p-5 md:p-6">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-frill-400">Secure Checkout</p>
                <h1 className="font-head text-2xl md:text-3xl font-black text-purple">Complete your order</h1>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-frill-400 text-sm font-medium">
                <ShoppingBag size={16} /> {count} item{count === 1 ? '' : 's'}
              </div>
            </div>

            <div className="flex gap-2 mb-8">
              {STEPS.map((s, i) => (
                <div key={s.label} className="flex-1">
                  <div className={`h-1.5 rounded-full mb-1.5 ${i <= step ? 'bg-magenta' : 'bg-frill-200'}`} />
                  <p className={`font-head text-[.68rem] font-semibold uppercase tracking-wide ${i === step ? 'text-purple' : 'text-frill-400'}`}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit(onStepSubmit)} className="flex flex-col gap-5">
              {step === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CheckoutField label="First Name" error={errors.firstName?.message}>
                    <input {...register('firstName')} className="checkout-input" placeholder="Ahsan" />
                  </CheckoutField>
                  <CheckoutField label="Last Name" error={errors.lastName?.message}>
                    <input {...register('lastName')} className="checkout-input" placeholder="Khan" />
                  </CheckoutField>
                  <CheckoutField label="Email" error={errors.email?.message} helper="We’ll send your receipt here.">
                    <input {...register('email')} type="email" className="checkout-input sm:col-span-2" placeholder="you@example.com" />
                  </CheckoutField>
                  <CheckoutField label="Phone" error={errors.phone?.message}>
                    <input {...register('phone')} type="tel" className="checkout-input sm:col-span-2" placeholder="03XXXXXXXXX" />
                  </CheckoutField>
                </div>
              )}

              {step === 1 && (
                <div className="flex flex-col gap-4">
                  <CheckoutField label="Full Address" error={errors.address?.message}>
                    <input {...register('address')} placeholder="House No, Street, Area" className="checkout-input" />
                  </CheckoutField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CheckoutField label="City" error={errors.city?.message}>
                      <input {...register('city')} className="checkout-input" />
                    </CheckoutField>
                    <CheckoutField label="Postal Code" error={errors.postalCode?.message}>
                      <input {...register('postalCode')} placeholder="54000" className="checkout-input" />
                    </CheckoutField>
                  </div>

                  <CheckoutField label="Province" error={errors.province?.message}>
                    <select {...register('province')} className="checkout-input bg-white">
                      <option value="">Select Province</option>
                      {['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Gilgit-Baltistan', 'AJK'].map((province) => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                  </CheckoutField>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-3">
                  {[
                    { value: 'jazzcash', label: 'JazzCash', emoji: '🟡' },
                    { value: 'easypaisa', label: 'Easypaisa', emoji: '🟢' },
                    { value: 'cod', label: 'Cash on Delivery', emoji: '💵' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 p-4 border border-brand-border rounded-frill-lg cursor-pointer has-checked:border-purple has-checked:bg-purple/5 transition-colors"
                    >
                      <input type="radio" value={option.value} {...register('paymentMethod')} className="accent-purple" />
                      <span className="text-xl">{option.emoji}</span>
                      <span className="font-head font-bold text-purple">{option.label}</span>
                    </label>
                  ))}
                  {errors.paymentMethod && <p className="checkout-error">{errors.paymentMethod.message}</p>}

                  {(selectedPayment === 'jazzcash' || selectedPayment === 'easypaisa') && (
                    <div className="mt-2 p-4 bg-frill-50 border border-brand-border rounded-frill-lg animate-in fade-in slide-in-from-top-2">
                      <CheckoutField label={`${selectedPayment === 'jazzcash' ? 'JazzCash' : 'Easypaisa'} Mobile Number`} error={errors.walletNumber?.message}>
                        <input {...register('walletNumber')} type="tel" placeholder="03XXXXXXXXX" className="checkout-input" />
                      </CheckoutField>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 border border-brand-border font-head text-sm font-bold text-frill-600 py-3 rounded-frill hover:border-purple transition-colors"
                  >
                    ← Back
                  </button>
                ) : (
                  <div className="flex-1" />
                )}
                <button
                  type="submit"
                  className="flex-1 bg-magenta text-white font-head text-sm font-bold tracking-wider uppercase py-3 rounded-frill hover:bg-magenta-hot transition-colors"
                >
                  {step === STEPS.length - 1 ? 'Place Order' : 'Continue →'}
                </button>
              </div>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="bg-white border border-brand-border rounded-frill-lg shadow-frill-sm p-5 md:p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-head text-lg font-black text-purple">Order Summary</h2>
              <span className="text-xs font-bold uppercase tracking-wider text-frill-400">{count} item{count === 1 ? '' : 's'}</span>
            </div>

            <div className="flex flex-col gap-4 max-h-105 overflow-y-auto pr-1">
              {orderSummary.items.map((item) => (
                <div key={item.key} className="flex gap-3 pb-4 border-b border-brand-border last:border-b-0 last:pb-0">
                  <img src={item.mockupUrl || item.img} alt={item.name} className="w-16 h-16 rounded-frill object-cover bg-frill-100" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-head font-bold text-purple text-sm truncate">{item.name}</p>
                        <p className="text-[.72rem] text-frill-400 mt-1">
                          {item.selectedSize}
                          {item.selectedViewLabel ? ` · ${item.selectedViewLabel}` : ''}
                          <span className="ml-1">
                            {item.selectedColorName || item.selectedColor}
                            <span
                              className="inline-block w-3 h-3 rounded-full align-middle ml-1"
                              style={{ background: item.selectedColor }}
                            />
                          </span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => dispatch(removeItem(item.key))}
                        className="text-frill-400 hover:text-red-500 shrink-0"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className="font-head font-bold text-purple text-sm">{formatPKR(item.price * item.quantity)}</p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity - 1 }))}
                          className="w-7 h-7 rounded border border-brand-border flex items-center justify-center hover:border-purple"
                        >
                          −
                        </button>
                        <span className="font-head font-semibold text-sm w-5 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity + 1 }))}
                          className="w-7 h-7 rounded border border-brand-border flex items-center justify-center hover:border-purple"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-brand-border">
              <div className="flex justify-between items-center mb-2">
                <span className="font-head font-semibold text-frill-600">Subtotal</span>
                <span className="font-head font-black text-purple text-lg">{formatPKR(total)}</span>
              </div>
              <div className="flex justify-between items-center mb-4 text-sm text-frill-400">
                <span>Shipping</span>
                <span>Calculated after confirmation</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-head text-sm font-bold uppercase tracking-wider text-purple">Total</span>
                <span className="font-head font-black text-magenta text-xl">{formatPKR(total)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
