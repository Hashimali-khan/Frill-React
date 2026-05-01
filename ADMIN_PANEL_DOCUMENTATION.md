# Frill Admin Panel - Architecture & Logic

## Overview
The Frill admin panel is a role-based, protected dashboard built with React Router v7, Redux Toolkit, and RTK Query. It provides full CRUD operations for products, order management, and business intelligence through KPIs.

---

## 1. Authentication & Authorization Flow

### 1.1 Auth State Management (`src/features/auth/`)

**File:** `authSlice.js`
```
Purpose: Manages global auth state (user object)
State Shape: { auth: { user: null | { id, name, role } } }
Reducers:
  - login(user): Sets user object with id, name, and role
  - logout(): Clears user to null
```

**File:** `useAuth.js`
```
Purpose: Custom hook to access auth state anywhere
Returns: { user }  →  null if logged out, or { id, name, role } if logged in
Usage Pattern: const { user } = useAuth()
```

### 1.2 Protected Route Guard (`src/features/auth/ProtectedRoute.jsx`)

```javascript
Logic Flow:
1. Check if user exists
   → if NOT: redirect to /login with return location saved
2. Check if requiredRole matches user.role
   → if NOT: redirect to home (/)
3. If both checks pass: render children
```

**In Admin Router (src/App.jsx):**
```javascript
{
  path: 'admin',
  element: (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <AdminDashboard /> },
    { path: 'orders', element: <AdminOrders /> },
    { path: 'products', element: <AdminProducts /> },
  ],
}
```

**Impact:** Only users with `role === 'admin'` can access `/admin/*` routes.

---

## 2. Authentication Entry Point

### 2.1 Login Page (`src/pages/auth/LoginPage.jsx`)

**Purpose:** Bootstrap authentication for admin access

**Flow:**
1. User enters name and selects role (Admin or Customer)
2. On submit, dispatch `login()` action with user object
3. Redux state updated with { id: Date.now(), name, role }
4. redirect to:
   - `/admin` if role === 'admin'
   - `/` if role === 'customer' (or previous location stored in state)

**Key Code:**
```javascript
const nextPath = location.state?.from?.pathname || (role === 'admin' ? '/admin' : '/')
dispatch(login({ id: Date.now(), name: name.trim(), role }))
navigate(nextPath, { replace: true })
```

---

## 3. Admin Layout Architecture

### 3.1 AdminLayout Component (`src/layouts/AdminLayout.jsx`)

**Structure:**
```
<AdminLayout>
  ┌─────────────────────────────┐
  │  <Sidebar (w-64)>           │
  │  - Frill branding           │
  │  - Navigation links         │
  │  - Footer: View Store/SignOut│
  ├─────────────────────────────┤
  │  <Main Content (flex-1)>    │
  │  - Outlet (renders child page)
  │  - Scrollable overflow-y    │
  └─────────────────────────────┘
</AdminLayout>
```

**Sidebar Navigation (`ADMIN_NAV`):**
```javascript
const ADMIN_NAV = [
  { label: 'Dashboard',  href: '/admin',          icon: LayoutDashboard, end: true },
  { label: 'Orders',     href: '/admin/orders',    icon: ShoppingBag },
  { label: 'Products',   href: '/admin/products',  icon: Package },
  { label: 'Designs',    href: '/admin/designs',   icon: Palette },
  { label: 'Customers',  href: '/admin/customers', icon: Users },
  { label: 'Settings',   href: '/admin/settings',  icon: Settings },
]
```

**Active Link Styling:** NavLinks use `isActive` state to highlight current page with `bg-magenta text-white`.

**Sign Out Button:** Currently a placeholder—should dispatch `logout()` and navigate to `/login`.

---

## 4. Admin Pages

### 4.1 Admin Dashboard (`src/pages/admin/AdminDashboardPage.jsx`)

**Purpose:** High-level business overview and KPIs

**Data Displayed:**
1. **KPI Cards (4):**
   - Total Revenue (PKR)
   - Orders Today (count)
   - Active Products (count)
   - Total Customers (count)
   - Each shows delta (+X this week) and color-coded icon

2. **Recent Orders Table:**
   - 3 mock orders with ID, customer, status, total
   - Rendered via `<OrderTable>` component

**Data Source:** Mock data (no RTK Query yet—ready for backend integration)

---

