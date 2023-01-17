import fetcher from '@common/utils/fetcher';
import { CategoriesQueryKey } from '@modules/category';
import { QueryFunction, useQuery } from '@tanstack/react-query';
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

export const categoryProductsFetcher: QueryFunction<Product[]> = ({
  queryKey,
}) =>
  fetcher
    .get<{ products: Product[] }>({
      url: `/products/category/${queryKey[1]}`,
    })
    .then((res) => res[0]?.products ?? []);

export const useCategoryProducts = (category = '') => {
  const { data: categoryProducts, isLoading: areProductsLoading } = useQuery({
    queryKey: [CategoriesQueryKey, category],
    enabled: !!category,
    queryFn: categoryProductsFetcher,
  });

  return useMemo(
    () => ({
      categoryProducts: categoryProducts ?? [],
      category,
      areProductsLoading,
    }),
    [areProductsLoading, categoryProducts, category]
  );
};
