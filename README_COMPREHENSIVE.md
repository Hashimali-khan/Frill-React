# 🎨 Frill React - Complete Architecture & Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Architecture & Design Patterns](#architecture--design-patterns)
5. [Core Modules](#core-modules)
6. [Features & Functionality](#features--functionality)
7. [User Flows](#user-flows)
8. [Admin Flows](#admin-flows)
9. [State Management](#state-management)
10. [File-by-File Documentation](#file-by-file-documentation)

---

## Project Overview

**Frill** is a sophisticated **e-commerce + design customization platform** built for the Pakistani market. It enables users to:
- Browse and purchase customizable apparel (t-shirts, hoodies, etc.)
- Design products using a **Canva-style drag-and-drop studio** with text, images, shapes, and brush drawing
- View real-time mockups with product colors and views (front, back, sleeve)
- Add designs to cart and checkout
- Admin panel to manage products, orders, customers, and designs

### Key Innovations
- **React Konva Canvas**: Hardware-accelerated canvas rendering with touch gestures (pinch zoom, rotate)
- **Redux History Middleware**: Undo/redo for design edits up to 30 steps
- **Nested Product Schema**: Products → Colors → Views → Print Areas
- **Urdu Typography Support**: Custom Urdu font keyboard and font selection
- **Cloudinary Integration**: Image uploads with filters and cropping
- **RTK Query Caching**: Optimized API state management with automatic cache invalidation

---

## Tech Stack

### Frontend Core
| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Runtime** | Node.js/Browser | ES2021+ | JavaScript execution |
| **UI Library** | React | 19.2.4 | Component framework |
| **State** | Redux Toolkit | 2.11.2 | Global state management |
| **API** | RTK Query | Built-in | Caching, normalization, sync |
| **Router** | React Router | 7.13.2 | Client-side routing |
| **Canvas** | react-konva / konva | 19.2.3 / 10.3.0 | 2D drawing engine |
| **Animation** | Framer Motion | 12.38.0 | Smooth transitions |
| **Forms** | Native HTML | — | Validation & submission |

### Styling & Design
| Tool | Version | Usage |
|------|---------|-------|
| **Tailwind CSS** | 4.2.2 | Utility-first CSS framework |
| **PostCSS** | Latest | CSS transformation & autoprefixer |
| **Lucide React** | 1.7.0 | Icon library (180+ icons) |
| **Framer Motion** | 12.38.0 | Animation primitives |

### Build & Dev Tools
| Tool | Version | Purpose |
|------|---------|---------|
| **Vite** | 8.0.3 | Lightning-fast build tool |
| **SWC** | 4.3.0 | Faster transpilation (Babel alternative) |
| **ESLint** | Recommended | Code quality linting |
| **Redux DevTools** | Via browser ext | State debugging |

### Persistence & Storage
| Service | Purpose |
|---------|---------|
| **redux-persist** | LocalStorage cart persistence |
| **Cloudinary API** | Image uploads & CDN |

---

## Project Structure

```
frill/
├── public/                          # Static assets
│
├── src/
│   ├── main.jsx                     # Entry point (React 19 root)
│   ├── App.jsx                      # Route definitions & code-splitting
│   │
│   ├── api/                         # HTTP client setup
│   │   ├── auth.api.js              # Auth endpoints
│   │   ├── client.js                # Fetch wrapper
│   │   ├── orders.api.js            # Order endpoints
│   │   └── products.api.js          # Product CRUD (DEPRECATED - use RTK Query)
│   │
│   ├── components/                  # Atomic component system
│   │   ├── atoms/                   # Single-responsibility UI primitives
│   │   │   ├── Badge.jsx            # Status/category tags
│   │   │   ├── Button.jsx           # Reusable button with variants
│   │   │   ├── Eyebrow.jsx          # Section label/eyebrow text
│   │   │   ├── PageLoader.jsx       # Loading spinner
│   │   │   ├── Spinner.jsx          # Async operation indicator
│   │   │   └── index.js             # Barrel export
│   │   │
│   │   ├── molecules/               # Composed of atoms, simple workflows
│   │   │   ├── ColorSwatch.jsx      # Color picker component
│   │   │   ├── QuantityInput.jsx    # +/- quantity selector
│   │   │   ├── SearchBar.jsx        # Product search input
│   │   │   ├── SizeChip.jsx         # Size selector
│   │   │   ├── StarRating.jsx       # Review rating display
│   │   │   └── index.js             # Barrel export
│   │   │
│   │   └── organisms/               # Large, complex feature components
│   │       ├── AccountPanel.jsx     # User account dropdown
│   │       ├── AnnouncementBar.jsx  # Top banner (shipping info, etc.)
│   │       ├── FilterBar.jsx        # Product filters (category, price)
│   │       ├── MarqueeStrip.jsx     # Scrolling text animation
│   │       ├── MobileDrawer.jsx     # Hamburger menu for mobile
│   │       ├── ProductCard.jsx      # Product card in grid/list
│   │       ├── SiteFooter.jsx       # Footer with links & socials
│   │       ├── SiteHeader.jsx       # Top navigation bar
│   │       ├── UspStrip.jsx         # Unique selling points (shipping, etc.)
│   │       └── index.js             # Barrel export
│   │
│   ├── constants/                   # Global constants & configs
│   │   ├── navigation.js            # Menu structure, links
│   │   ├── routes.js                # Route paths and names
│   │   └── theme.js                 # Brand colors, spacing, typography
│   │
│   ├── data/                        # Mock data (used until backend ready)
│   │   ├── products.mock.js         # ~50 sample products
│   │   ├── designs.mock.js          # Sample design submissions
│   │   ├── customers.mock.js        # Sample customer accounts
│   │   └── orders.mock.js           # Sample order history
│   │
│   ├── features/                    # Feature-based module organization
│   │   │
│   │   ├── auth/                    # Authentication & user roles
│   │   │   ├── auth.test.js         # Jest tests (login, signup, role guards)
│   │   │   ├── authSlice.js         # Redux: user login state
│   │   │   ├── ProtectedRoute.jsx   # Role-based route wrapper
│   │   │   └── useAuth.js           # Hook: access current user & login
│   │   │
│   │   ├── cart/                    # Shopping cart feature
│   │   │   ├── CartDrawer.jsx       # Animated side drawer
│   │   │   ├── CartItem.jsx         # Single cart line item
│   │   │   ├── cartSlice.js         # Redux: items, quantity, totals
│   │   │   └── useCart.js           # Hook: add/remove/update items
│   │   │
│   │   ├── products/                # Product catalog feature
│   │   │   ├── productsApi.js       # RTK Query: GET/POST/PUT/DELETE products
│   │   │   ├── productsSlice.js     # Redux: product list & filters
│   │   │   └── useProducts.js       # Hook: filter, search, sort
│   │   │
│   │   └── studio/                  # Design studio (Canva-style editor)
│   │       ├── studioSlice.js       # Redux: design state, history, tools
│   │       ├── studioHistoryMiddleware.js  # Custom middleware for undo/redo
│   │       ├── studioUtils.js       # Helpers: create objects, serialize
│   │       ├── useStudio.js         # Hook: add text/image/shape/brush
│   │       ├── useUrduFonts.js      # Hook: load Urdu fonts from Google
│   │       ├── useStudioUtils.js    # Hook: transform, snap, export
│   │       │
│   │       └── components/          # Studio UI components
│   │           ├── StudioShell.jsx          # Top-level wrapper
│   │           ├── StudioCanvas.jsx        # React Konva Stage (main editor)
│   │           ├── StudioDock.jsx          # Bottom toolbar
│   │           ├── StudioPropertiesPanel.jsx # Right sidebar (object properties)
│   │           ├── ImageUploadButton.jsx   # Cloudinary upload
│   │           └── UndoRedoPanel.jsx       # History buttons
│   │
│   ├── hooks/                       # Reusable custom hooks
│   │   ├── useDebounce.js           # Debounce input (search, resize)
│   │   ├── useLocalStorage.js       # Persistent state in localStorage
│   │   ├── useMediaQuery.js         # Responsive breakpoint detection
│   │   ├── useScrolled.js           # Detect when page scrolled
│   │   ├── useScrollLock.js         # Disable body scroll (modals)
│   │   └── useToast.js              # Toast notification system
│   │
│   ├── layouts/                     # Page layout wrappers
│   │   ├── AdminLayout.jsx          # Admin dashboard wrapper (sidebar, nav)
│   │   └── MainLayout.jsx           # Storefront wrapper (header, footer, cart)
│   │
│   ├── pages/                       # Page components (route handlers)
│   │   ├── ContactPage.jsx          # Contact form
│   │   ├── NotFoundPage.jsx         # 404 error page
│   │   ├── PrivacyPage.jsx          # Privacy policy
│   │   ├── TermsPage.jsx            # Terms & conditions
│   │   │
│   │   ├── admin/                   # Admin pages (all protected)
│   │   │   ├── AdminCustomersPage.jsx      # Manage customer accounts
│   │   │   ├── AdminDashboardPage.jsx      # Analytics & overview
│   │   │   ├── AdminDesignsPage.jsx        # User-submitted designs
│   │   │   ├── AdminOrdersPage.jsx        # Order management & history
│   │   │   ├── AdminProductsPage.jsx      # Product CRUD editor
│   │   │   ├── AdminSettingsPage.jsx      # Store configuration
│   │   │   └── OrderTable.jsx             # Reusable order table component
│   │   │
│   │   ├── auth/                    # Authentication pages
│   │   │   ├── ForgotPasswordPage.jsx      # Password reset flow
│   │   │   ├── LoginPage.jsx              # User login
│   │   │   └── SignupPage.jsx             # User registration
│   │   │
│   │   ├── storefront/              # Customer-facing pages
│   │   │   ├── AccountPage.jsx             # User profile & settings
│   │   │   ├── CartPage.jsx               # Cart review page
│   │   │   ├── CheckoutPage.jsx           # Payment & shipping
│   │   │   ├── CollectionPage.jsx         # Product catalog
│   │   │   ├── HomePage.jsx               # Landing page
│   │   │   └── ProductDetailPage.jsx      # Single product view
│   │   │
│   │   └── studio/                  # Design studio pages
│   │       ├── DesignStudioPage.jsx       # Studio router wrapper
│   │       └── PropertiesSidebar.jsx      # (moved to studio/components)
│   │
│   ├── store/                       # Redux store configuration
│   │   ├── index.js                 # Store setup, middleware, persistor
│   │   └── rootReducer.js           # Combined reducers
│   │
│   ├── styles/                      # Global styles
│   │   ├── globals.css              # CSS variables, @layer utilities
│   │   └── fonts.css                # Font face declarations (Google Fonts)
│   │
│   └── utils/                       # Shared utilities
│       ├── cn.js                    # ClassNames utility (clsx + twMerge)
│       ├── currency.js              # Format prices in PKR
│       ├── images.js                # Image URL builders
│       └── validators.js            # Form validation functions
│
├── node_modules/                    # Dependencies
├── dist/                            # Production build output (Vite)
│
├── index.html                       # HTML entry point
├── package.json                     # Dependencies & scripts
├── tailwind.config.js               # Tailwind theme & plugins
├── postcss.config.js                # PostCSS configuration
├── vite.config.js                   # Vite build configuration
├── .eslintrc.cjs                    # ESLint rules
│
├── README.md                        # Quick start guide
├── ADMIN_PANEL_DOCUMENTATION.md     # Admin features deep dive
├── AUTH_QUICK_START.md              # Auth setup guide
└── TEST_CASES.md                    # QA test matrix

```

---

## Architecture & Design Patterns

### 1. Component Architecture (Atomic Design)

Frill uses a **three-tier component hierarchy**:

```
ATOMS (Basic UI Primitives)
  └─ Button, Badge, Spinner, Eyebrow, PageLoader
      │
      ├─ Minimal, single-responsibility
      ├─ Accept props for customization
      └─ No business logic

         ↓ Composed into

MOLECULES (Simple Workflows)
  └─ ColorSwatch, QuantityInput, StarRating, SizeChip
      │
      ├─ Combine 2-3 atoms
      ├─ Handle simple user interactions
      └─ Still mostly presentational

         ↓ Composed into

ORGANISMS (Complex Features)
  └─ SiteHeader, ProductCard, CartDrawer, StudioCanvas
      │
      ├─ Combine molecules & atoms
      ├─ Connect to Redux/API
      ├─ Manage local state
      └─ Reusable across pages
```

**Why this pattern?**
- ✅ **Scalability**: Easy to reuse components across features
- ✅ **Testability**: Isolated units reduce test complexity
- ✅ **Maintenance**: Changes in atoms don't break organisms
- ❌ **Alternatives considered**: Flat structure (hard to scale), feature-folder-first (less reusable)

### 2. Feature-Based Module Organization

```
src/features/
├── auth/           # All auth-related code
├── cart/           # All cart-related code
├── products/       # All product-related code
└── studio/         # All design studio code
```

**Benefits:**
- ✅ Easier to find related code
- ✅ Clear ownership & responsibility
- ✅ Simple to export/remove features
- ❌ **Alternatives**: Domain-based (confuses admin/user domains), layer-based (tight coupling)

### 3. Redux + RTK Query Pattern

```
Redux Slices (Client State)           RTK Query (Server State)
├── auth                              ├── productsApi (GET/POST/PUT/DELETE)
├── cart                              │   └─ Cached, normalized, auto-invalidated
├── studio                            └─ Tags for fine-grained cache control
└── UI state (tools, zoom, etc.)
```

**Why separate?**
- ✅ Redux for **UI state** (which tool selected, drawer open/close)
- ✅ RTK Query for **server state** (products, orders) — automatic caching & sync
- ❌ **Alternative**: Single Redux store (manual cache management, verbose)

### 4. Canvas State Management (Design Studio)

```
Redux State (studioSlice)
│
├── design.objects[]          # Array of canvas objects
│   └─ [{ id, type, x, y, width, scaleX, rotation, text, fill, ... }]
│
├── design.background         # Canvas background (color, image, print area)
│
├── design.stage              # Canvas dimensions (820x960)
│
├── history                   # Undo/redo snapshots
│   ├─ past: [snapshots...]   # State snapshots for undo
│   ├─ present: currentDesign
│   └─ future: [snapshots...] # State snapshots for redo
│
└── ui                        # Editor UI state
    ├─ tool: 'select'|'brush'|'text'|'image'|'shape'
    ├─ activeObjectId         # Currently selected object ID
    ├─ brush: { color, size } # Brush tool settings
    ├─ zoom: 1                # Canvas zoom level
    └─ snapping: true         # Magnetic guides enabled
```

**Custom Middleware** (`studioHistoryMiddleware.js`):
- Intercepts every design mutation (addObject, updateObject, etc.)
- Captures **snapshots** of entire design state
- Maintains past/present/future arrays (max 30 steps)
- Enables undo/redo without manual action tracking

---

## Core Modules

### Module 1: Authentication (`src/features/auth/`)

**Purpose**: Manage user login, roles, and access control

**Files**:

| File | Responsibility |
|------|-----------------|
| `authSlice.js` | Redux state: current user, token, role |
| `useAuth.js` | Hook to access user, login/logout |
| `ProtectedRoute.jsx` | Wrapper that blocks unauthorized access |
| `auth.test.js` | Jest tests for login, role guards |

**How it works**:
```jsx
// User logs in at LoginPage
dispatch(setUser({ id: '123', name: 'Ahmed', role: 'admin' }))

// ProtectedRoute checks role before rendering admin pages
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>

// useAuth provides user info throughout app
const { user, isLoggedIn, login, logout } = useAuth()
```

**State Shape**:
```javascript
auth: {
  user: {
    id: 'user-123',
    name: 'Ahmed Khan',
    email: 'ahmed@example.com',
    role: 'admin' | 'customer',
    createdAt: '2026-01-15'
  },
  token: 'jwt-token-string',
  isLoading: false,
  error: null
}
```

**Why this approach?**
- ✅ Centralized user state (accessible anywhere via Redux)
- ✅ Role-based access control (ProtectedRoute prevents unauthorized access)
- ✅ Token stored in Redux (can add localStorage for persistence)
- ❌ **Alternative**: Context API (harder to share across deeply nested components)

---

### Module 2: Shopping Cart (`src/features/cart/`)

**Purpose**: Manage selected products, quantities, and checkout flow

**Files**:

| File | Responsibility |
|------|-----------------|
| `cartSlice.js` | Redux: items array, isOpen toggle, totals |
| `CartDrawer.jsx` | Animated side panel showing cart contents |
| `CartItem.jsx` | Single cart line item (product, qty, remove btn) |
| `useCart.js` | Hook: add/remove/update items |

**State Shape**:
```javascript
cart: {
  items: [
    {
      id: 'cart-item-1',
      product: { id: '123', name: 'T-Shirt', price: 1500 },
      quantity: 2,
      selectedSize: 'L',
      selectedColor: { id: 'red', name: 'Red', hex: '#FF0000' },
      selectedView: { id: 'front', label: 'Front' },
      mockupUrl: 'https://cdn.example.com/mockup.jpg',
      printUrl: 'https://cdn.example.com/print.jpg',
      designJson: '{...}',  // Serialized design from studio
      designId: 'design-1234567890'
    }
  ],
  isOpen: true,  // Drawer visible?
  total: 3000,   // Sum of all items
  itemCount: 2   // Number of unique items
}
```

**Persistence**: Cart items are saved to **localStorage** via redux-persist (excludes `isOpen` state)

**User Flow**:
1. User adds product to cart from ProductCard
2. Cart drawer opens with success toast
3. User can adjust quantity or remove item
4. Clicks "Checkout" → navigates to CheckoutPage
5. Cart persists even after page refresh

**Why?**
- ✅ Persistent storage prevents data loss
- ✅ Drawer animation provides visual feedback
- ✅ Design metadata attached to each item (for print jobs)
- ❌ **Alternative**: Session storage (lost on browser close), Context API (no persistence)

---

### Module 3: Products & RTK Query (`src/features/products/`)

**Purpose**: Fetch, cache, and manage product data from backend API

**Files**:

| File | Responsibility |
|------|-----------------|
| `productsApi.js` | RTK Query endpoints (GET/POST/PUT/DELETE) |
| `productsSlice.js` | Redux: product list, filters, search state |
| `useProducts.js` | Hook: search, filter, sort products |

**RTK Query Pattern**:
```javascript
// Define API endpoints
const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Product'],  // Cache invalidation tags
  endpoints: (builder) => ({
    getProducts: builder.query({...}),
    getProductBySlug: builder.query({...}),
    createProduct: builder.mutation({...}),
    updateProduct: builder.mutation({...}),
    deleteProduct: builder.mutation({...}),
  })
})

// Use in components
const { data: products, isLoading } = useGetProductsQuery({ 
  category: 'tshirt', 
  sort: 'price-asc' 
})

const [createProduct] = useCreateProductMutation()
```

**Why RTK Query over Redux Thunks?**
- ✅ **Automatic caching**: Results cached by query parameters
- ✅ **Cache invalidation**: `tagTypes` system keeps data in sync
- ✅ **Request deduplication**: Multiple identical requests consolidated
- ✅ **Loading/error states**: Automatic, built-in
- ❌ **Thunks**: Manual cache management, verbose error handling
- ❌ **Direct fetch**: No caching, no sync with other components

**Cache Invalidation Example**:
```javascript
// After creating a product, all getProducts queries refetch
createProduct(newProduct).then(() => {
  // RTK Query automatically refetches tagged endpoints
  // No manual cache clearing needed!
})
```

---

### Module 4: Design Studio (`src/features/studio/`)

**Purpose**: Canva-style editor for customizing products with text, images, shapes, and hand-drawn designs

**Core Files**:

| File | Responsibility |
|------|-----------------|
| `studioSlice.js` | Redux: design state, objects, history, UI tools |
| `studioHistoryMiddleware.js` | Custom middleware for undo/redo |
| `studioUtils.js` | Helpers: create/serialize objects, constants |
| `useStudio.js` | Hook: add text/image/shape/brush methods |
| `useUrduFonts.js` | Hook: load Urdu fonts from Google Fonts API |
| **Components/** | |
| `StudioShell.jsx` | Top-level wrapper, product context, confirm flow |
| `StudioCanvas.jsx` | React Konva Stage (main editor canvas) |
| `StudioDock.jsx` | Bottom toolbar (tool selection, zoom) |
| `StudioPropertiesPanel.jsx` | Right sidebar (object properties) |
| `ImageUploadButton.jsx` | Cloudinary upload widget |

**Design Object Structure**:
```javascript
// Text object
{
  id: 'obj-1',
  type: 'text',
  x: 100,
  y: 200,
  width: 300,
  height: 100,
  text: 'Hello Frill',
  fontSize: 48,
  fontFamily: 'Montserrat',
  fontWeight: 'bold',
  fontStyle: 'italic',
  fill: '#3B1F5E',
  opacity: 1,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  skewX: 0,
  skewY: 0,
  locked: false
}

// Image object
{
  id: 'obj-2',
  type: 'image',
  x: 150,
  y: 300,
  width: 200,
  height: 200,
  scaleX: 1,
  scaleY: 1,
  src: 'https://cdn.example.com/image.jpg',
  crop: { offsetX: 0.5, offsetY: 0.5, aspectRatio: 1 },
  filters: { grayscale: false, brightness: 0 },
  rotation: 0,
  skewX: 0,
  skewY: 0,
  opacity: 1,
  locked: false
}

// Shape object
{
  id: 'obj-3',
  type: 'shape',
  shape: 'circle' | 'rect',
  x: 50,
  y: 50,
  width: 100,
  height: 100,
  radius: 50,
  fill: '#C2185B',
  stroke: '#3B1F5E',
  strokeWidth: 2,
  opacity: 1,
  rotation: 0,
  locked: false
}

// Line (brush stroke)
{
  id: 'obj-4',
  type: 'line',
  points: [10, 10, 50, 50, 100, 25],  // [x1, y1, x2, y2, ...]
  stroke: '#111827',
  strokeWidth: 6
}
```

**Undo/Redo System**:

The custom middleware captures **full design snapshots** on every mutation:

```javascript
// Initial state
{
  history: {
    past: [],
    present: { objects: [], background: {...}, ... },
    future: []
  }
}

// User adds text
dispatch(addObject(textObject))
  → Middleware captures snapshot
  → past: [oldDesign]
  → present: { objects: [textObject], ... }

// User clicks undo
dispatch(undo())
  → past: []
  → present: { objects: [], ... }  (restored from past)
  → future: [designWithText]

// Max 30 steps kept in memory to prevent bloat
```

**Why full snapshots?**
- ✅ **Simplicity**: One action = one state change
- ✅ **Reliability**: No need to reverse-engineer changes
- ✅ **Debugging**: Can inspect any historical state
- ❌ **Alternative**: Delta encoding (less memory but harder to implement)
- ❌ **Redux DevTools**: Insufficient for complex nested changes

**Canvas Rendering (React Konva)**:

```jsx
<Stage width={800} height={960} scale={zoom} x={offsetX} y={offsetY}>
  {/* Background Layer */}
  <Layer listening>
    <Rect fill={bgColor} />
    <KonvaImage image={bgImage} />
  </Layer>

  {/* Design Objects Layer */}
  <Layer>
    <Group scale={stageScale} x={offsetX} y={offsetY}>
      {objects.map(obj => {
        if (obj.type === 'text') return <Text {...obj} />
        if (obj.type === 'image') return <KonvaImage {...obj} />
        if (obj.type === 'shape') return <Circle|Rect {...obj} />
      })}
    </Group>
  </Layer>

  {/* UI Overlays (Guides, Print Area Outline) */}
  <Layer listening={false}>
    {/* Guides & print area borders */}
  </Layer>

  {/* Transformer (Resize/Rotate Handles) */}
  <Layer listening={true}>
    <Transformer nodes={[selectedObject]} />
  </Layer>
</Stage>
```

**Why React Konva over Canvas API?**
- ✅ **Declarative**: Component-based, React-friendly
- ✅ **Events**: Built-in touch/mouse handlers
- ✅ **Transforms**: Hardware-accelerated scaling, rotation
- ✅ **Caching**: Optimized rendering via Layer caching
- ❌ **Canvas API**: Imperative, harder to manage state
- ❌ **Fabric.js**: Heavier, not React-optimized, steeper learning curve

**User Interactions**:

| Gesture | Action |
|---------|--------|
| Click object | Select (show transformer handles) |
| Drag object | Move (with snapping guides) |
| Drag handle | Resize/rotate/skew object |
| Two-finger pinch | Zoom in/out canvas |
| Two-finger rotate | Rotate selected object |
| Brush tool + drag | Draw freehand stroke |

---

### Module 5: Products Admin (`src/pages/admin/AdminProductsPage.jsx`)

**Purpose**: CRUD operations for products with nested color/view schema

**Key Features**:
- Create new products with colors and views
- Edit product details, pricing, and images
- Define print areas for each view
- Delete products
- Bulk upload products

**Product Data Structure**:
```javascript
{
  id: 'prod-1',
  slug: 'premium-tshirt',
  name: 'Premium T-Shirt',
  vendor: 'Frill Custom Apparel',
  category: 'tshirt',
  price: 1500,
  oldPrice: 2000,
  description: 'High-quality cotton t-shirt',
  longDesc: 'Detailed product description...',
  stars: 4.5,
  reviews: 120,
  images: ['url1', 'url2'],
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  
  // ← NESTED SCHEMA (v2 upgrade)
  colors: [
    {
      id: 'color-red',
      name: 'Red',
      hex: '#FF0000',
      images: ['red-mockup.jpg'],  // Product mockup in this color
      views: [
        {
          id: 'view-front',
          label: 'Front',
          image: 'red-front.jpg',
          printArea: {
            x: 170, y: 180, width: 480, height: 520
          }
        },
        {
          id: 'view-back',
          label: 'Back',
          image: 'red-back.jpg',
          printArea: {
            x: 170, y: 180, width: 480, height: 520
          }
        }
      ]
    },
    {
      id: 'color-blue',
      name: 'Blue',
      hex: '#0000FF',
      images: ['blue-mockup.jpg'],
      views: [...]
    }
  ]
}
```

---

## Features & Functionality

### 1. Storefront (Customer-Facing)

**Homepage** (`HomePage.jsx`)
- Hero section with featured products
- Product grid with filters
- Newsletter signup
- Testimonials carousel

**Collection Page** (`CollectionPage.jsx`)
- Searchable product catalog
- Filters: category, price range, size, color
- Sort options: popularity, price, newest
- Grid/list view toggle
- Infinite scroll or pagination

**Product Detail Page** (`ProductDetailPage.jsx`)
- Large product image with zoom
- Color/size/view selector (with live mockup)
- Quantity selector
- "Design Your Own" button → launches StudioPage
- Reviews & ratings
- Related products carousel
- Add to cart button

**Cart Page** (`CartPage.jsx`)
- Line-item table (product, qty, price)
- Update quantity, remove item
- Promo code input
- Summary (subtotal, tax, shipping)
- "Proceed to Checkout" button

**Checkout Page** (`CheckoutPage.jsx`)
- Billing address form
- Shipping method selection
- Payment method (Stripe/PayPal)
- Order review before payment
- Payment processing

**Account Page** (`AccountPage.jsx`)
- User profile info (name, email, phone)
- Order history
- Saved addresses
- Password change
- Preferences & notifications

**Contact Page** (`ContactPage.jsx`)
- Contact form (name, email, message)
- Support email/phone
- Store location map

### 2. Design Studio (Core Differentiator)

**Entry Point**: ProductDetailPage → "Customize" button → DesignStudioPage

**Tools**:
- **Select Tool**: Click to select, drag to move, handles to resize/rotate
- **Text Tool**: Add text, change font/size/weight/color, support for Urdu fonts
- **Image Tool**: Upload from computer or URL, apply filters (grayscale, brightness), crop
- **Shape Tool**: Add circles, rectangles with fill/stroke customization
- **Brush Tool**: Free-hand drawing with adjustable brush size/color
- **Eraser Tool**: Remove strokes (implemented as brush with white color)

**UI Components**:
- **Top Bar**: Back button, undo/redo, zoom in/out, snapping toggle
- **Canvas**: React Konva Stage with draggable objects
- **Bottom Dock** (Mobile): Tool selection, quick actions
- **Right Sidebar** (Desktop): Object properties (text, fill, opacity, etc.)
- **Color/View Selector**: Switch between product colors/views for real-time mockup

**Export Options**:
- **Mockup**: High-res image (pixelRatio: 3) for print production
- **Preview**: Web-res image (pixelRatio: 1) for cart/mockup display
- **Design JSON**: Serialized object data for future editing

**Confirm Flow**:
1. User clicks "Confirm Design" button
2. System exports mockup & preview images
3. Serializes design to JSON
4. Adds item to cart with all design metadata
5. Shows success toast notification
6. Opens cart drawer
7. Navigates back to product page after 1.5s

### 3. Admin Panel (Store Management)

**Dashboard** (`AdminDashboardPage.jsx`)
- Sales overview (today, month, year)
- Revenue chart
- Recent orders list
- Top products
- Quick stats (new customers, pending orders)

**Products Management** (`AdminProductsPage.jsx`)
- Full CRUD interface
- Nested color/view editor
- Print area customization
- Bulk upload support
- Image management

**Orders Management** (`AdminOrdersPage.jsx`)
- Orders table with filters/search
- Order status workflow (pending → shipped → delivered)
- Print labels generation
- Export to CSV
- Tracking integration

**Customers Management** (`AdminCustomersPage.jsx`)
- Customer list with search
- Account status (active, suspended, etc.)
- Order history per customer
- Email/phone directory
- Signup date tracking

**Designs Management** (`AdminDesignsPage.jsx`)
- Browse user-submitted designs
- Approve/reject for gallery
- Export design as JSON/image
- View designer analytics

**Settings** (`AdminSettingsPage.jsx`)
- Store name, email, phone
- Currency selection
- Notification preferences
- Payment gateway config
- Email templates

---

## User Flows

### Flow 1: First-Time Purchase with Custom Design

```
1. DISCOVERY
   └─ Visit homepage
      ├─ Browse featured products
      └─ Click on product card

2. PRODUCT DETAIL
   └─ View product details
      ├─ Select color, size, view
      ├─ See live mockup update
      └─ Click "Customize This" button

3. DESIGN STUDIO
   └─ Studio page loads
      ├─ Canvas shows product mockup
      ├─ Click text tool → add text
      ├─ Upload image → place on design
      ├─ Draw with brush tool
      ├─ Switch colors to see different mockups
      └─ Click "Confirm Design" button

4. CONFIRM & CART
   └─ Toast shows "Design added!"
      ├─ Cart drawer opens
      ├─ Design preview visible in cart
      └─ Continue shopping or checkout

5. CHECKOUT
   └─ User enters shipping address
      ├─ Selects shipping method
      ├─ Enters payment details
      └─ Places order

6. ORDER CONFIRMATION
   └─ Email sent with order details
      ├─ Design image (mockup)
      ├─ Tracking link
      └─ Support contact info
```

**Decision Points**:
- ❌ "Back to Store" → Return to collection
- ❌ "Continue Shopping" → Browse more products
- ✅ "Checkout Now" → Proceed to payment

### Flow 2: Returning Customer (Browse Without Design)

```
1. HOMEPAGE
   └─ User logs in
      ├─ Session restored from localStorage

2. COLLECTION
   └─ Browse products
      ├─ Filter by category/price
      ├─ Search by name
      └─ Click product

3. PRODUCT DETAIL
   └─ View product
      ├─ Add to cart (no customization)
      └─ See existing order (if purchased before)

4. CART
   └─ User has items
      ├─ Adjust quantities
      ├─ Remove items
      └─ Checkout

5. CHECKOUT (Faster)
   └─ Address pre-filled from previous order
      ├─ Confirm shipping
      ├─ Select payment method
      └─ Place order
```

### Flow 3: Browse & Abandon Cart

```
1-2. HOMEPAGE → COLLECTION → PRODUCT
   └─ User browses

3. ADD TO CART
   └─ Item added, drawer opens

4. CLOSE DRAWER
   └─ User clicks X

5. NAVIGATE AWAY
   └─ User closes browser (cart persists!)

6. RETURN LATER
   └─ User revisits site
      ├─ Cart still there (localStorage)
      ├─ Can continue checkout
      └─ Or add more items
```

**Why cart persists?**
- ✅ Reduces friction (no re-shopping needed)
- ✅ Increases conversion (users remember cart)
- ✅ Better UX (seamless experience)

### Flow 4: Gift Purchase

```
1. PRODUCT DETAIL
   └─ Select product

2. CUSTOMIZE
   └─ Add recipient's name/message via design studio

3. CHECKOUT
   └─ Shipping address = gift recipient
      ├─ Billing address = purchaser
      └─ Add gift message (optional)

4. CONFIRMATION
   └─ Receipt to purchaser email
      └─ Tracking sent to recipient (optional)
```

---

## Admin Flows

### Flow 1: Onboard New Product

```
1. ADMIN DASHBOARD
   └─ Click "Add Product" button

2. PRODUCT FORM
   └─ Enter basic info
      ├─ Name: "Classic T-Shirt"
      ├─ Category: "tshirt"
      ├─ Price: 1500 PKR
      ├─ Description
      └─ Upload main image

3. ADD COLORS
   └─ Click "Add Color"
      ├─ Color name: "Red"
      ├─ Hex code: #FF0000
      ├─ Upload color variant image
      └─ Save color

4. ADD VIEWS FOR COLOR
   └─ Click "Add View"
      ├─ Label: "Front"
      ├─ Upload view image
      ├─ Draw print area (outline on image)
      │  └─ System auto-generates coordinates
      ├─ Repeat for "Back", "Sleeve"
      └─ Save view

5. PUBLISH PRODUCT
   └─ Click "Publish"
      ├─ Product visible on storefront
      └─ Customers can customize

6. MONITORING
   └─ Admin can see
      ├─ Product views (analytics)
      ├─ Customizations created
      └─ Orders for this product
```

### Flow 2: Manage Orders

```
1. ORDERS PAGE
   └─ See all orders in table
      ├─ Sortable by date, status, customer
      └─ Searchable by order ID

2. ORDER DETAIL
   └─ Click order row
      ├─ Show customer info
      ├─ Show design images (mockup + preview)
      ├─ Show product details
      ├─ Show dimensions for print setup
      └─ Actions: ship, cancel, refund

3. PREPARE FOR PRINT
   └─ Admin selects order
      ├─ Download high-res mockup image
      ├─ Send to print shop/fulfill
      └─ Mark status "Shipped"

4. TRACKING
   └─ Admin enters tracking number
      ├─ Customer receives email with tracking
      └─ Customer can track delivery

5. DELIVER
   └─ Order marked "Delivered"
      ├─ Customer receives confirmation
      └─ Can leave review
```

### Flow 3: Review Customer Designs

```
1. DESIGNS PAGE
   └─ See all designs users created
      ├─ Filter: approved, pending, rejected
      └─ Sort by date, customer name

2. VIEW DESIGN
   └─ Click design thumbnail
      ├─ See design image
      ├─ See design JSON (editable)
      ├─ See creator info
      ├─ See orders with this design
      └─ Actions: approve, reject, edit

3. APPROVE DESIGN
   └─ Admin clicks "Approve"
      ├─ Design added to gallery
      ├─ Customers can see as inspiration
      └─ Designer gets notification (optional)

4. REJECT DESIGN
   └─ Admin clicks "Reject" + comment
      ├─ Design hidden
      ├─ Designer notified (optional)
      └─ Feedback provided
```

### Flow 4: Manage Store Settings

```
1. SETTINGS PAGE
   └─ Admin navigates to settings

2. EDIT STORE INFO
   ├─ Store name
   ├─ Email address
   ├─ Phone number
   ├─ Currency (PKR, USD, EUR)
   └─ Save changes

3. NOTIFICATION SETTINGS
   ├─ Email on new order
   ├─ Email on customer review
   ├─ Email on design submission
   └─ Toggle on/off

4. PAYMENT SETTINGS
   ├─ Stripe API key
   ├─ PayPal credentials
   ├─ Test mode / Live mode
   └─ Save

5. TAX SETTINGS
   ├─ Tax rate (%)
   ├─ Apply to shipping
   ├─ Exempt categories
   └─ Save
```

---

## State Management

### Redux Store Structure

```javascript
store = {
  cart: {
    items: [
      {
        id: 'cart-1',
        product: {...},
        quantity: 1,
        selectedSize: 'L',
        selectedColor: {...},
        selectedView: {...},
        mockupUrl: '...',
        printUrl: '...',
        designJson: '...'
      }
    ],
    isOpen: false,
    total: 1500,
    itemCount: 1
  },

  auth: {
    user: { id, name, email, role },
    token: 'jwt...',
    isLoading: false,
    error: null
  },

  studio: {
    history: {
      past: [...],
      present: { objects, background, stage, ui },
      future: [...]
    },
    ui: {
      tool: 'select',
      activeObjectId: 'obj-1',
      brush: { color: '#000', size: 6 },
      keyboardLayout: 'qwerty',
      zoom: 1,
      snapping: true
    }
  },

  productsApi: {
    queries: {
      'getProducts({"category":"tshirt"})': {
        status: 'fulfilled',
        data: [...],
        error: null
      },
      'getProductBySlug({"slug":"classic-tshirt"})': {
        status: 'fulfilled',
        data: {...},
        error: null
      }
    },
    mutations: {...}
  }
}
```

### Middleware Stack

```
Redux Thunk (default)
  ↓
RTK Query Middleware (productsApi)
  ↓
Studio History Middleware (custom)
  ↓
Redux DevTools (browser extension)
  ↓
Redux Persist (cart only, to localStorage)
```

---

## File-by-File Documentation

### `/src/main.jsx`
**Purpose**: Application entry point, sets up React root and Redux store

**Stack Order** (important!):
1. `StrictMode` — Catches side effects in development
2. `Provider` — Redux store (global state)
3. `PersistGate` — Waits for persisted state to hydrate
4. `App` — Router and components

### `/src/App.jsx`
**Purpose**: Route configuration with code-splitting

**Key Features**:
- ✅ Uses `lazy()` to code-split each page (loads on demand)
- ✅ `Suspense` boundary with `PageLoader` fallback
- ✅ Route protection via `ProtectedRoute`
- ✅ Nested routes (admin under `/admin`, storefront under `/`)

**Routes**:
```
/                           → HomePage
/collections                → CollectionPage
/product/:slug              → ProductDetailPage
/design/:productId          → DesignStudioPage
/cart                       → CartPage
/checkout                   → CheckoutPage
/account                    → AccountPage
/contact                    → ContactPage
/privacy                    → PrivacyPage
/terms                      → TermsPage

/auth/login                 → LoginPage
/auth/signup                → SignupPage
/auth/forgot-password       → ForgotPasswordPage

/admin                      → ProtectedRoute → AdminDashboard
/admin/products             → ProtectedRoute → AdminProductsPage
/admin/orders               → ProtectedRoute → AdminOrdersPage
/admin/customers            → ProtectedRoute → AdminCustomersPage
/admin/designs              → ProtectedRoute → AdminDesignsPage
/admin/settings             → ProtectedRoute → AdminSettingsPage

*                           → NotFoundPage (404)
```

### `/src/store/index.js`
**Purpose**: Redux store configuration

**What it does**:
- Combines all reducers (auth, cart, studio, productsApi)
- Sets up middleware (thunk, RTK Query, custom history middleware)
- Configures persistence (cart saved to localStorage)
- Creates persistor (redux-persist)
- Exports `store` and `persistor` for use in main.jsx

**Persistence Config**:
```javascript
cartPersistConfig = {
  key: 'frill_cart',
  storage: localStorage,
  blacklist: ['isOpen']  // Don't persist drawer state
}
```

### `/src/features/auth/authSlice.js`
**Purpose**: Redux slice for user authentication state

**State**:
- `user` — Current user object (or null if logged out)
- `token` — JWT token from server
- `isLoading` — Loading state during login
- `error` — Error message if login failed

**Actions**:
- `setUser(user)` — Store user after login
- `clearUser()` — Clear user on logout
- `setError(error)` — Set error message

### `/src/features/auth/ProtectedRoute.jsx`
**Purpose**: HOC to guard admin/sensitive pages from unauthorized access

**Usage**:
```jsx
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>

// If user not logged in or doesn't have role:
// → Redirects to /auth/login
```

**Implementation**:
1. Get current user from Redux
2. Check if user exists and has required role
3. If yes → render children
4. If no → navigate to /auth/login or show 403 error

### `/src/features/cart/cartSlice.js`
**Purpose**: Redux slice for shopping cart state

**Actions**:
- `addItem(cartItem)` — Add product to cart
- `removeItem(id)` — Remove by cart item ID
- `updateQuantity({ id, quantity })` — Update qty
- `clearCart()` — Remove all items
- `openCart()` — Show drawer
- `closeCart()` — Hide drawer

**Selectors**:
- `selectCartItems` — All items
- `selectCartTotal` — Sum of all prices
- `selectCartOpen` — Is drawer visible?

### `/src/features/products/productsApi.js`
**Purpose**: RTK Query API slice for product operations

**Endpoints**:

| Name | Type | Params | Returns |
|------|------|--------|---------|
| `getProducts` | Query | `{ category?, search?, sort? }` | `Product[]` |
| `getProductBySlug` | Query | `{ slug }` | `Product` |
| `createProduct` | Mutation | `{ name, price, ... }` | `Product` |
| `updateProduct` | Mutation | `{ id, updates }` | `Product` |
| `deleteProduct` | Mutation | `{ id }` | `{ success: true }` |

**Example Usage**:
```javascript
const { data: products, isLoading, error } = useGetProductsQuery({
  category: 'tshirt'
})

const [createProduct] = useCreateProductMutation()
await createProduct({ name: 'New Shirt', price: 1500 })
  // Automatically refetches getProducts queries (cache invalidation)
```

### `/src/features/studio/studioSlice.js`
**Purpose**: Redux slice for design studio state (objects, tools, history)

**State**:
```javascript
{
  history: { past, present, future },
  ui: {
    tool, activeObjectId, brush, zoom, snapping
  }
}
```

**Key Actions**:
- `addObject(object)` — Add text/image/shape to canvas
- `updateObject({ id, changes })` — Modify object properties
- `removeObject(id)` — Delete object
- `setTool(toolName)` — Select tool (select/text/image/brush)
- `setActiveObject(id)` — Select object on canvas
- `undo()` — Go back one step
- `redo()` — Go forward one step

### `/src/features/studio/studioHistoryMiddleware.js`
**Purpose**: Custom Redux middleware to capture design snapshots for undo/redo

**How it works**:
1. Listener detects design mutations (addObject, updateObject, etc.)
2. Captures current `present` state → saves to `past`
3. New change becomes `present`
4. Clears `future` array
5. Maintains max 30 snapshots (to prevent memory bloat)

**Why custom middleware?**
- ✅ Captures full state snapshots (simple, reliable)
- ✅ Works with all mutations without additional code
- ✅ Can be extended for other features
- ❌ Alternative: Manual dispatch of history actions (verbose, error-prone)

### `/src/features/studio/useStudio.js`
**Purpose**: Custom hook providing methods to modify design studio state

**Methods**:
```javascript
const {
  addText,
  addUrduText,
  addImage,
  addShape,
  addBrush,
  removeSelected,
  setTool,
  setKeyboardLayout,
  undo,
  redo,
  clearDesign
} = useStudio()

addText('Hello')        // Create text object at center
addImage(url)           // Upload image
addShape('circle')      // Add circle
addBrush()              // Switch to brush tool
undo()                  // Go back one step
```

### `/src/features/studio/useUrduFonts.js`
**Purpose**: Load and manage Urdu font from Google Fonts API

**Features**:
- Dynamically loads font on component mount
- Adds to document head as `<link>` tag
- Provides font list for Urdu text
- Caches loaded fonts in state

**Usage**:
```javascript
const { urduFonts, isLoading } = useUrduFonts()
// Use in text tool font selector
```

### `/src/features/studio/studioUtils.js`
**Purpose**: Utility functions for design studio

**Functions**:

| Function | Purpose |
|----------|---------|
| `createTextObject(overrides)` | Generate text object with defaults |
| `createImageObject(overrides)` | Generate image object |
| `createShapeObject(shape)` | Generate shape (circle/rect) |
| `createLineObject(points, stroke)` | Generate brush stroke |
| `serializeDesign(design)` | Convert design to JSON for storage |
| `parseDesign(json, fallback)` | Deserialize JSON back to design |
| `clamp(value, min, max)` | Constrain number within range |

### `/src/features/studio/components/StudioCanvas.jsx`
**Purpose**: Main React Konva canvas component for rendering design

**Key Features**:
- Renders Konva Stage with multiple layers (background, objects, UI, transformer)
- Handles mouse/touch events (click, drag, two-finger gestures)
- Manages snapping guides when dragging objects
- Transformer with resize/rotate/skew handles
- Brush stroke drawing

**Layers**:
1. **Background Layer** — Product color & image
2. **Design Layer** — Text, images, shapes
3. **UI Layer** — Guides, print area outline (non-interactive)
4. **Transformer Layer** — Resize handles (interactive)

**Why Konva?**
- ✅ Canvas objects become manipulable (not just rendered)
- ✅ Touch gestures out-of-the-box
- ✅ Layer system for organization
- ✅ Export to PNG/dataURL built-in

### `/src/features/studio/components/StudioShell.jsx`
**Purpose**: Top-level studio wrapper, manages product context and confirm flow

**Responsibilities**:
- Product loading (getProductBySlug)
- Color/view/size selection
- Toolbar (undo/redo, zoom, tool selection)
- Properties panel on right (desktop)
- Dock at bottom (mobile)
- Confirm design flow (export + add to cart)

**Key Function**: `handleConfirmDesign()`
```javascript
function handleConfirmDesign() {
  // Export high-res mockup & preview images
  const { printUrl, mockupUrl } = exportDesign()
  
  // Serialize design to JSON
  const designJson = serializeDesign(design)
  
  // Add to cart with all metadata
  dispatch(addItem({
    product, quantity, selectedColor, selectedView,
    mockupUrl, printUrl, designJson
  }))
  
  // UX feedback
  toast.success('Design added to cart!')
  dispatch(openCart())
  navigate('/collections', { delay: 1500ms })
}
```

### `/src/pages/storefront/ProductDetailPage.jsx`
**Purpose**: Single product view with color/size selector and customization

**Features**:
- Product details (name, price, description)
- Color selector with live image preview
- Size selector (XS-XXL)
- View selector (Front/Back/Sleeve) with print area outline
- "Customize This" button → DesignStudioPage
- Add to cart button (no customization)
- Reviews & ratings section
- Related products carousel

**State**:
- `selectedColor` — Active color ID
- `selectedView` — Active view ID
- `selectedSize` — Active size
- `quantity` — Units to add to cart

### `/src/pages/admin/AdminProductsPage.jsx`
**Purpose**: Product CRUD interface for admins

**Features**:
- Create new product
- Edit existing product (details, pricing, images)
- Add/edit colors with nested views
- Define print areas for each view
- Delete products
- Bulk upload from CSV/JSON

**Product Form Structure**:
```
Basic Info (name, category, price, vendor)
  ↓
Image Upload (main product image)
  ↓
Colors (color array)
  └─ Color Details (name, hex, image)
      ↓
      Views (view array)
      └─ View Details (label, image, print area)
              ↓
              Print Area (x, y, width, height coordinates)
```

### `/src/components/atoms/Button.jsx`
**Purpose**: Reusable button component with variants

**Variants**:
- `primary` — Purple background, white text
- `secondary` — Magenta background
- `outline` — Border only, transparent background
- `ghost` — No background, text only

**Props**:
```jsx
<Button 
  variant="primary"     // Button style
  size="md"             // sm | md | lg
  isLoading={false}     // Show spinner
  disabled={false}      // Disabled state
  onClick={handleClick}
>
  Click Me
</Button>
```

### `/src/components/organisms/SiteHeader.jsx`
**Purpose**: Top navigation bar with logo, menu, search, cart

**Components**:
- Logo (links to home)
- Navigation menu (categories, about, contact)
- Search bar
- Account dropdown
- Cart icon with item count badge

**Responsive**:
- Desktop: Full menu visible
- Mobile: Hamburger icon, opens `MobileDrawer`

### `/src/components/organisms/CartDrawer.jsx`
**Purpose**: Animated side panel showing cart contents

**Features**:
- Smooth slide-in animation (Framer Motion)
- Cart items list with images
- Adjust quantity per item
- Remove item button
- Cart total
- "Checkout Now" button
- "Continue Shopping" button

**Behavior**:
- Opens/closes on `isOpen` state
- Click overlay to close
- Persists on page navigation

### `/src/hooks/useToast.js`
**Purpose**: Lightweight toast notification system

**Usage**:
```javascript
const toast = useToast()
toast.success('Design added!')
toast.error('Upload failed')
toast.info('Please log in')
```

**Features**:
- Auto-removes after 2.8 seconds
- Multiple toasts stack vertically
- Tone variants: success (green), error (red), default (blue)
- Appears at bottom-right of screen

### `/src/tailwind.config.js`
**Purpose**: Tailwind CSS theme configuration

**Customizations**:
- Brand colors: purple, magenta, cream
- Font families: Montserrat (headings), Inter (body), Noto Nastaliq Urdu
- Border radius: `frill` (8px), `frill-lg` (16px)
- Box shadows: `frill-sm`, `frill-md`, `frill-lg`, `frill-xl`
- Animations: marquee, float-y, pulse-dot, fade-in-up, slide-in-right

**Custom Utilities** (`@layer components`):
```css
.section-inner { max-width: 1200px; margin: auto; padding: 0 1rem; }
.btn-primary { @apply px-4 py-2 bg-purple text-white rounded-frill font-bold; }
```

### `/src/styles/globals.css`
**Purpose**: Global styles, CSS variables, component layer utilities

**Sections**:
1. CSS Custom Properties (mirrors Tailwind tokens)
2. @layer base (reset, typography)
3. @layer components (reusable utilities)
4. @layer utilities (edge cases)

### `/src/utils/cn.js`
**Purpose**: Conditional classNames utility

**Why?**
- Combines `clsx` (conditionals) + `tailwind-merge` (deduplication)
- Prevents conflicting Tailwind classes

**Usage**:
```javascript
const buttonClass = cn(
  'px-4 py-2 rounded-frill font-bold',
  isActive && 'bg-purple text-white',
  !isActive && 'bg-gray-100 text-gray-800',
  className  // Accept custom class override
)
```

### `/src/utils/currency.js`
**Purpose**: Format prices in Pakistani Rupee (PKR)

**Function**:
```javascript
formatPKR(1500)  // "Rs. 1,500"
formatPKR(1500.50)  // "Rs. 1,500.50"
```

### `/src/data/products.mock.js`
**Purpose**: Mock product data for development before backend ready

**Data**:
- ~50 sample products
- Categories: tshirt, hoodie, polo, shirt
- Nested colors/views structure
- Realistic pricing (1000-3000 PKR)
- Image URLs point to Cloudinary CDN

**Why mock?**
- ✅ Frontend can work independently
- ✅ Consistent test data
- ✅ Easy to extend for features

---

## Advanced Topics

### Code-Splitting Strategy

Vite automatically code-splits routes:

```javascript
// App.jsx
const HomePage = lazy(() => import('./pages/storefront/HomePage'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboardPage'))

// Each page loads on demand when route navigated to
```

**Bundle Analysis**:
```
dist/
├── index.js (main bundle, ~127 KB gzip)
├── redux.js (Redux + RTK Query, ~25 KB)
├── framer.js (Framer Motion animations, ~43 KB)
├── DesignStudioPage.js (Studio + Konva, ~102 KB)
└── [other pages] (loaded on demand)
```

### RTK Query Cache Invalidation

```javascript
// After creating a product, invalidate getProducts cache
createProduct(newProduct).unwrap().then(() => {
  // RTK Query AUTOMATICALLY refetches all getProducts queries
  // because 'createProduct' mutation has tagTypes: ['Product']
  // and getProducts has provideTags: ['Product']
})

// Granular invalidation by tag
// Tag by ID: provideTags: (result) => [{ type: 'Product', id: result.id }]
// Only refetch that specific product
```

### Custom Middleware Pattern

```javascript
// studioHistoryMiddleware.js
export const studioHistoryMiddleware = (store) => (next) => (action) => {
  // Before action
  const prevState = store.getState()
  
  // Execute action
  next(action)
  
  // After action
  const nextState = store.getState()
  
  // Capture snapshot if design changed
  if (isDesignMutation(action)) {
    captureSnapshot(prevState.studio.history.present)
  }
}

// Benefits:
// - Intercepts all mutations in one place
// - No need to manually dispatch history actions
// - Works with any new mutations added later
```

### Gesture Handling in Canvas

```javascript
// Two-finger pinch zoom
const handleTouchStart = (event) => {
  if (event.evt.touches.length !== 2) return
  
  const touch1 = event.evt.touches[0]
  const touch2 = event.evt.touches[1]
  
  // Calculate distance between fingers
  const distance = Math.hypot(
    touch1.clientX - touch2.clientX,
    touch1.clientY - touch2.clientY
  )
  
  pinchRef.current = { distance, initialZoom: ui.zoom }
}

const handleTouchMove = (event) => {
  if (event.evt.touches.length !== 2) return
  
  const touch1 = event.evt.touches[0]
  const touch2 = event.evt.touches[1]
  const currentDistance = Math.hypot(...)
  
  // Calculate zoom ratio
  const ratio = currentDistance / pinchRef.current.distance
  const newZoom = pinchRef.current.initialZoom * ratio
  
  dispatch(setZoom(newZoom))
}
```

---

## Performance Optimizations

### 1. Code-Splitting
- Each page lazy-loaded only when navigated to
- Reduces initial bundle size

### 2. Image Optimization
- Images served from Cloudinary with optimizations
- Responsive image sizes via width/height props

### 3. Redux Selectors
- Memoized selectors (reselect pattern) prevent unnecessary re-renders
- Only re-render if selected state actually changed

### 4. Konva Layer Caching
- Background layer cached (rarely changes)
- Objects layer drawn on demand
- UI layer non-interactive (listening={false})

### 5. Debouncing
- Search input debounced 300ms
- Prevents excessive filter/sort recalculations

### 6. Virtualization (Future)
- Product grid can use react-window for 1000+ items
- Only render visible items in viewport

---

## Testing Strategy

**Test Pyramid**:
```
        /\
       /E2E\         (Cypress) — Full user flows
      /-----\
     /Unit & \       (Jest) — Components, utils, hooks
    /Integration\
   /____________\
```

**Test Files**:
- `src/features/auth/auth.test.js` — Auth logic, role guards
- Component `.test.js` files — Unit tests for atoms, molecules
- Integration tests for feature modules

---

## Deployment

### Development
```bash
npm run dev   # Vite dev server (port 3000)
```

### Production Build
```bash
npm exec vite build  # Generates dist/
```

### Environment Variables
```
VITE_API_URL=https://api.frill.pk
VITE_CLOUDINARY_CLOUD_NAME=frill-pk
VITE_STRIPE_KEY=pk_live_...
```

---

## Summary

**Frill React** is a full-featured e-commerce platform combining:
- 🛍️ **Storefront**: Browse, search, filter, add to cart
- 🎨 **Design Studio**: Canva-style customization with react-konva
- 👨‍💼 **Admin Panel**: Product/order/customer management
- 📦 **State Management**: Redux + RTK Query for optimal caching
- 🎯 **Performance**: Code-splitting, lazy loading, optimized rendering
- 🌍 **Global UX**: Responsive design, smooth animations, toast notifications

The architecture prioritizes **scalability**, **maintainability**, and **performance** through proven patterns and modern tooling.