### 4.2 Admin Products Page (`src/pages/admin/AdminProductsPage.jsx`)

**Purpose:** Full product CRUD management

**Architecture:**

```
State:
  - form: current form values (name, price, vendor, etc.)
  - editingId: which product is being edited (null = create mode)

RTK Query Hooks:
  - useGetProductsQuery({}) → fetches all products
  - useCreateProductMutation() → creates new product
  - useUpdateProductMutation() → updates existing product
  - deleteProduct() → removes product
```

**UI Sections:**

**Section 1: Create/Edit Form**
```
Form Fields:
  - name (text)
  - vendor (text)
  - category (select: tshirt, hoodie, jacket)
  - price (number)
  - oldPrice (number, optional)
  - img (URL)
  - stars (0-5)
  - reviews (count)
  - customizable (checkbox)

Modes:
  - CREATE: Empty form, button says "Create Product"
  - EDIT: Form pre-filled from selected product, button says "Update Product", shows "Cancel Edit"

Validation:
  - Product name required
  - Price must be > 0
  - Toast feedback on error/success
```

**Section 2: Product Table**
```
Columns: Product | Category | Price | Rating | Actions
Actions:
  - Edit: Populate form with product data, set editingId
  - Delete: Confirm modal, then call mutation, refetch

Sorting: Products sorted by ID descending (newest first)
```

**Data Flow Example (Create Product):**
```
1. User fills form (name: "Cool Tee", price: 1500)
2. Click "Create Product"
3. Validation passes
4. createProduct mutation called with payload
5. RTK Query's queryFn:
   a. Generate ID (Date.now())
   b. Auto-generate slug (name.toLowerCase().replace(/\s+/g, '-'))
   c. Push new product to PRODUCTS_MOCK array
   d. Return { data: created }
6. Mutation invalidates 'Product' tag → refetch getProducts
7. Table updates with new product
8. Form resets
9. Toast: "Product created"
```

**Data Flow Example (Update Product):**
```
1. User clicks Edit on a product
2. Form pre-fills with product data
3. editingId = product.id
4. User changes price: 1500 → 1800
5. Click "Update Product"
6. updateProduct mutation called with { id, ...patch }
7. RTK Query's queryFn:
   a. Find product index in PRODUCTS_MOCK
   b. Merge patch into existing product
   c. Return updated product
8. Mutation invalidates specific tag { type: 'Product', id }
9. Table updates
10. Form resets
11. Toast: "Product updated"
```

**Data Flow Example (Delete Product):**
```
1. User clicks Delete on product
2. Confirm modal: "Delete this product? This cannot be undone."
3. User confirms
4. deleteProduct mutation called with product.id
5. RTK Query's queryFn:
   a. Find product index
   b. Remove from PRODUCTS_MOCK (splice)
   c. Return { data: { success: true } }
6. Mutation invalidates 'Product' tag → refetch getProducts
7. Table removes row
8. Toast: "Product deleted"
```

---

### 4.3 Admin Orders Page (`src/pages/admin/AdminOrdersPage.jsx`)

**Purpose:** Manage order status and logistics

**State:**
```
orders: array of order objects
filter: current filter ('all' or status like 'Printing', 'Dispatched')

Order Shape:
{
  id: '#F-1024',
  customer: 'Ahmed Hassan',
  city: 'Lahore',
  items: 2,
  total: 4998,
  status: 'Printing',
  date: '2026-03-20',
  phone: '0311-2345678'
}
```

**Status Pipeline:**
```
Pending → Confirmed → Printing → Dispatched → Delivered
```

**Functionality:**
1. **Filter Tabs:** Click status to show only orders in that state
2. **Advance Status:** Click "Advance" to move order to next status in pipeline
3. **Order Table:** Renders via `<OrderTable orders={displayed} onAdvance={...}>` component

**Data Source:** Mock data (ready for RTK Query integration with backend)

---

### 4.4 Admin Designs Page (`src/pages/admin/AdminDesignsPage.jsx`)

**Purpose:** Review, approve, and manage customer design submissions before production

**Data Model:**

