import fetcher from '@common/utils/fetcher';
import { CategoriesQueryKey } from '@modules/category';
import { Product, ProductsListResponse } from '@modules/product';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const categoryProductsFetcher: QueryFunction<Product[]> = ({
  queryKey,
}) =>
  fetcher
    .get<ProductsListResponse>({
      url: `/products/category/${queryKey[1]}?limit=20`,
    })
    .then((res) => res[0]?.products ?? []);

export const useCategoryProducts = (category = '') => {
  const { data: categoryProducts, isLoading: areProductsLoading } = useQuery({
    queryKey: [CategoriesQueryKey, category],
    enabled: !!category,
    queryFn: categoryProductsFetcher,
  });

  console.log(category);

  return useMemo(
    () => ({
      categoryProducts: categoryProducts ?? [],
      category,
      areProductsLoading,
    }),
    [areProductsLoading, categoryProducts, category]
  );
};
