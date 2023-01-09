import { capitalize } from '@common/utils';
import fetcher from '@common/utils/fetcher';
import { ProductCard } from '@modules/product';
import { QueryClient } from '@tanstack/query-core';
import { dehydrate, QueryFunction, useQuery } from '@tanstack/react-query';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Product, ProductsListResponse } from '../products';
import { CategoriesQueryKey } from './index';

const getProduct: QueryFunction<Product[]> = ({ queryKey }) =>
  fetcher
    .get<ProductsListResponse>({ url: `/products/category/${queryKey[1]}` })
    .then((res) => res[0]?.products ?? []);

export async function getStaticProps(context: GetStaticPropsContext) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    [CategoriesQueryKey, context.params?.id],
    getProduct
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { id: 'smartphones' } },
      { params: { id: 'laptops' } },
      { params: { id: 'fragrances' } },
    ],
    fallback: true,
  };
}

const SingleCategoryPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data: products } = useQuery({
    queryKey: [CategoriesQueryKey, id],
    initialData: [],
    enabled: !!id,
    queryFn: getProduct,
  });

  const categoryName = capitalize(id);

  return (
    <>
      <Head>
        <title>{categoryName}</title>
      </Head>

      <section className="mt-32 h-fit py-4 px-8">
        <h2 className="mb-8 text-3xl font-bold">{categoryName}</h2>

        <div className="grid grid-cols-5 gap-4">
          {products.map((el) => (
            <ProductCard product={el} key={el.id} />
          ))}
        </div>
      </section>
    </>
  );
};
export default SingleCategoryPage;
