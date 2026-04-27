import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import './styles/globals.css'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '@/store'


/**
 * Provider order matters:
 * 1. StrictMode  — catches side effects in dev
 * 2. Redux Provider — global state (cart, auth, products)
 * 3. App — which contains RouterProvider
 *
 * Note: React Router v7's RouterProvider handles its own
 * context internally, so it doesn't need to wrap Provider.
 */

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
)

