import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { productsApi } from '@/features/products/productsApi';

const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(productsApi.middleware),
});
export { store };
export default store;
