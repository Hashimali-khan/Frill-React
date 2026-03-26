import { combineReducers } from 'redux';
import cart from '@/features/cart/cartSlice';
import auth from '@/features/auth/authSlice';
import products from '@/features/products/productsSlice';
import studio from '@/features/design-studio/studioSlice';

export default combineReducers({ cart, auth, products, studio });
