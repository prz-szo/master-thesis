import fetcher from '@common/utils/fetcher';
import { CategoriesQueryKey } from '@modules/category';
import { Product, ProductsListResponse } from '@modules/product';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

export const categoryProductsFetcher: QueryFunction<Product[]> = ({
  queryKey,
}) =>
  fetcher
    .get<ProductsListResponse>({
      url: `/products/category/${queryKey[1]}?limit=20`,
    })
    .then((res) => res[0]?.products ?? []);

export const useCategoryProducts = () => {
  const router = useRouter();
  const { id = '' } = router.query as { id: string };

  const { data: categoryProducts } = useQuery({
    queryKey: [CategoriesQueryKey, id],
    initialData: [],
    enabled: !!id,
    queryFn: categoryProductsFetcher,
  });

  return useMemo(
    () => ({ categoryProducts, category: id }),
    [categoryProducts, id]
  );
};