```javascript
Design Shape:
{
  id: 1,
  customerId: 'cust-001',
  customerName: 'Ahmed Hassan',
  customerEmail: 'ahmed@example.com',
  product: 'Classic Custom Hoodie',
  productId: 1,
  title: 'Team Spirit Design',
  description: 'Purple hoodie with white text and logo',
  status: 'pending',  // or 'approved' | 'rejected'
  createdAt: '2026-04-28',
  updatedAt: '2026-04-28',
  canvasJson: {...},         // Full Fabric.js canvas snapshot
  previewUrl: 'https://...',  // 400x500 preview image
  printUrl: 'https://...',    // 1200x1500 high-res print
  notes: 'Admin review notes' // filled on rejection
}
```

**UI Components:**

**1. Stats Cards (Top)**
```
Shows KPIs:
  - Total: all submissions
  - Pending: awaiting review
  - Approved: green-lit for production
  - Rejected: failed QA
```

**2. Filter Tabs**
```
'All' | 'Pending' | 'Approved' | 'Rejected'
Clicking tabs filters gallery below
```

**3. Design Gallery**
```
Grid (1 col mobile, 2 col tablet, 3 col desktop)
Each card:
  - Thumbnail image
  - Status badge (top-right corner)
  - Title + Description
  - Customer name + Product
  - Date created
  - "Preview & Manage" button
```

**4. Design Preview Modal**
```
Opens on card click
Layout:
  - Header: Title + Customer name + Close button
  - Canvas preview: Large thumbnail
  - Design Details: 4-column grid
    - Product
    - Status
    - Created date
    - Updated date
  - Description section
  - Customer Info (name, email link)
  - Admin Notes (if rejected)
  - Actions:
    - Download Print (always available)
    - Approve (only if pending)
    - Reject (only if pending)
    - Close

State Transitions:
  pending → [Approve] → approved
  pending → [Reject] → rejected
  Closes modal after action
```

**Data Flow Example (Design Workflow):**
```
1. Customer creates design in studio
   └─> Design saved to DESIGNS_MOCK with status: 'pending'
   └─> Canvas JSON + preview URLs captured

2. Admin navigates to /admin/designs
   └─> useGetDesignsQuery (mock) returns all designs
   └─> Gallery loads with 5-design grid

3. Admin clicks filter "Pending"
   └─> designs.filter(d => d.status === 'pending')
   └─> Gallery shows only 2 pending designs

4. Admin clicks "Preview & Manage" on design
   └─> Modal opens with full design details
   └─> Shows preview image + customer email + notes

5. Admin reviews design
   Option A - APPROVE:
     └─> Click "Approve" button
     └─> design.status = 'approved'
     └─> design.updatedAt = today
     └─> designs array updates
     └─> Modal closes
     └─> Gallery re-filters (if viewing Pending, design disappears)

   Option B - REJECT:
     └─> Click "Reject" button
     └─> design.status = 'rejected'
     └─> design.notes = "Print area outside safe zone. Ask customer to reposition."
     └─> design.updatedAt = today
     └─> Modal closes
     └─> Customer sees rejection reason in their dashboard

6. Admin clicks "Download Print"
   └─> Opens print URL in new tab
   └─> 1200x1500 PNG ready for production facility
```

**Statistics Tracking:**
```
Calculated in real-time from designs array:
  stats.total = designs.length
  stats.pending = designs.filter(d => d.status === 'pending').length
  stats.approved = designs.filter(d => d.status === 'approved').length
  stats.rejected = designs.filter(d => d.status === 'rejected').length
```

---

### 4.5 OrderTable Component (`src/pages/admin/OrderTable.jsx`)

**Purpose:** Reusable table for displaying orders

**Props:**
```javascript
{
  orders,          // array of order objects
  variant,         // 'full' (default) or 'dashboard'
  onAdvance        // callback: (orderId) => void
}
```

**Rendering:**
- Full variant: Shows all columns + action buttons
- Dashboard variant: Compact view for homepage dashboard

---

### 4.6 Admin Customers Page (`src/pages/admin/AdminCustomersPage.jsx`)

**Purpose:** Manage customer accounts, view order history, track lifetime value

**Data Model:**

```javascript
Customer Shape:
{
  id: 'cust-001',
  name: 'Ahmed Hassan',
  email: 'ahmed@example.com',
  phone: '0311-2345678',
  city: 'Lahore',
  country: 'Pakistan',
  joinedDate: '2026-01-15',
  orders: 5,
  totalSpent: 12450,
  status: 'active',  // 'active' | 'inactive' | 'banned'
  lastOrder: '2026-04-25',
}
```

**UI Components:**

