import { fetcher } from '@common/utils';
import { Product, ProductsQueryKey } from '@modules/product';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

export const productFetcher: QueryFunction<Product | null> = ({ queryKey }) =>
  fetcher
    .get<Product>({ url: `/products/${queryKey[1]}` })
    .then((res) => res[0]);

export const useSingleProduct = () => {
  const router = useRouter();

  const { data: product } = useQuery({
    queryKey: [ProductsQueryKey, router.query.id],
    enabled: !!router.query.id,
    queryFn: productFetcher,
  });

  return useMemo(() => ({ product }), [product]);
};
