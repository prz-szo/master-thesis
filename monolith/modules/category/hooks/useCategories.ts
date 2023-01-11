import fetcher from '@common/utils/fetcher';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const CategoriesQueryKey = 'categories';
export const categoriesFetcher = () =>
  fetcher
    .get<string[]>({ url: '/products/categories' })
    .then((res) => res[0] ?? []);

export const useCategories = () => {
  const { data: categories } = useQuery({
    queryKey: [CategoriesQueryKey],
    initialData: [],
    queryFn: categoriesFetcher,
  });

  return useMemo(
    () => ({
      categories,
    }),
    [categories]
  );
};