**1. Stats Cards (Top 5)**
```
Shows KPIs:
  - Total customers
  - Active (green)
  - Inactive (gray)
  - Banned (red)
  - Total Revenue (PKR)
```

**2. Search & Filter**
```
Search Box: Find by name, email, or city
Filter Tabs: All | Active | Inactive | Banned
Displays filtered customer count
```

**3. Customers Table**
```
Columns: Customer | Contact | Orders | Total Spent | Member Since | Status | Actions
Sorting: By last order (newest first)
Status Badge: Color-coded (green/gray/red)
Row Actions: "View" button opens customer modal
```

**4. Customer Details Modal**
```
Header: Customer name + Email + Close button
Content:
  - Contact Info: Email, Phone, City, Country
  - Account Stats: Orders, Total Spent, Member Since
  - Status Management: Active/Inactive/Banned buttons
  - Actions: Send Email, Contact, Close
```

**Status Management:**
```
Admin can change customer status at any time:
  active   → Customer can place orders
  inactive → Account frozen but data retained
  banned   → Customer cannot access store
```

**Data Flow Example (Status Change):**
```
1. Admin views customer modal
2. Clicks "Inactive" button
3. customer.status = 'inactive'
4. customers array updates
5. Status badge in table changes color
6. Modal shows new status
```

---

### 4.7 Admin Settings Page (`src/pages/admin/AdminSettingsPage.jsx`)

**Purpose:** Configure store settings, notification preferences, security, and performance

**Settings Categories:**

**1. Store Settings**
```
  - Store Name
  - Store Email
  - Store Phone
  - Currency (select: PKR, USD, EUR)
```

**2. Notifications**
```
  - Email Notifications (toggle)
  - Order Alerts (toggle)
  - Review Notifications (toggle)
  - Marketing Emails (toggle)
```

**3. Security**
```
  - Two-Factor Authentication (toggle)
  - Session Timeout (number input, minutes)
  - IP Whitelist (textarea, one per line)
```

**4. Performance**
```
  - Cache Duration (hours)
  - Max Upload Size (MB)
  - Enable CDN (toggle)
  - Auto Backup Daily (toggle)
```

**5. Danger Zone (Destructive Actions)**
```
  - Clear All Cache (red button)
  - Export Database (red button)
```

**UI Components:**

**Setting Control Rendering:**
- `text` → Text input
- `email` → Email input
- `tel` → Phone input
- `number` → Number spinner
- `select` → Dropdown
- `textarea` → Multi-line text
- `toggle` → Switch control (animated)

**Save Workflow:**
```
1. Admin modifies settings (changes recorded in state)
2. Clicks "Save Changes" button
3. Button shows "Saving..." state
4. Simulates API call (800ms delay)
5. Toast success message appears
6. All changes persist to mock storage
```

**Data Flow Example (Toggle Notification):**
```
1. Admin views Settings page
2. Toggles "Email Notifications" on → off
3. settings.emailNotifs = false
4. UI updates toggle state immediately
5. Admin clicks "Save Changes"
6. Settings sent to backend (mock)
7. Toast: "Settings saved successfully"
```

---

### 4.8 Product Edit Functionality

