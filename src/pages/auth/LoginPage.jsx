import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { login } from '@/features/auth/authSlice'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [name, setName] = useState('Admin User')
  const [role, setRole] = useState('admin')

  const nextPath = location.state?.from?.pathname || (role === 'admin' ? '/admin' : '/')

  function handleSubmit(event) {
    event.preventDefault()
    dispatch(login({ id: Date.now(), name: name.trim() || 'User', role }))
    navigate(nextPath, { replace: true })
  }

  return (
    <div className="min-h-screen grid place-items-center bg-frill-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border border-brand-border rounded-frill-lg p-6 shadow-sm space-y-4"
      >
        <h1 className="font-head text-2xl font-black text-purple">Sign In</h1>
        <p className="text-sm text-frill-600">Use admin role to access admin routes.</p>

        <label className="block space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-frill-600">Name</span>
          <input
            className="w-full border border-brand-border rounded-frill px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-frill-600">Role</span>
          <select
            className="w-full border border-brand-border rounded-frill px-3 py-2 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
        </label>

        <button
          type="submit"
          className="w-full bg-purple text-white rounded-frill px-4 py-2 font-head text-xs font-bold uppercase tracking-wide"
        >
          Continue
        </button>
      </form>
    </div>
  )
}
