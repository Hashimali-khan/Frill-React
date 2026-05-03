import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE,
         PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import cartReducer    from '@/features/cart/cartSlice'
import authReducer    from '@/features/auth/authSlice'
import studioReducer from '@/features/studio/studioSlice'
import { studioHistoryMiddleware } from '@/features/studio/studioHistoryMiddleware'
import { productsApi } from '@/features/products/productsApi'

/* Only cart persists to localStorage */
const cartPersistConfig = {
  key: 'frill_cart', storage,
  // Don't persist the drawer open/closed state
  blacklist: ['isOpen'],
}

const rootReducer = combineReducers({
  cart:                  persistReducer(cartPersistConfig, cartReducer),
  auth:                  authReducer,
  studio:                studioReducer,
  [productsApi.reducerPath]: productsApi.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) =>
    getDefault({
      // These action types from redux-persist should not trigger serialization warning
      serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
    }).concat(productsApi.middleware, studioHistoryMiddleware),
})

export const persistor = persistStore(store)