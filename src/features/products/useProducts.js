import { useSelector } from 'react-redux';

export function useProducts() { const products = useSelector(s => s.products.list); return { products }; }