**Location:** [AdminProductsPage.jsx](src/pages/admin/AdminProductsPage.jsx#L49)

**Feature Overview:**
Edit mode allows admins to modify existing product details with pre-filled form.

**Implementation:**

```javascript
function startEdit(product) {
  setEditingId(product.id)
  setForm({
    name: product.name,
    vendor: product.vendor,
    category: product.category,
    price: Number(product.price),
    oldPrice: product.oldPrice,
    img: product.img,
    desc: product.desc,
    stars: Number(product.stars),
    reviews: Number(product.reviews),
    customizable: Boolean(product.customizable),
  })
}
```

**UI Behavior:**
```
CREATE MODE:
  - Form: empty (EMPTY_FORM)
  - Button: "Create Product"
  - No "Cancel Edit" visible
  - Product table below

EDIT MODE:
  - Form: pre-filled with product data
  - Button: "Update Product"
  - "Cancel Edit" button visible (resets form)
  - Clicking Edit row → focus jumps to form
  - Product is highlighted in table

Edit Flow:
1. Admin clicks "Edit" button on product row
2. Form pre-fills with all product data
3. editingId set to product.id
4. Edit button → "Cancel Edit" appears
5. Admin modifies one or more fields
6. Clicks "Update Product"
7. updateProduct mutation called: updateProduct({ id, ...patch })
8. RTK Query queryFn merges patch into existing product
9. Cache invalidated, table updates
10. Form resets, editingId = null, form shows "Create Product" again
```

**Editable Fields:**
- Product name
- Vendor
- Category (dropdown)
- Price (number)
- Old price (optional)
- Image URL
- Star rating (0-5)
- Review count
- Customizable checkbox

**Validation:**
- Product name required
- Price must be > 0

**Toast Feedback:**
- "Product updated" on success
- "Could not save product" on error

---

### 4.9 Sign Out Functionality

**Location:** [AdminLayout.jsx](src/layouts/AdminLayout.jsx#L49)

**Implementation:**

```javascript
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '@/features/auth/authSlice'

export default function AdminLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function handleSignOut() {
    dispatch(logout())           // Clear auth.user = null
    navigate('/login', { replace: true })  // Navigate to login
  }

  return (
    // ... sidebar with Sign Out button
    <button onClick={handleSignOut}>
      <LogOut size={16} /> Sign Out
    </button>
  )
}
```

**Flow:**
```
1. Admin clicks "Sign Out" button in sidebar footer
2. handleSignOut() called
3. Dispatches logout() action
   └─> Redux: auth.user = null
4. Navigate to /login with replace: true
5. ProtectedRoute checks: user exists?
   └─> NO → renders <Navigate to="/login" />
6. Admin sees login page, can sign in again
```

**Key Details:**
- `replace: true` prevents back button returning to admin
- Auth state cleared from Redux (visible to all components)
- Login page accessible again after sign out
- Cart state persists (redux-persist) if user signs in with same browser

---

## 5. Redux State Flow

### 5.1 Redux Store Configuration (`src/store/index.js`)

```javascript
Store Shape:
{
  cart:                    { items: [...], isOpen: false },
  auth:                    { user: null | { id, name, role } },
  studio:                  { canvas, history, ... },
  productsApi:             { queries: {...}, mutations: {...} },  // RTK Query
}

Middleware:
  - Redux Thunk (default)
  - productsApi.middleware (RTK Query)
  - redux-persist (cart only, excludes isOpen)
```

### 5.2 RTK Query Products API (`src/features/products/productsApi.js`)

**Slice Configuration:**
```javascript
createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Product'],  // for cache invalidation
  endpoints: (builder) => ({...})
})
```

**Query Endpoints:**

**getProducts(params)**
```
Input: { category, search, sort }
Output: filtered/sorted array of products
Cache Tag: 'Product'
Mock Behavior: Filters PRODUCTS_MOCK array
```

**getProductBySlug(slug)**
```
Input: { slug }
Output: single product or 404 error
Cache Tag: { type: 'Product', id: slug }
Mock Behavior: Finds product by slug property
```

**Mutation Endpoints:**

**createProduct(newProduct)**
```
Input: { name, price, vendor, ... }
Output: { data: created product with id and slug }
Invalidates: 'Product' (triggers getProducts refetch)
Mock: assigns id = Date.now(), generates slug
```

**updateProduct({ id, ...patch })**
```
Input: { id, name, price, ... }
Output: { data: updated product }
Invalidates: { type: 'Product', id } (specific cache entry)
Mock: finds and merges patch
```

**deleteProduct(id)**
```
Input: product id
Output: { data: { success: true } }
Invalidates: 'Product' (triggers refetch)
Mock: removes from PRODUCTS_MOCK array
```

---

## 6. Data Flow Summary

### 6.1 User Journey: Admin Creates Product

```
1. Login Page
   └─> User enters name + role (admin)
   └─> dispatch login()
   └─> Redux: auth.user = { id, name, role: 'admin' }
   └─> Navigate to /admin

2. ProtectedRoute Check
   └─> user exists? ✓
   └─> user.role === 'admin'? ✓
   └─> Render AdminLayout

3. AdminLayout
   └─> Render sidebar + Outlet
   └─> Default route renders AdminDashboard (or click Products)

4. AdminProductsPage
   └─> Mount: useGetProductsQuery({}) fires
   └─> RTK Query: fetch products → queryFn reads PRODUCTS_MOCK
   └─> Display table with 5 products

5. Create Product
   └─> User fills form: name="Awesome Shirt", price=1999
   └─> Click "Create Product"
   └─> Validation: name & price check pass
   └─> Call createProduct mutation
   └─> RTK Query: queryFn generates id & slug, pushes to PRODUCTS_MOCK
   └─> invalidatesTags: ['Product'] triggers refetch
   └─> useGetProductsQuery fires again, returns 6 products
   └─> Table re-renders with new product
   └─> Toast: "Product created"
   └─> Form resets to EMPTY_FORM

6. Edit Product
   └─> Click Edit on "Classic Custom Hoodie"
   └─> startEdit() pre-fills form with its data
   └─> editingId = 1 (the hoodie's id)
   └─> User changes price: 2499 → 2299
   └─> Click "Update Product"
   └─> Call updateProduct({ id: 1, price: 2299, ... })
   └─> RTK Query: queryFn finds product, merges patch
   └─> invalidatesTags: [{ type: 'Product', id: 1 }]
   └─> Table cell updates with new price
   └─> Toast: "Product updated"
   └─> Form resets, editingId = null

7. Delete Product
   └─> Click Delete on "Signature Unisex Tee"
   └─> Confirm modal appears
   └─> User confirms
   └─> Call deleteProduct(2)
   └─> RTK Query: queryFn removes from PRODUCTS_MOCK
   └─> invalidatesTags: ['Product']
   └─> Table removes row
   └─> Toast: "Product deleted"
```

---

## 7. Technical Highlights

### 7.1 Why This Architecture?

**Separation of Concerns:**
- Auth logic isolated in `authSlice` + `ProtectedRoute`
- Admin routes nested under layout
- Each page owns its CRUD forms + data hooks

**RTK Query Benefits:**
- **Automatic Caching:** Products fetched once, cached
- **Tag-Based Invalidation:** After mutation, specific or all tags refetch
- **Normalized API:** One source of truth for products
- **Built-in Loading/Error:** isLoading, isError on every hook

**Mock Data Strategy:**
- `queryFn` callbacks intercept queries
- Directly mutate `PRODUCTS_MOCK` array (development simulation)
- When backend ready: swap queryFn for real API calls (no UI changes needed)

### 7.2 Production Transition

```javascript
// Current (Mock):
queryFn(params) {
  let data = [...PRODUCTS_MOCK]
  // filter, sort
  return { data }
}

// Future (Backend):
query: {
  url: '/products',
  method: 'GET',
  params,
}
// RTK Query auto-handles HTTP + cache
```

---

## 8. Key Components Used

| Component | Purpose | Props |
|-----------|---------|-------|
| `<ProtectedRoute>` | Auth guard | `requiredRole`, `children` |
| `<AdminLayout>` | Shell (sidebar + outlet) | None (renders Outlet) |
| `<OrderTable>` | Reusable order display | `orders`, `variant`, `onAdvance` |
| `<PageLoader>` | Loading fallback | None |

---

## 11. Interview Talking Points

1. **Full Admin CRUD Workflow:**
   - "Products, orders, and designs all support create/read/update/delete operations via RTK Query mutations."
   - "Edit mode pre-fills forms with existing data; cancel button resets without persisting changes."
   - "Mutations invalidate cache tags, triggering automatic table refetches."

2. **Authentication & Security:**
   - "Role-based access via ProtectedRoute—only 'admin' role can access `/admin/*` routes."
   - "Login page bootstraps user state to Redux auth slice."
   - "Sign out clears auth.user and navigates to login with `replace: true` to prevent back-button access."

3. **Customer Management:**
   - "Admins track customer lifetime value (orders + total spent) for VIP identification."
   - "Status flags (active/inactive/banned) allow soft deletes and account suspension without data loss."
   - "Search + filter combine for quick customer lookup; email links allow one-click contact."

4. **Configuration at Scale:**
   - "Settings page demonstrates modular configuration UI—different input types (toggle, textarea, number) render dynamically."
   - "Mock save flow shows how to handle multi-section forms with consistent UX."
   - "Danger zone pattern for destructive actions (clear cache, export) with visual distinction."

5. **Product Edit vs. Create:**
   - "Same form handles both modes—editingId state determines submit behavior (create vs. update)."
   - "RTK Query's `updateProduct` mutation with ID spreads patch to avoid re-fetching unchanged fields."
   - "Form validation and toast feedback consistent across create/edit/delete operations."

6. **Design Review Workflow:**
   - "Canvas snapshots (canvasJson) stored alongside preview/print URLs for admin reproducibility."
   - "Status transitions (pending → approved/rejected) prevent unauthorized production."
   - "Admin notes on rejection enable customer communication without leaving dashboard."

7. **Performance & Scalability:**
   - "Code-split admin pages via lazy loading—dashboard loads fast, Customers/Settings on-demand."
   - "Mock data arrays directly mutable in queryFn; production backend swap requires no UI changes."
   - "Memoized selectors (useMemo) prevent unnecessary re-renders on large tables."

8. **UX Consistency:**
   - "Gradient headers, status badges with color coding, and truncated cells across all admin pages."
   - "Loading states ('Saving...', 'Loading products...') on buttons and tables prevent double-clicks."
   - "Modals (design preview, customer details) use Tailwind's backdrop blur and z-index isolation."

---

## 12. Production Deployment Checklist

- [ ] Replace DESIGNS_MOCK, CUSTOMERS_MOCK, PRODUCTS_MOCK with RTK Query endpoints
- [ ] Implement real backend authentication (JWT tokens, session management)
- [ ] Add order fulfillment automation (status transitions to printing/shipping)
- [ ] Set up email notifications (SendGrid/Mailgun for order & review alerts)
- [ ] Implement customer two-factor authentication
- [ ] Add audit logging for admin actions (who changed what, when)
- [ ] Rate-limit API endpoints to prevent abuse
- [ ] Enable CORS only for your domain
- [ ] Set up database backups for production
- [ ] Add Sentry or similar for error tracking in production

---

**Final Note:** This admin panel architecture demonstrates enterprise-level React patterns—role-based routing, normalized API state via RTK Query, form state isolation, and consistent UX. All features mock-ready for rapid prototyping; backend integration swaps are straightforward.

1. **Authentication Flow:** "We use Redux to store user state, and ProtectedRoute checks role before rendering admin pages."

2. **CRUD via RTK Query:** "Mutations directly mutate mock data and invalidate cache tags, triggering automatic refetches. Zero boilerplate."

3. **Scalability:** "Ready to swap mock data for real backend—just change queryFn to actual API calls. UI stays the same."

4. **UI/UX Details:**
   - Form validation with toast feedback
   - Confirmation modals for destructive actions
   - Sorted product table (newest first)
   - Loading states on mutations

5. **Data Consistency:** "Tag-based invalidation ensures table always reflects latest data after create/update/delete."

---

## 10. Files Summary

```
src/
├── data/
│   ├── products.mock.js       (Product catalog data)
│   ├── designs.mock.js        (Customer design submissions)
│   ├── customers.mock.js      (Customer accounts data) ← NEW
│   └── orders.mock.js         (Order data)
├── features/
│   ├── auth/
│   │   ├── authSlice.js          (Redux auth state)
│   │   ├── useAuth.js            (Hook to access user)
│   │   └── ProtectedRoute.jsx     (Role guard component)
│   ├── products/
│   │   ├── productsApi.js         (RTK Query CRUD endpoints)
│   │   └── productsSlice.js       (Redux products state)
│   └── design-studio/
│       ├── studioSlice.js         (Canvas undo/redo + tool state)
│       └── useStudio.js           (Fabric.js canvas hook)
├── pages/
│   ├── admin/
│   │   ├── AdminDashboardPage.jsx (KPI overview)
│   │   ├── AdminOrdersPage.jsx    (Order management)
│   │   ├── AdminProductsPage.jsx  (Product CRUD with Edit)
│   │   ├── AdminDesignsPage.jsx   (Design review & approval)
│   │   ├── AdminCustomersPage.jsx (Customer management) ← NEW
│   │   ├── AdminSettingsPage.jsx  (Store configuration) ← NEW
│   │   └── OrderTable.jsx         (Shared order table)
│   └── auth/
│       └── LoginPage.jsx          (Auth entry point)
├── layouts/
│   ├── AdminLayout.jsx            (Admin shell + sidebar + sign out)
│   └── MainLayout.jsx             (Storefront shell)
├── store/
│   ├── index.js                   (configureStore)
│   └── rootReducer.js             (combined reducers)
└── App.jsx                        (Router config)
```

---

**Interview Bonus:** "This architecture demonstrates understanding of modern React patterns: custom hooks for state access, RTK Query for normalized API state, role-based route protection, and scalable component structure."
