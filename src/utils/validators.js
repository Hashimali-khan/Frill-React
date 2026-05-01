import { z } from 'zod'

/** Pakistani phone number: 03XX-XXXXXXX or +923XXXXXXXXX */
const pkPhone = z.string()
  .regex(
    /^(\+92|0)3[0-9]{9}$/,
    'Enter a valid Pakistani phone number (03XXXXXXXXX)'
  )

/** Pakistani postal code: 5 digits */
const pkPostalCode = z.string()
  .regex(/^[0-9]{5}$/, 'Enter a valid 5-digit postal code')

export const checkoutStep1Schema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName:  z.string().min(2, 'Last name required'),
  email:     z.string().email('Enter a valid email address'),
  phone:     pkPhone,
})

export const checkoutStep2Schema = z.object({
  address:    z.string().min(10, 'Enter your full address'),
  city:       z.string().min(2, 'City required'),
  province:   z.enum(['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Gilgit-Baltistan', 'AJK']),
  postalCode: pkPostalCode,
})

export const checkoutStep3Schema = z.object({
  paymentMethod: z.enum(['jazzcash', 'easypaisa', 'cod']),
  // Conditional: jazzcash/easypaisa require a wallet number
  walletNumber: z.string().optional(),
}).refine(
  data => data.paymentMethod === 'cod' || !!data.walletNumber,
  { message: 'Wallet number required for JazzCash/Easypaisa', path: ['walletNumber'] }
)


export const loginSchema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName:  z.string().min(2, 'Last name must be at least 2 characters'),
  email:     z.string().email('Enter a valid email address'),
  phone:     pkPhone,
  password:  z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})