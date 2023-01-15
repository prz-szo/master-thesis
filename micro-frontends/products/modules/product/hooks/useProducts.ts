import { Paging } from '@common/types';
import fetcher from '@common/utils/fetcher';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsListResponse extends Paging {
  products: Product[];
}

export const ProductsQueryKey = 'products';
export const getProducts = () =>
  fetcher
    .get<ProductsListResponse>({ url: '/products' })
    .then((res) => res[0]?.products ?? []);

export const useProducts = () => {
  // TODO: Add pagination
  const { data: products, isLoading } = useQuery({
    queryKey: [ProductsQueryKey],
    initialData: [],
    queryFn: getProducts,
  });

  return useMemo(() => ({ products, isLoading }), [products, isLoading]);
};
