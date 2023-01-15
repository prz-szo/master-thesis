import { Spinner } from '@chakra-ui/react';
import { capitalize } from '@common/utils';
import {
  categoriesFetcher,
  CategoriesQueryKey,
  categoryProductsFetcher,
  useCategoryProducts,
} from '@modules/category';
import { QueryClient } from '@tanstack/query-core';
import { dehydrate } from '@tanstack/react-query';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

export async function getStaticProps(context: GetStaticPropsContext) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    [CategoriesQueryKey, context.params?.id],
    categoryProductsFetcher
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export async function getStaticPaths() {
  const categories = await categoriesFetcher();
  return {
    paths: categories.map((category) => ({ params: { id: category } })),
    fallback: true,
  };
}

const SingleCategoryPage = () => {
  const router = useRouter();
  const { id = '' } = router.query as { id: string };

  const { categoryProducts, category, areProductsLoading } =
    useCategoryProducts(id);

  const categoryName = capitalize(category);

  return (
    <>
      <Head>
        <title>{categoryName}</title>
      </Head>

      <section className="mt-20 h-fit">
        <div className="flex flex-col items-center justify-center">
          <h2 className="mb-8 text-3xl font-bold">{categoryName}</h2>

          <div className="grid auto-cols-max grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categoryProducts.map((el) => (
              <div key={el.id}>{JSON.stringify(el, null, 4)}</div>
            ))}
          </div>

          {areProductsLoading ? <Spinner /> : null}
        </div>
      </section>
    </>
  );
};
export default SingleCategoryPage;
