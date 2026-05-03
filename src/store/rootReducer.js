import { combineReducers } from 'redux';
import cart from '@/features/cart/cartSlice';
import auth from '@/features/auth/authSlice';
import products from '@/features/products/productsSlice';
import studio from '@/features/studio/studioSlice';
import { productsApi } from '@/features/products/productsApi';

export default combineReducers({
	cart,
	auth,
	products,
	studio,
	[productsApi.reducerPath]: productsApi.reducer,
});
