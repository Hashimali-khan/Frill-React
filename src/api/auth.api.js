import client from './client'

/** Mock user database — replace with real API calls */
const MOCK_USERS = [
  { 
    id: 1, 
    email: 'admin@frill.pk',   
    password: 'admin123', 
    role: 'admin',
    firstName: 'Hashim', 
    lastName: 'Khan',
    phone: '03001234567'
  },
  { 
    id: 2, 
    email: 'user@frill.pk',    
    password: 'user1234',  
    role: 'customer',
    firstName: 'Ahmed', 
    lastName: 'Hassan',
    phone: '03009876543'
  },
]

function generateMockToken(user) {
  // NOT a real JWT — for mock purposes only. Use a real auth server in production.
  const payload = btoa(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 86400000 }))
  return `mock.${payload}.signature`
}

export async function login({ email, password }) {
  // Simulate API call delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === email && u.password === password)
      if (!user) {
        reject({ 
          response: { 
            data: { message: 'Invalid email or password. Try admin@frill.pk / admin123' } 
          } 
        })
      } else {
        const { password: _, ...safeUser } = user  // never include password in response
        resolve({ token: generateMockToken(user), user: safeUser })
      }
    }, 500)
  })
}

export async function signup(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Validate required fields
      if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.password) {
        reject({
          response: {
            data: { message: 'All fields are required' }
          }
        })
        return
      }

      // Check if email already exists
      if (MOCK_USERS.find(u => u.email === data.email)) {
        reject({
          response: {
            data: { message: 'Email already registered. Try logging in instead.' }
          }
        })
        return
      }

      // Check if phone already exists
      if (MOCK_USERS.find(u => u.phone === data.phone)) {
        reject({
          response: {
            data: { message: 'Phone number already registered' }
          }
        })
        return
      }

      const newUser = { 
        id: Date.now(), 
        role: 'customer', 
        ...data 
      }
      MOCK_USERS.push(newUser)
      const { password: _, ...safeUser } = newUser
      resolve({ token: generateMockToken(newUser), user: safeUser })
    }, 800)
  })
}

export async function logout() {
  localStorage.removeItem('frill_token')
  localStorage.removeItem('frill_user')
}